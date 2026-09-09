import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, LogOut, User, ShieldCheck, BarChart3, Layout, Calendar,
  Megaphone, Users, BookOpen, Settings, ScrollText, Image,
  FileText, Crown, FileSpreadsheet, Home, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile, session, signOut } = useAuth();
  const location = useLocation();

  const primaryLinks = [
    { label: "Overview", href: "/admin", icon: BarChart3, exact: true },
    { label: "Moderation", href: "/admin/moderation", icon: Layout },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Broadcasts", href: "/admin/broadcasts", icon: Megaphone },
    { label: "Directory", href: "/admin/directory", icon: Users },
  ];

  const moreLinks = [
    { label: "Blog", href: "/admin/blog", icon: FileText },
    { label: "Gallery", href: "/admin/gallery", icon: Image },
    { label: "Team", href: "/admin/team", icon: Crown },
    { label: "Resources", href: "/admin/resources", icon: BookOpen },
    { label: "Homepage", href: "/admin/homepage", icon: Home },
    { label: "Reports", href: "/admin/reports", icon: FileSpreadsheet },
    { label: "Audit Log", href: "/admin/audit-log", icon: ScrollText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const allLinks = [...primaryLinks, ...moreLinks];

  const isActive = (link: { href: string; exact?: boolean }) => {
    if (link.exact) return location.pathname === link.href;
    return location.pathname.startsWith(link.href);
  };

  const isMoreActive = moreLinks.some(l => isActive(l));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden xl:inline">Admin</span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5 mx-4">
            {primaryLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                  {active && (
                    <motion.div layoutId="admin-nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`relative flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider transition-colors ${
                  isMoreActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>
                  More <ChevronDown size={12} />
                  {isMoreActive && (
                    <motion.div layoutId="admin-nav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-52">
                <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Content & Tools</DropdownMenuLabel>
                {moreLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.label} asChild className={`cursor-pointer gap-2 ${isActive(link) ? "text-primary" : ""}`}>
                      <Link to={link.href}>
                        <Icon size={14} /> {link.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || <User size={14}/>}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">Department Administrator</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer gap-2">
                  <Link to="/profile"><User size={16} /> Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                  <LogOut size={16} /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-foreground p-2 hover:bg-accent rounded-lg">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden py-4 border-t border-border"
            >
              <div className="grid grid-cols-2 gap-1 mb-4">
                {allLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link);
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors ${
                        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-10 px-4">
                    <User size={16} /> My Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start gap-2 h-10 px-4 text-destructive">
                  <LogOut size={16} /> Log out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default AdminNavbar;
