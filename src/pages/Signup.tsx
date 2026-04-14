import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Signup = () => (
  <div className="min-h-screen bg-background flex items-center justify-center px-4">
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">TechClub</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join the community</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
          <Input placeholder="Your full name" className="h-9 text-sm bg-card border-border" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
          <Input type="email" placeholder="you@example.com" className="h-9 text-sm bg-card border-border" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">College ID</label>
          <Input placeholder="e.g. CS2024001" className="h-9 text-sm bg-card border-border" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
          <Input type="password" placeholder="••••••••" className="h-9 text-sm bg-card border-border" />
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 text-sm">
          Create Account
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">or</span></div>
      </div>

      <Button variant="outline" className="w-full h-9 text-sm border-border hover:bg-accent">
        Continue with Google
      </Button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </div>
  </div>
);

export default Signup;
