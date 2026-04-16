import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";


const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading, session } = useAuth();

  useEffect(() => {
    if (loading || !session || !profile) return;

    // Skip onboarding check for admins, but also move them away from the onboarding page if they land there
    if (profile.role === "admin") {
      if (location.pathname === "/onboarding") {
        navigate("/");
      }
      return;
    }

    const isAuthPage = ["/login", "/signup"].includes(location.pathname);
    const isOnboardingPage = location.pathname === "/onboarding";
    const hasOnboarded = !!(profile.student_code && profile.programme_name);

    if (!hasOnboarded) {
      if (!isOnboardingPage) {
        navigate("/onboarding");
      }
    } else {
      // If user is already onboarded, don't let them stay on auth or onboarding pages
      if (isAuthPage || isOnboardingPage) {
        navigate("/");
      }
    }

  }, [navigate, location.pathname, profile, loading, session]);


  return <>{children}</>;
};

export default OnboardingCheck;
