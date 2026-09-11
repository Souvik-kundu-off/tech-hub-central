import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { isEmailAllowedForRegistration, ALLOWED_UNIVERSITY_DOMAIN } from "@/lib/auth-policy";

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
  const [authReady, setAuthReady] = useState(false);

  const fetchProfile = async (userId: string, currentUserEmail?: string | null) => {
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
        console.log("Auth: Existing profile loaded successfully", data.role);
        setProfile(data);
      } else {
        // No existing profile row found -> This is a NEW sign-up attempt!
        console.warn("Auth: No profile row found in database for user:", currentUserEmail);
        if (!isEmailAllowedForRegistration(currentUserEmail)) {
          console.error(`Auth: Blocking new sign-up attempt from unauthorized email: ${currentUserEmail}`);
          toast.error(
            `Registration Restricted: Only official @${ALLOWED_UNIVERSITY_DOMAIN} emails can sign up.`,
            { duration: 6000 }
          );
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setProfile(null);
          return;
        }
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

    const applySession = (currentSession: Session | null) => {
      if (!mounted) return;

      setSession(currentSession);
      const nextUser = currentSession?.user ?? null;
      setUser(nextUser);
      setLoading(true);

      if (!nextUser) {
        lastUserId.current = null;
        setProfile(null);
        setLoading(false);
        return;
      }

      if (nextUser.id === lastUserId.current && authReady) {
        setLoading(false);
        return;
      }

      lastUserId.current = nextUser.id;
      void fetchProfile(nextUser.id, nextUser.email).finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(`Auth: Event [${event}] triggered`);
      applySession(currentSession);
      if (!authReady && mounted) {
        setAuthReady(true);
      }
    });

    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        if (!mounted) return;
        console.log("Auth: Session restored", initialSession?.user?.id ?? "none");
        applySession(initialSession);
      })
      .catch((error) => {
        console.error("Auth: Initialization error", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      })
      .finally(() => {
        if (mounted) {
          setAuthReady(true);
          console.log("Auth: Initialization complete");
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
      await fetchProfile(user.id, user.email);
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
