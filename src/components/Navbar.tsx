import { useAuth } from "@/contexts/AuthContext";
import GuestNavbar from "./navigation/GuestNavbar";
import MemberNavbar from "./navigation/MemberNavbar";
import StaffNavbar from "./navigation/StaffNavbar";
import { isStaff } from "@/lib/permissions";

const Navbar = () => {
  const { session, role, loading } = useAuth();

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 h-16">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10 animate-pulse" />
          <div className="ml-3 w-20 h-4 bg-white/5 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  if (!session) return <GuestNavbar />;
  if (isStaff(role)) return <StaffNavbar />;
  return <MemberNavbar />;
};

export default Navbar;
