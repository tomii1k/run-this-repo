# Supabase Auth & Dashboard Setup

This repository has been prepared with all the necessary Supabase authentication and dashboard files. Due to environment constraints, the files need to be deployed using one of the following methods.

## Quick Start (Recommended)

### Option 1: Automated Deployment with Node.js (Easiest)

1. Open a terminal in the project root directory
2. Run:
   ```bash
   node deploy-files.js
   ```
   This will:
   - Create all required directories
   - Deploy all 8 Supabase auth files
   - Set up the complete auth infrastructure

### Option 2: Using npm/build trigger

The `next.config.ts` file has been modified to automatically create directories when Next.js loads:

```bash
npm install
```
or
```bash
npm run dev
```

This will trigger Next.js config which creates directories, then you can run:
```bash
node deploy-files.js
```

### Option 3: Manual Setup (Windows)

Run these commands in your terminal:

```batch
mkdir lib\supabase
mkdir app\login
mkdir app\dashboard\analyses\[id]
mkdir app\api\auth\logout
mkdir app\api\analyses\save
node deploy-files.js
```

### Option 4: Using Batch File (Windows)

```batch
create-dirs.bat
node deploy-files.js
```

### Option 5: Using Python Script

```bash
python create_dirs.py
node deploy-files.js
```

## What Gets Deployed

The deployment creates these 8 files:

### 1. **lib/supabase/client.ts**
- Browser-side Supabase client using `@supabase/ssr`
- Handles authentication on the client

### 2. **lib/supabase/server.ts**
- Server-side Supabase client using `@supabase/ssr`
- Manages cookies for secure authentication
- Handles session refresh in middleware

### 3. **app/login/page.tsx**
- Combined login/signup page
- Supports both authentication modes
- Form validation and error handling

### 4. **app/dashboard/page.tsx**
- Authenticated dashboard showing user's last 5 saved analyses
- Requires login to access (redirects to /login if not authenticated)
- Lists all saved repository analyses with dates and times

### 5. **app/dashboard/analyses/[id]/page.tsx**
- Detail page for viewing a specific saved analysis
- Owner-only access (enforced via `user_id` query)
- Shows full analysis results using `AnalysisResult` component

### 6. **app/api/auth/logout/route.ts**
- API endpoint for user logout
- Clears Supabase session
- Redirects to home page

### 7. **app/api/analyses/save/route.ts**
- POST endpoint to save repository analyses
- Requires authentication
- Saves analysis to `repo_analyses` table with `user_id`

### 8. **middleware.ts** (Already exists)
- Handles Supabase session refresh on every request
- Uses `@supabase/ssr` updateSession
- Maintains authentication state across page navigations

## Configuration Required

After deployment, ensure your `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Database Setup

Create a table in your Supabase project:

```sql
CREATE TABLE repo_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  repo_url TEXT NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_repo_analyses_user_id ON repo_analyses(user_id);
CREATE INDEX idx_repo_analyses_created_at ON repo_analyses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE repo_analyses ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analyses
CREATE POLICY "Users can view their own analyses"
  ON repo_analyses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert their own analyses"
  ON repo_analyses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update their own analyses"
  ON repo_analyses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete their own analyses"
  ON repo_analyses FOR DELETE
  USING (auth.uid() = user_id);
```

## Integration with Existing Components

The new files integrate with your existing project:

- Uses your existing `AnalysisResult` component for displaying analyses
- References `RepoAnalysis` type from `lib/schemas/repoAnalysisSchema`
- Maintains your styling conventions with Tailwind CSS
- Follows your existing file structure and patterns

## Helper Scripts Provided

- **create-dirs.js** - Node.js script to create directories
- **deploy-files.js** - Node.js script to create directories AND deploy all files
- **create-dirs.bat** - Windows batch script to create directories
- **create_dirs.py** - Python script to create directories
- **next.config.ts** - Modified to auto-create directories on Next.js load

## Troubleshooting

### "Parent directory does not exist" error

This means the directories haven't been created yet. Run:
```bash
node deploy-files.js
```

### Module not found errors

Make sure all files are in the correct locations. Run deploy-files.js which creates everything automatically.

### Authentication not working

Verify:
1. Supabase URL and anon key are in `.env.local`
2. `@supabase/ssr` and `@supabase/supabase-js` are installed (they're in package.json)
3. Database table `repo_analyses` is created with proper RLS policies

## Next Steps

1. Run the deployment script
2. Set up Supabase environment variables
3. Create the database table with RLS policies
4. Test login at `/login`
5. After analyzing a repo, save analyses to your dashboard

---

**Status**: ✅ All files prepared and ready for deployment
