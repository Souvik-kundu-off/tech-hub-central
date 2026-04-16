-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES: Create or Update
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  student_code TEXT,
  programme_name TEXT,
  phone_number TEXT,
  role TEXT DEFAULT 'member',
  points INTEGER DEFAULT 0,
  projects_count INTEGER DEFAULT 0,
  wins_count INTEGER DEFAULT 0,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resilience: Add columns if they missed the CREATE TABLE
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_code TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS programme_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- 2. PROJECTS: Create or Update
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  stack TEXT[],
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  category TEXT,
  github_url TEXT,
  live_url TEXT,
  status TEXT DEFAULT 'pending',
  review_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Resilience: Ensure status and review_note exist for existing tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS review_note TEXT;

-- 3. POINTS HISTORY
CREATE TABLE IF NOT EXISTS points_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  location TEXT,
  type TEXT,
  spots INTEGER,
  mode TEXT,
  is_upcoming BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ANNOUNCEMENTS (Global Broadcasts)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'info', -- 'info', 'warning', 'success', 'critical'
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ 
BEGIN
    -- Profiles
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone.') THEN
        CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile.') THEN
        CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
    END IF;
    -- NEW: Admins can update all profiles (for management)
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all profiles.') THEN
        CREATE POLICY "Admins can update all profiles." ON profiles FOR UPDATE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    -- Projects
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Projects are viewable by everyone.') THEN
        CREATE POLICY "Projects are viewable by everyone." ON projects FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own projects.') THEN
        CREATE POLICY "Users can insert own projects." ON projects FOR INSERT WITH CHECK (auth.uid() = author_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update all projects.') THEN
        CREATE POLICY "Admins can update all projects." ON projects FOR UPDATE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    -- Points History
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own points history.') THEN
        CREATE POLICY "Users can view own points history." ON points_history FOR SELECT USING (auth.uid() = user_id);
    END IF;
    -- NEW: Admins can manage points history
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage points history.') THEN
        CREATE POLICY "Admins can manage points history." ON points_history FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    -- Announcements
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Announcements are viewable by everyone.') THEN
        CREATE POLICY "Announcements are viewable by everyone." ON announcements FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage announcements.') THEN
        CREATE POLICY "Admins can manage announcements." ON announcements FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;


-- FUNCTION: Process project approval and award points
CREATE OR REPLACE FUNCTION process_project_review()
RETURNS TRIGGER AS $$
BEGIN
  -- If project is marked as approved
  IF (OLD.status != 'approved' AND NEW.status = 'approved') THEN
    UPDATE profiles 
    SET points = points + 50,
        projects_count = projects_count + 1
    WHERE id = NEW.author_id;

    INSERT INTO points_history (user_id, amount, action_type, description)
    VALUES (NEW.author_id, 50, 'PROJECT_APPROVED', 'Earned for project submission: ' || NEW.title);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Award points on approval
DROP TRIGGER IF EXISTS on_project_approved ON projects;
CREATE TRIGGER on_project_approved
  AFTER UPDATE OF status ON projects
  FOR EACH ROW
  EXECUTE PROCEDURE process_project_review();

-- FUNCTION: Handle new user (Signup) + Welcome Bonus
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    initial_points INTEGER := 5;
BEGIN
  -- We use DO UPDATE to ensure the row exists and is fresh, 
  -- which prevents Foreign Key failures in subsequent steps.
  INSERT INTO public.profiles (id, full_name, email, avatar_url, points, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    initial_points,
    'member'
  ) 
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;

  -- Ensure points log is created, wrapped in its own sub-block to avoid failing the main user creation
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM points_history WHERE user_id = new.id AND action_type = 'WELCOME_BONUS') THEN
      INSERT INTO public.points_history (user_id, amount, action_type, description)
      VALUES (new.id, initial_points, 'WELCOME_BONUS', 'Initial bonus for joining the hub!');
    END IF;
  EXCEPTION WHEN OTHERS THEN
    -- Log error or just ignore it to ensure the user CAN at least sign in/be invited
    RAISE WARNING 'Could not insert welcome bonus for user %: %', new.id, SQLERRM;
  END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- FUNCTION: Check for profile completion rewards
CREATE OR REPLACE FUNCTION check_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- If profile transitions to complete (all required fields filled)
    IF (OLD.student_code IS NULL AND NEW.student_code IS NOT NULL AND 
        OLD.programme_name IS NULL AND NEW.programme_name IS NOT NULL) THEN
        
        UPDATE profiles SET points = points + 10 WHERE id = NEW.id;
        
        INSERT INTO points_history (user_id, amount, action_type, description)
        VALUES (NEW.id, 10, 'PROFILE_COMPLETE', 'Bonus for completing your profile details.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER: Reward on profile completion
DROP TRIGGER IF EXISTS on_profile_completed ON profiles;
CREATE TRIGGER on_profile_completed
  AFTER UPDATE OF student_code, programme_name ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE check_profile_completion();
-- 6. RESOURCES (Community Library)
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'tool', -- 'tool', 'tutorial', 'template', 'guide'
  category TEXT,
  added_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS for Resources
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    -- Resources Policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Resources are viewable by everyone.') THEN
        CREATE POLICY "Resources are viewable by everyone." ON resources FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage resources.') THEN
        CREATE POLICY "Admins can manage resources." ON resources FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;
