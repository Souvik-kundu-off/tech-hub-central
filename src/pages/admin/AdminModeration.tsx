import PageLayout from "@/components/PageLayout";
import ProjectModeration from "@/components/admin/ProjectModeration";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const AdminModeration = () => {
  const { role, loading: authLoading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  if (authLoading && !timedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Verifying Authority...</p>
        </div>
      </div>
    );
  }

  if (role !== "admin" && !authLoading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <AlertCircle size={48} className="text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">This area is reserved for Hub Overseers only.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ProjectModeration />
      </div>
    </PageLayout>
  );
};

export default AdminModeration;
