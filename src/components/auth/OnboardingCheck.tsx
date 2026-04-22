import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff } from "@/lib/permissions";

const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, session } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) return;

    const isAuthPage = ["/login", "/signup"].includes(location.pathname);
    const isOnboardingPage = location.pathname === "/onboarding";

    if (!profile) {
      if (!isOnboardingPage) navigate("/onboarding", { replace: true });
      return;
    }

    // Skip onboarding for all staff roles (admin, faculty, event_manager, etc.)
    if (isStaff(profile.role)) {
      if (isOnboardingPage || isAuthPage) navigate("/", { replace: true });
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
