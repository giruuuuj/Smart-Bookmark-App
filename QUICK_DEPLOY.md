# 🚀 Quick Deployment Guide

## Step 1: Set up Supabase

### 1A. Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign up/login with GitHub
4. Click "New Project"
5. Choose your organization
6. Set project name: `smart-bookmark-app`
7. Set a strong database password
8. Choose a region closest to you
9. Click "Create new project"

### 1B. Set up Google OAuth
1. In your Supabase project, go to **Authentication** → **Providers**
2. Find **Google** in the list
3. Enable the Google provider
4. You'll need:
   - Google Client ID
   - Google Client Secret
5. Get these from: https://console.cloud.google.com/
   - Create new project → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

### 1C. Create Database Schema
Go to **SQL Editor** → **New query** and run:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  url text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for security
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

### 1D. Enable Realtime
1. Go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Toggle the switch to enable realtime
4. Click "Save"

### 1E. Get Environment Variables
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 2: Deploy to Vercel

### 2A. Import Repository
1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Import GitHub repository: `https://github.com/giruuuuj/Smart-Bookmark-App.git`
4. Click "Import"

### 2B. Add Environment Variables
In Vercel project settings:
1. Go to **Environment Variables**
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Click "Save"

### 2C. Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Get your live URL!

## Step 3: Test Your App
1. Open your deployed app URL
2. Click "Sign in with Google"
3. Add a bookmark
4. Open the app in another tab to see real-time updates
5. Test adding and deleting bookmarks

## 🎉 Your Smart Bookmark App is Live!
