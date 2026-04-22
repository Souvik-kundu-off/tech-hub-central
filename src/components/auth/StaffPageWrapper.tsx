/**
 * StaffPageWrapper
 * Drop-in replacement for the old per-page admin guard.
 * Checks that the current user is a staff role that can read the given tab.
 * If canWrite is false, children receive a readonly prop so they can disable edit controls.
 */
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isStaff, canRead, canWrite, StaffTab } from "@/lib/permissions";
import { Loader2, ShieldOff } from "lucide-react";
import PageLayout from "@/components/PageLayout";

interface Props {
  tab: StaffTab;
  children: (opts: { readonly: boolean }) => ReactNode;
}

const StaffPageWrapper = ({ tab, children }: Props) => {
  const { role, loading: authLoading } = useAuth();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (authLoading) {
      const t = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(t);
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

  // Not a staff member, or no read access to this tab → deny
  if (!isStaff(role) || !canRead(role, tab)) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <ShieldOff size={48} className="text-destructive" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">You don't have permission to view this page.</p>
        </div>
      </PageLayout>
    );
  }

  // Has read access — pass readonly=true if they can't write
  const readonly = !canWrite(role, tab);
  return <>{children({ readonly })}</>;
};

export default StaffPageWrapper;
