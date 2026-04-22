import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart3, Users, Layout, Trophy, Loader2, Clock, CheckCircle2,
  Calendar, Megaphone, FileText, BookOpen, BookMarked, GraduationCap,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { AppRole } from "@/lib/permissions";

// ─────────── Types ───────────

interface Stat { label: string; value: number; icon: any; accent: string }
interface ListItem { primary: string; secondary: string; meta: string }

// ─────────── Shared sub-components ───────────

const StatCard = ({ label, value, icon: Icon, accent }: Stat) => (
  <div className="border border-border rounded-xl p-4 bg-card flex flex-col gap-2">
    <Icon size={16} className={accent} />
    <p className="text-2xl font-bold tabular-nums">{value}</p>
    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
  </div>
);

const ListBlock = ({
  title, icon: Icon, items, empty,
}: {
  title: string; icon: any; empty: string;
  items: ListItem[];
}) => (
  <div className="border border-border rounded-xl p-5 bg-card">
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

// ─────────── Role-specific panel components ───────────

/** admin / superadmin: full hub analytics */
const AdminOverviewPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [mc, pc, pend, appr, ec, profiles, recent, top, pendingP] = await Promise.all([
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
      setData({
        members: mc.count || 0, projects: pc.count || 0, pending: pend.count || 0,
        approved: appr.count || 0, events: ec.count || 0, totalPoints,
        recent: recent.data || [], top: top.data || [], pendingProjects: pendingP.data || [],
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const stats: Stat[] = [
    { label: "Members",        value: data.members,     icon: Users,       accent: "text-blue-500" },
    { label: "Projects",       value: data.projects,    icon: Layout,      accent: "text-emerald-500" },
    { label: "Pending Review", value: data.pending,     icon: Clock,       accent: "text-amber-500" },
    { label: "Approved",       value: data.approved,    icon: CheckCircle2,accent: "text-emerald-500" },
    { label: "Events",         value: data.events,      icon: Calendar,    accent: "text-purple-500" },
    { label: "Total Credits",  value: data.totalPoints, icon: Trophy,      accent: "text-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <Header title="Hub Analytics" subtitle="Full live overview of community activity." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <ListBlock title="Pending Reviews" icon={Clock} empty="All clear!"
          items={data.pendingProjects.map((p: any) => ({ primary: p.title, secondary: `by ${p.author_name}`, meta: format(new Date(p.created_at), "MMM d") }))} />
        <ListBlock title="Top Members" icon={Trophy} empty="No members yet."
          items={data.top.map((m: any) => ({ primary: m.full_name || "—", secondary: "Hub member", meta: `${m.points} pts` }))} />
        <ListBlock title="Recent Signups" icon={Users} empty="No new members."
          items={data.recent.map((m: any) => ({ primary: m.full_name || "New member", secondary: m.email, meta: format(new Date(m.created_at), "MMM d") }))} />
      </div>
    </div>
  );
};

/** faculty / mentor: student & progress focus */
const FacultyOverviewPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [mc, pc, pend, top, recent] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member"),
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id, full_name, points, programme_name").order("points", { ascending: false }).limit(8),
        supabase.from("profiles").select("id, full_name, email, programme_name, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setData({ members: mc.count || 0, projects: pc.count || 0, pending: pend.count || 0, top: top.data || [], recent: recent.data || [] });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const stats: Stat[] = [
    { label: "Active Students",     value: data.members,  icon: GraduationCap, accent: "text-blue-500" },
    { label: "Project Submissions", value: data.projects, icon: Layout,        accent: "text-emerald-500" },
    { label: "Pending Review",      value: data.pending,  icon: Clock,         accent: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <Header title="Student Overview" subtitle="Monitor member progress, submissions, and leaderboard." />
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <ListBlock title="🏆 Top Performers" icon={Trophy} empty="No members yet."
          items={data.top.map((m: any) => ({ primary: m.full_name || "—", secondary: m.programme_name || "Member", meta: `${m.points} pts` }))} />
        <ListBlock title="Recent Joiners" icon={Users} empty="No recent signups."
          items={data.recent.map((m: any) => ({ primary: m.full_name || "New student", secondary: m.programme_name || m.email, meta: format(new Date(m.created_at), "MMM d") }))} />
      </div>
    </div>
  );
};

/** event_manager: events & registrations focus */
const EventManagerOverviewPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [upcoming, past, total, recentEvents] = await Promise.all([
        supabase.from("events").select("*", { count: "exact", head: true }).eq("is_upcoming", true),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("is_upcoming", false),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("events").select("id, title, date, type, spots, location, is_upcoming").order("date", { ascending: true }).limit(6),
      ]);
      setData({ upcoming: upcoming.count || 0, past: past.count || 0, total: total.count || 0, recentEvents: recentEvents.data || [] });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const stats: Stat[] = [
    { label: "Upcoming Events", value: data.upcoming, icon: Calendar, accent: "text-purple-500" },
    { label: "Past Events",     value: data.past,     icon: CheckCircle2, accent: "text-emerald-500" },
    { label: "Total Events",    value: data.total,    icon: Calendar, accent: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <Header title="Events Overview" subtitle="Track upcoming events, registrations, and capacity." />
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar size={14} className="text-muted-foreground" /> Upcoming Events</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {data.recentEvents.filter((e: any) => e.is_upcoming).length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-sm text-muted-foreground col-span-full">No upcoming events scheduled.</div>
          ) : data.recentEvents.filter((e: any) => e.is_upcoming).map((ev: any) => (
            <div key={ev.id} className="border border-white/5 rounded-xl p-4 bg-card/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{ev.title}</p>
                <p className="text-xs text-muted-foreground">{ev.location || "TBD"} · {ev.spots ? `${ev.spots} spots` : "Open"}</p>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                {ev.date ? format(new Date(ev.date), "MMM d") : "TBA"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** content_editor: content & publishing focus */
const ContentEditorOverviewPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [published, drafts, resources, broadcasts, recentPosts] = await Promise.all([
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("is_published", false),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("announcements").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("blog_posts").select("id, title, category, author_name, is_published, published_at").order("published_at", { ascending: false }).limit(6),
      ]);
      setData({ published: published.count || 0, drafts: drafts.count || 0, resources: resources.count || 0, broadcasts: broadcasts.count || 0, recentPosts: recentPosts.data || [] });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const stats: Stat[] = [
    { label: "Published Posts", value: data.published,  icon: FileText,  accent: "text-emerald-500" },
    { label: "Drafts",          value: data.drafts,     icon: Clock,     accent: "text-amber-500" },
    { label: "Resources",       value: data.resources,  icon: BookOpen,  accent: "text-blue-500" },
    { label: "Active Alerts",   value: data.broadcasts, icon: Megaphone, accent: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <Header title="Content Overview" subtitle="Track published posts, drafts, resources, and broadcasts." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText size={14} className="text-muted-foreground" /> Recent Blog Posts</h3>
        <div className="space-y-2">
          {data.recentPosts.map((p: any) => (
            <div key={p.id} className="border border-white/5 rounded-xl p-4 bg-card/50 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · by {p.author_name || "Unknown"}</p>
              </div>
              <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-lg ${p.is_published ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                {p.is_published ? "Live" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/** moderator: moderation queue focus */
const ModeratorOverviewPanel = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pending, approved, rejected, changes, recentPending] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "rejected"),
        supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "changes_requested"),
        supabase.from("projects").select("id, title, author_name, stack, created_at").eq("status", "pending").order("created_at", { ascending: true }).limit(8),
      ]);
      setData({ pending: pending.count || 0, approved: approved.count || 0, rejected: rejected.count || 0, changes: changes.count || 0, recentPending: recentPending.data || [] });
      setLoading(false);
    })();
  }, []);

  if (loading || !data) return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;

  const stats: Stat[] = [
    { label: "Pending",           value: data.pending,   icon: AlertCircle, accent: "text-amber-500" },
    { label: "Approved",          value: data.approved,  icon: CheckCircle2,accent: "text-emerald-500" },
    { label: "Rejected",          value: data.rejected,  icon: Clock,       accent: "text-red-500" },
    { label: "Changes Requested", value: data.changes,   icon: BookMarked,  accent: "text-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <Header title="Moderation Queue" subtitle="Track and review pending project submissions." />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <AlertCircle size={14} className="text-amber-500" />
          Awaiting Review ({data.pending} projects)
        </h3>
        {data.recentPending.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-sm text-muted-foreground">🎉 All caught up! No pending submissions.</div>
        ) : (
          <div className="space-y-2">
            {data.recentPending.map((p: any) => (
              <div key={p.id} className="border border-amber-500/10 rounded-xl p-4 bg-amber-500/5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground">by {p.author_name} · {(p.stack || []).slice(0, 3).join(", ")}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-500">{format(new Date(p.created_at), "MMM d")}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────── Header shared sub-component ───────────
const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h2 className="text-xl font-bold flex items-center gap-2">
      <BarChart3 size={20} className="text-primary" /> {title}
    </h2>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

// ─────────── Main export — picks the right panel by role ───────────
const AnalyticsPanel = ({ role }: { role?: string }) => {
  switch (role) {
    case "superadmin":
    case "admin":
      return <AdminOverviewPanel />;
    case "faculty":
      return <FacultyOverviewPanel />;
    case "event_manager":
      return <EventManagerOverviewPanel />;
    case "content_editor":
      return <ContentEditorOverviewPanel />;
    case "moderator":
      return <ModeratorOverviewPanel />;
    default:
      return <AdminOverviewPanel />;
  }
};

export default AnalyticsPanel;
