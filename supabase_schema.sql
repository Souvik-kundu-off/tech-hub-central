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

-- ============================================================
-- 7. PROJECT EXTENSIONS (images, tags, team, draft state)
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS team_members TEXT[] DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
-- Status now allows: draft, pending, approved, rejected, changes_requested, paused

-- Allow authors to update/delete own projects
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authors can update own projects.') THEN
        CREATE POLICY "Authors can update own projects." ON projects FOR UPDATE USING (auth.uid() = author_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authors can delete own projects.') THEN
        CREATE POLICY "Authors can delete own projects." ON projects FOR DELETE USING (auth.uid() = author_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete all projects.') THEN
        CREATE POLICY "Admins can delete all projects." ON projects FOR DELETE USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- ============================================================
-- 8. EVENT REGISTRATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users view own registrations.') THEN
        CREATE POLICY "Users view own registrations." ON event_registrations FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users register self.') THEN
        CREATE POLICY "Users register self." ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users unregister self.') THEN
        CREATE POLICY "Users unregister self." ON event_registrations FOR DELETE USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage registrations.') THEN
        CREATE POLICY "Admins manage registrations." ON event_registrations FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- ============================================================
-- 9. EVENT MANAGEMENT (admin)
-- ============================================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS register_url TEXT;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Events viewable by everyone.') THEN
        CREATE POLICY "Events viewable by everyone." ON events FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins manage events.') THEN
        CREATE POLICY "Admins manage events." ON events FOR ALL USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- ============================================================
-- 10. PROJECT IMAGES STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Project images public read' AND tablename = 'objects') THEN
        CREATE POLICY "Project images public read" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users upload project images' AND tablename = 'objects') THEN
        CREATE POLICY "Authenticated users upload project images" ON storage.objects FOR INSERT WITH CHECK (
            bucket_id = 'project-images' AND auth.role() = 'authenticated'
        );
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users delete own project images' AND tablename = 'objects') THEN
        CREATE POLICY "Users delete own project images" ON storage.objects FOR DELETE USING (
            bucket_id = 'project-images' AND (auth.uid())::text = (storage.foldername(name))[1]
        );
    END IF;
END $$;

-- =============================================================
-- 11. ROLES SYSTEM (app_role enum, user_roles, has_role, sync)
-- =============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM (
      'superadmin','admin','faculty','event_manager','content_editor','moderator','member'
    );
  END IF;
END $$;

-- Ensure all enum values exist (idempotent re-runs)
DO $$
BEGIN
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'superadmin'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'faculty'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'event_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_editor'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles));
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY[
    'superadmin','admin','faculty','event_manager','content_editor','moderator'
  ]::public.app_role[]);
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users see own roles') THEN
    CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Staff can read all roles') THEN
    CREATE POLICY "Staff can read all roles" ON public.user_roles FOR SELECT USING (public.is_staff(auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Superadmins manage roles') THEN
    CREATE POLICY "Superadmins manage roles" ON public.user_roles FOR ALL
      USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin']::public.app_role[]))
      WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin']::public.app_role[]));
  END IF;
END $$;

-- Backfill from profiles.role
INSERT INTO public.user_roles (user_id, role)
SELECT p.id,
  CASE
    WHEN p.role IN ('superadmin','admin','faculty','event_manager','content_editor','moderator')
      THEN p.role::public.app_role
    ELSE 'member'::public.app_role
  END
FROM public.profiles p
ON CONFLICT (user_id, role) DO NOTHING;

-- Keep profiles.role in sync (denormalized cache of highest role)
CREATE OR REPLACE FUNCTION public.sync_profile_primary_role(_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE primary_role TEXT;
BEGIN
  SELECT role::text INTO primary_role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY CASE role
    WHEN 'superadmin' THEN 1 WHEN 'admin' THEN 2 WHEN 'faculty' THEN 3
    WHEN 'event_manager' THEN 4 WHEN 'content_editor' THEN 5
    WHEN 'moderator' THEN 6 WHEN 'member' THEN 7
  END LIMIT 1;
  UPDATE public.profiles SET role = COALESCE(primary_role, 'member') WHERE id = _user_id;
END $$;

CREATE OR REPLACE FUNCTION public.user_roles_sync_trigger()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.sync_profile_primary_role(OLD.user_id); RETURN OLD;
  ELSE
    PERFORM public.sync_profile_primary_role(NEW.user_id); RETURN NEW;
  END IF;
END $$;

DROP TRIGGER IF EXISTS user_roles_sync ON public.user_roles;
CREATE TRIGGER user_roles_sync
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE PROCEDURE public.user_roles_sync_trigger();

-- Auto-assign 'member' role on new auth user
CREATE OR REPLACE FUNCTION public.assign_default_role()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.assign_default_role();

-- Resync existing profiles
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT DISTINCT user_id FROM public.user_roles LOOP
    PERFORM public.sync_profile_primary_role(r.user_id);
  END LOOP;
END $$;

-- =============================================================
-- 12. EVENTS v2: inside/outside types + dynamic form schema
-- =============================================================
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'outside';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS form_schema JSONB DEFAULT '[]'::jsonb;
UPDATE public.events SET event_type = COALESCE(event_type, 'outside') WHERE event_type IS NULL;

ALTER TABLE public.event_registrations ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}'::jsonb;

-- =============================================================
-- 13. ROLE-AWARE RLS (replace old admin-only policies)
-- =============================================================
DROP POLICY IF EXISTS "Admins can update all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Staff manage profiles" ON public.profiles;
CREATE POLICY "Staff manage profiles" ON public.profiles FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin']::public.app_role[]));

DROP POLICY IF EXISTS "Admins can update all projects." ON public.projects;
DROP POLICY IF EXISTS "Mods update projects" ON public.projects;
CREATE POLICY "Mods update projects" ON public.projects FOR UPDATE
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','moderator']::public.app_role[]));

DROP POLICY IF EXISTS "Admins can delete all projects." ON public.projects;
DROP POLICY IF EXISTS "Mods delete projects" ON public.projects;
CREATE POLICY "Mods delete projects" ON public.projects FOR DELETE
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','moderator']::public.app_role[]));

DROP POLICY IF EXISTS "Admins can manage announcements." ON public.announcements;
DROP POLICY IF EXISTS "Editors manage announcements" ON public.announcements;
CREATE POLICY "Editors manage announcements" ON public.announcements FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','content_editor','event_manager']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','content_editor','event_manager']::public.app_role[]));

