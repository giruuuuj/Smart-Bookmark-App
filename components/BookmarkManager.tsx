'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Bookmark {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

export default function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchBookmarks(user.id)
      }
    }
    getUser()

    // Real-time subscription
    const subscription = supabase
      .channel('bookmarks')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookmarks',
          filter: `user_id=eq.${user?.id}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks(prev => [...prev, payload.new as Bookmark])
          } else if (payload.eventType === 'DELETE') {
            setBookmarks(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user])

  const fetchBookmarks = async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
  }

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !url.trim()) return

    setLoading(true)
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        title: title.trim(),
        url: url.trim(),
        user_id: user.id
      })

    if (error) {
      console.error('Error adding bookmark:', error)
    } else {
      setTitle('')
      setUrl('')
    }
    setLoading(false)
  }

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookmarks</h1>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <form onSubmit={addBookmark} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Bookmark</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter bookmark title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Bookmark'}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold p-6 border-b">Your Bookmarks</h2>
          {bookmarks.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No bookmarks yet. Add your first bookmark above!</p>
          ) : (
            <div className="divide-y">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{bookmark.title}</h3>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {bookmark.url}
                    </a>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
