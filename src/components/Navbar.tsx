import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Terminal, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm tracking-tight">TechClub</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                  location.pathname === link.href
                    ? "text-foreground bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {session ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-[13px] text-muted-foreground hover:text-foreground h-8">
                    <User className="w-4 h-4 mr-1.5" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-[13px] text-muted-foreground hover:text-destructive h-8"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-[13px] text-muted-foreground hover:text-foreground h-8">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="text-[13px] h-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    Join Us
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-foreground p-1.5">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden py-3 border-t border-border">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
                {session ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full text-[13px]">
                        <User className="w-4 h-4 mr-1.5" />
                        Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-[13px] text-muted-foreground hover:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-1.5" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" size="sm" className="w-full text-[13px]">Log in</Button>
                    </Link>
                    <Link to="/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                      <Button size="sm" className="w-full text-[13px] bg-primary text-primary-foreground">Join Us</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
