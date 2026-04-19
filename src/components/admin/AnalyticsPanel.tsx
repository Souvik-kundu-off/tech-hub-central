import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3, Users, Layout, Trophy, Loader2, Clock, CheckCircle2, FileText, Calendar,
} from "lucide-react";
import { format } from "date-fns";

interface Stats {
  members: number;
  projects: number;
  pending: number;
  approved: number;
  events: number;
  totalPoints: number;
  recentSignups: Array<{ id: string; full_name: string; email: string; created_at: string }>;
  topMembers: Array<{ id: string; full_name: string; points: number }>;
  pendingProjects: Array<{ id: string; title: string; author_name: string; created_at: string }>;
}

const AnalyticsPanel = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [membersC, projectsC, pendingC, approvedC, eventsC, profiles, recent, top, pending] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("points"),
        supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("profiles").select("id, full_name, points").order("points", { ascending: false }).limit(5),
        supabase.from("projects").select("id, title, author_name, created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
      ]);

      const totalPoints = (profiles.data || []).reduce((s: number, p: any) => s + (p.points || 0), 0);

      setStats({
        members: membersC.count || 0,
        projects: projectsC.count || 0,
        pending: pendingC.count || 0,
        approved: approvedC.count || 0,
        events: eventsC.count || 0,
        totalPoints,
        recentSignups: (recent.data as any) || [],
        topMembers: (top.data as any) || [],
        pendingProjects: (pending.data as any) || [],
      });
    } catch (e: any) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading || !stats) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  const cards = [
    { label: "Members",         value: stats.members,     icon: Users,       accent: "text-blue-500" },
    { label: "Projects",        value: stats.projects,    icon: Layout,      accent: "text-emerald-500" },
    { label: "Pending Review",  value: stats.pending,     icon: Clock,       accent: "text-amber-500" },
    { label: "Approved Builds", value: stats.approved,    icon: CheckCircle2,accent: "text-emerald-500" },
    { label: "Events",          value: stats.events,      icon: Calendar,    accent: "text-purple-500" },
    { label: "Total Credits",   value: stats.totalPoints, icon: Trophy,      accent: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 size={20} className="text-primary" /> Hub Analytics
        </h2>
        <p className="text-sm text-muted-foreground">Live overview of community activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="border border-border rounded-lg p-4 bg-card">
              <Icon size={16} className={`${c.accent} mb-2`} />
              <p className="text-2xl font-bold tabular-nums">{c.value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-1">{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <ListBlock title="Pending Reviews" icon={Clock} empty="Nothing pending. Inbox zero." items={
          stats.pendingProjects.map((p) => ({
            primary: p.title, secondary: `by ${p.author_name}`, meta: format(new Date(p.created_at), "MMM d"),
          }))
        } />
        <ListBlock title="Top Members" icon={Trophy} empty="No members yet." items={
          stats.topMembers.map((m) => ({
            primary: m.full_name || "Anonymous", secondary: "Hub member", meta: `${m.points} pts`,
          }))
        } />
        <ListBlock title="Recent Signups" icon={Users} empty="No new members." items={
          stats.recentSignups.map((m) => ({
            primary: m.full_name || "New member", secondary: m.email, meta: format(new Date(m.created_at), "MMM d"),
          }))
        } />
      </div>
    </div>
  );
};

const ListBlock = ({
  title, icon: Icon, items, empty,
}: {
  title: string; icon: any; empty: string;
  items: Array<{ primary: string; secondary: string; meta: string }>;
}) => (
  <div className="border border-border rounded-lg p-5 bg-card">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
      <Icon size={14} className="text-muted-foreground" />
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-muted-foreground py-6 text-center">{empty}</p>
    ) : (
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between gap-2 text-sm">
            <div className="min-w-0">
              <p className="font-medium truncate">{it.primary}</p>
              <p className="text-[11px] text-muted-foreground truncate">{it.secondary}</p>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium tabular-nums shrink-0">{it.meta}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default AnalyticsPanel;