DROP POLICY IF EXISTS "Admins can manage resources." ON public.resources;
DROP POLICY IF EXISTS "Editors manage resources" ON public.resources;
CREATE POLICY "Editors manage resources" ON public.resources FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','content_editor']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','content_editor']::public.app_role[]));

DROP POLICY IF EXISTS "Admins manage events." ON public.events;
DROP POLICY IF EXISTS "Event managers manage events" ON public.events;
CREATE POLICY "Event managers manage events" ON public.events FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','event_manager']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','event_manager']::public.app_role[]));

DROP POLICY IF EXISTS "Admins manage registrations." ON public.event_registrations;
DROP POLICY IF EXISTS "Event staff view registrations" ON public.event_registrations;
DROP POLICY IF EXISTS "Event staff manage registrations" ON public.event_registrations;
CREATE POLICY "Event staff view registrations" ON public.event_registrations FOR SELECT
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','event_manager','faculty']::public.app_role[]));
CREATE POLICY "Event staff manage registrations" ON public.event_registrations FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','event_manager']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin','event_manager']::public.app_role[]));

DROP POLICY IF EXISTS "Admins can manage points history." ON public.points_history;
DROP POLICY IF EXISTS "Admins manage points" ON public.points_history;
DROP POLICY IF EXISTS "Faculty read points" ON public.points_history;
CREATE POLICY "Admins manage points" ON public.points_history FOR ALL
  USING (public.has_any_role(auth.uid(), ARRAY['superadmin','admin']::public.app_role[]))
  WITH CHECK (public.has_any_role(auth.uid(), ARRAY['superadmin','admin']::public.app_role[]));
CREATE POLICY "Faculty read points" ON public.points_history FOR SELECT
  USING (public.has_role(auth.uid(), 'faculty'::public.app_role));
