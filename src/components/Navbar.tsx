import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              TechClub
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/leaderboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                🏆 Leaderboard
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="gradient-primary text-primary-foreground hover:opacity-90">
                Join Us
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-foreground p-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/30 animate-slide-up">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3 mt-2 border-t border-border/30">
                <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-primary/50 text-primary">Login</Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gradient-primary text-primary-foreground">Join Us</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
