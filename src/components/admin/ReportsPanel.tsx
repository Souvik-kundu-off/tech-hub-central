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
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Download, Loader2, Users, Layout, Calendar, Trophy, FileText, FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { logAdminAction } from "./AuditLog";

interface ExportConfig {
  label: string;
  description: string;
  icon: any;
  table: string;
  columns: string[];
  headers: string[];
  accent: string;
  filenamePrefix: string;
}

const EXPORTS: ExportConfig[] = [
  {
    label: "Member Directory",
    description: "Full list of all registered members with email, programme, role, and points.",
    icon: Users,
    table: "profiles",
    columns: ["full_name", "email", "role", "programme_name", "points", "created_at"],
    headers: ["Name", "Email", "Role", "Programme", "Points", "Joined"],
    accent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    filenamePrefix: "members",
  },
  {
    label: "Project Submissions",
    description: "All submitted projects with status, author, tech stack, and review notes.",
    icon: Layout,
    table: "projects",
    columns: ["title", "author_name", "status", "stack", "github_url", "live_url", "review_note", "created_at"],
    headers: ["Title", "Author", "Status", "Stack", "GitHub", "Live URL", "Review Note", "Submitted"],
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    filenamePrefix: "projects",
  },
  {
    label: "Events List",
    description: "Complete list of all events with date, location, type, and capacity.",
    icon: Calendar,
    table: "events",
    columns: ["title", "type", "date", "location", "mode", "spots", "is_upcoming", "created_at"],
    headers: ["Title", "Type", "Date", "Location", "Mode", "Spots", "Upcoming", "Created"],
    accent: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    filenamePrefix: "events",
  },
  {
    label: "Leaderboard",
    description: "Ranked list of members by hub credits (points) — top performers highlighted.",
    icon: Trophy,
    table: "profiles",
    columns: ["full_name", "email", "points", "programme_name"],
    headers: ["Name", "Email", "Points", "Programme"],
    accent: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    filenamePrefix: "leaderboard",
  },
];

const ReportsPanel = () => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (config: ExportConfig) => {
    setExporting(config.table + config.filenamePrefix);
    try {
      let query = supabase.from(config.table).select(config.columns.join(","));

      // For leaderboard, sort by points descending
      if (config.filenamePrefix === "leaderboard") {
        query = query.order("points", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        toast.error(`Export failed: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Convert to CSV
      const csvRows = [config.headers.join(",")];
      for (const row of data) {
        const values = config.columns.map(col => {
          const val = (row as any)[col];
          if (val === null || val === undefined) return "";
          if (Array.isArray(val)) return `"${val.join("; ")}"`;
          const str = String(val);
          // Escape CSV special characters
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        });
        csvRows.push(values.join(","));
      }

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().split("T")[0];
      link.href = url;
      link.setAttribute("download", `${config.filenamePrefix}_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${config.label} exported! (${data.length} rows)`);

      await logAdminAction({
        actionType: "EXPORT",
        targetType: "REPORTS",
        targetId: config.filenamePrefix,
        targetLabel: config.label,
        details: `Exported ${data.length} rows as CSV`,
      });
    } catch (e: any) {
      toast.error("Export failed");
      console.error(e);
    }
    setExporting(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileSpreadsheet size={20} className="text-primary" /> Reports & Exports
        </h2>
        <p className="text-sm text-muted-foreground">
          Download hub data as CSV files for analysis, record-keeping, or presentations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {EXPORTS.map((config, index) => {
          const Icon = config.icon;
          const isExporting = exporting === config.table + config.filenamePrefix;

          return (
            <motion.div
              key={config.filenamePrefix}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="border border-white/5 rounded-[24px] p-6 bg-card/50 hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${config.accent}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-1">{config.label}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    {config.description}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    {config.headers.slice(0, 4).map(h => (
                      <span key={h} className="px-1.5 py-0.5 bg-white/5 rounded">{h}</span>
                    ))}
                    {config.headers.length > 4 && (
                      <span className="px-1.5 py-0.5 bg-white/5 rounded">+{config.headers.length - 4}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => handleExport(config)}
                    disabled={isExporting}
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-9 gap-2 font-bold"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download size={14} />
                    )}
                    {isExporting ? "Exporting..." : "Download CSV"}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsPanel;
