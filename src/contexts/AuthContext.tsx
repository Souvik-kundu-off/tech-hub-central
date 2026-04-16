import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface Profile {
  full_name: string;
  avatar_url: string;
  role: string;
  student_code?: string;
  programme_name?: string;
  phone_number?: string;
  github_url?: string;
  linkedin_url?: string;
  points?: number;
  projects_count?: number;
  wins_count?: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log(`Auth: Fetching profile for ${userId}...`);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Use maybeSingle to avoid throw on missing row
      
      if (error) {
        console.error("Auth: Profile fetch error:", error);
        setProfile(null);
        return;
      }

      if (data) {
        console.log("Auth: Profile loaded successfully", data.role);
        setProfile(data);
      } else {
        console.warn("Auth: No profile row found in database");
        setProfile(null);
      }
    } catch (error) {
      console.error("Auth: Unexpected error fetching profile:", error);
      setProfile(null);
    }
  };

  const lastUserId = React.useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        console.log("Auth: Initializing...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        setSession(initialSession);
        const initialUser = initialSession?.user ?? null;
        setUser(initialUser);

        if (initialUser) {
          console.log("Auth: Session found for user", initialUser.id);
          lastUserId.current = initialUser.id;
          await fetchProfile(initialUser.id);
        } else {
          console.log("Auth: No session found");
        }
      } catch (error) {
        console.error("Auth: Initialization error", error);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log("Auth: Initialization complete");
        }
      }
    };

    initialize();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(`Auth: Event [${event}] triggered`);
      
      if (!mounted) return;

      setSession(currentSession);
      const newUser = currentSession?.user ?? null;
      
      if (newUser?.id !== lastUserId.current) {
        console.log(`Auth: User changed ${lastUserId.current} -> ${newUser?.id}`);
        lastUserId.current = newUser?.id ?? null;
        setUser(newUser);
        
        if (newUser) {
          setLoading(true);
          await fetchProfile(newUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        // Force reset if signed out even if ID matches (though ID should be null/diff)
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const value = {
    session,
    user,
    profile,
    role: profile?.role ?? null,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
