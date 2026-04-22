import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, BarChart2, TrendingUp, Users, Layers, Megaphone, Calendar } from "lucide-react";

interface Counts {
  members: number;
  approvedProjects: number;
  pendingProjects: number;
  events: number;
  registrations: number;
  activeBroadcasts: number;
}

const ReportsPanel = () => {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [m, ap, pp, ev, reg, br] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("event_registrations").select("id", { count: "exact", head: true }),
        supabase.from("announcements").select("id", { count: "exact", head: true }).eq("is_active", true),
      ]);
      setCounts({
        members: m.count ?? 0,
        approvedProjects: ap.count ?? 0,
        pendingProjects: pp.count ?? 0,
        events: ev.count ?? 0,
        registrations: reg.count ?? 0,
        activeBroadcasts: br.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !counts) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  const cards = [
    { label: "Total Members", value: counts.members, icon: Users },
    { label: "Approved Projects", value: counts.approvedProjects, icon: Layers },
    { label: "Pending Review", value: counts.pendingProjects, icon: TrendingUp },
    { label: "Events", value: counts.events, icon: Calendar },
    { label: "Event Registrations", value: counts.registrations, icon: BarChart2 },
    { label: "Active Broadcasts", value: counts.activeBroadcasts, icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart2 size={20} className="text-primary" /> Reports
        </h2>
        <p className="text-sm text-muted-foreground">A high-level snapshot of community health.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <c.icon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold tabular-nums">{c.value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="border border-dashed border-border rounded-xl p-6 text-sm text-muted-foreground">
        More detailed time-series and per-cohort breakdowns can be added here. This panel pulls live counts directly from the database.
      </div>
    </div>
  );
};

export default ReportsPanel;
