# Smart Bookmark App - Deployment Guide

## 🚀 Deploy to Vercel

1. **Import Repository in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import the GitHub repository: `https://github.com/giruuuuj/Smart-Bookmark-App.git`

2. **Add Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Deploy**
   - Click "Deploy"

## 📊 Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project

2. **Set up Google OAuth**
   - Go to Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

3. **Create Database Table**
   ```sql
   CREATE TABLE bookmarks (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     title text NOT NULL,
     url text NOT NULL,
     user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Enable RLS (Row Level Security)
   ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

   -- Create policy for users to see their own bookmarks
   CREATE POLICY "Users can view their own bookmarks" ON bookmarks
     FOR SELECT USING (auth.uid() = user_id);

   -- Create policy for users to insert their own bookmarks
   CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   -- Create policy for users to delete their own bookmarks
   CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
     FOR DELETE USING (auth.uid() = user_id);
   ```

4. **Enable Realtime**
   - Go to Database → Replication
   - Enable realtime for the `bookmarks` table

5. **Get Environment Variables**
   - Go to Project Settings → API
   - Copy the URL and anon key
   - Add them to Vercel environment variables

## ✅ Features Implemented

- ✅ Google OAuth authentication only
- ✅ Private bookmarks per user
- ✅ Real-time updates across tabs
- ✅ Add/Delete bookmarks
- ✅ Responsive Tailwind CSS design
- ✅ Next.js App Router
- ✅ Supabase Auth + Database + Realtime

## 🌐 Live URL
After deployment, your app will be available at: `https://your-app-name.vercel.app`
