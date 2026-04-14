import { useAuth } from "@/contexts/AuthContext";
import GuestNavbar from "./navigation/GuestNavbar";
import MemberNavbar from "./navigation/MemberNavbar";
import AdminNavbar from "./navigation/AdminNavbar";

const Navbar = () => {
  const { session, role, loading } = useAuth();

  if (loading) {
    // Return a skeleton or an empty navbar shell to prevent layout shift
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 h-16">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10 animate-pulse" />
          <div className="ml-3 w-20 h-4 bg-white/5 rounded animate-pulse" />
        </div>
      </nav>
    );
  }

  // Choose the navbar based on authentication status and role
  if (!session) {
    return <GuestNavbar />;
  }

  if (role === "admin") {
    return <AdminNavbar />;
  }

  // Default to MemberNavbar for authenticated users
  return <MemberNavbar />;
};

export default Navbar;
