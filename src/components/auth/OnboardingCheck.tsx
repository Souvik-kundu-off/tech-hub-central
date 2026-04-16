import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";


const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, session } = useAuth();

  useEffect(() => {
    if (loading) {
      console.log("OnboardingCheck: Loading auth state...");
      return;
    }

    if (!session) {
      console.log("OnboardingCheck: No session, allowing guest access to login/signup");
      return;
    }

    const isAuthPage = ["/login", "/signup"].includes(location.pathname);
    const isOnboardingPage = location.pathname === "/onboarding";

    // Case: Logged in but profile record doesn't exist yet or failed to load
    if (!profile) {
      console.log("OnboardingCheck: No profile found for user", session.user.id);
      if (!isOnboardingPage) {
        console.log("OnboardingCheck: Redirecting to onboarding (missing profile)");
        navigate("/onboarding", { replace: true });
      }
      return;
    }

    // Skip onboarding check for admins
    if (profile.role === "admin") {
      console.log("OnboardingCheck: Admin user detected");
      if (isOnboardingPage || isAuthPage) {
        navigate("/", { replace: true });
      }
      return;
    }

    const hasOnboarded = !!(profile.student_code && profile.programme_name);
    console.log("OnboardingCheck: Profile status", { hasOnboarded, path: location.pathname });

    if (!hasOnboarded) {
      if (!isOnboardingPage) {
        console.log("OnboardingCheck: Redirecting to onboarding (incomplete profile)");
        navigate("/onboarding", { replace: true });
      }
    } else {
      // If user is already onboarded, don't let them stay on auth or onboarding pages
      if (isAuthPage || isOnboardingPage) {
        console.log("OnboardingCheck: Redirecting to dashboard (already onboarded)");
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate, location.pathname, profile, loading, session]);


  return <>{children}</>;
};

export default OnboardingCheck;
