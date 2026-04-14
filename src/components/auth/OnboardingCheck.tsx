import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If we are on login/signup/onboarding, don't redirect away to onboarding (except if needed)
        const isAuthPage = ["/login", "/signup", "/onboarding"].includes(location.pathname);
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("student_code, programme_name")
          .eq("id", session.user.id)
          .single();

        if (!profile?.student_code || !profile?.programme_name) {
          if (location.pathname !== "/onboarding") {
            navigate("/onboarding");
          }
        } else if (location.pathname === "/onboarding") {
          // If profile is complete but user is on onboarding, send them home
          navigate("/");
        }
      }
    };

    checkProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        checkProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

export default OnboardingCheck;
