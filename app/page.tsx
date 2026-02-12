'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AuthComponent from '@/components/AuthComponent'
import BookmarkManager from '@/components/BookmarkManager'

export default function Home() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <AuthComponent />
  }

  return <BookmarkManager />
}
