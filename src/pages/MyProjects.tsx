import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Plus, Edit3, Trash2, Loader2, ExternalLink, Github, Eye, Heart,
  AlertCircle, CheckCircle2, Clock, FileEdit,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  category: string;
  status: string;
  review_note: string | null;
  github_url: string | null;
  live_url: string | null;
  views_count: number | null;
  likes_count: number | null;
  created_at: string;
}

const statusMeta: Record<string, { label: string; cls: string; icon: any }> = {
  draft:               { label: "Draft",            cls: "bg-muted text-muted-foreground",          icon: FileEdit },
  pending:             { label: "Pending Review",   cls: "bg-blue-500/10 text-blue-500",            icon: Clock },
  approved:            { label: "Approved",         cls: "bg-emerald-500/10 text-emerald-500",      icon: CheckCircle2 },
  rejected:            { label: "Rejected",         cls: "bg-destructive/10 text-destructive",      icon: AlertCircle },
  changes_requested:   { label: "Changes Requested",cls: "bg-amber-500/10 text-amber-500",          icon: AlertCircle },
  paused:              { label: "Paused",           cls: "bg-amber-500/10 text-amber-500",          icon: Clock },
};

const MyProjects = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    fetchProjects();
  }, [user, authLoading]);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("author_id", user!.id)
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load projects");
    else setProjects(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted");
      setProjects((p) => p.filter((x) => x.id !== id));
    }
  };

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "draft", label: "Drafts" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Live" },
    { key: "changes_requested", label: "Action Needed" },
  ];

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);
  const counts = {
    total: projects.length,
    approved: projects.filter((p) => p.status === "approved").length,
    pending: projects.filter((p) => p.status === "pending").length,
    views: projects.reduce((s, p) => s + (p.views_count || 0), 0),
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Member Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your submissions, drafts, and analytics.</p>
          </div>
          <Link to="/submit-project">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={16} /> New Project
            </Button>
          </Link>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" value={counts.total} />
          <StatCard label="Approved" value={counts.approved} accent="text-emerald-500" />
          <StatCard label="Pending" value={counts.pending} accent="text-blue-500" />
          <StatCard label="Total Views" value={counts.views} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {filterTabs.map((t) => {
            const c = t.key === "all" ? projects.length : projects.filter((p) => p.status === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors whitespace-nowrap ${
                  filter === t.key
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label} <span className="opacity-60 ml-1">{c}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl py-20 text-center">
            <p className="text-sm text-muted-foreground mb-4">No projects in this view yet.</p>
            <Link to="/submit-project">
              <Button variant="outline" size="sm" className="gap-2"><Plus size={14} /> Submit your first project</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => {
              const meta = statusMeta[p.status] || statusMeta.draft;
              const Icon = meta.icon;
              return (
                <div key={p.id} className="border border-border rounded-xl p-5 bg-card hover:border-foreground/20 transition-colors">
                  <div className="flex flex-col md:flex-row gap-4 md:items-start md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${meta.cls}`}>
                          <Icon size={11} /> {meta.label}
                        </span>
                        {p.category && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{p.category}</span>
                        )}
                        <span className="text-[11px] text-muted-foreground">· {format(new Date(p.created_at), "MMM d, yyyy")}</span>
                      </div>
                      <h3 className="font-semibold text-base mb-1">{p.title || "Untitled draft"}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description || "No description yet."}</p>

                      {p.review_note && (p.status === "rejected" || p.status === "changes_requested") && (
                        <div className="mb-3 p-3 rounded-md bg-amber-500/5 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                          <span className="font-semibold">Admin note:</span> {p.review_note}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5">
                        {p.stack?.slice(0, 5).map((s, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{s}</span>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye size={12} /> {p.views_count || 0} views</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {p.likes_count || 0} likes</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 md:w-40">
                      <Link to={`/submit-project/${p.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1.5 h-8">
                          <Edit3 size={13} /> Edit
                        </Button>
                      </Link>
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noreferrer" className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full gap-1.5 h-8">
                            <ExternalLink size={13} /> Live
                          </Button>
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noreferrer" className="flex-1">
                          <Button variant="ghost" size="sm" className="w-full gap-1.5 h-8">
                            <Github size={13} /> Repo
                          </Button>
                        </a>
                      )}
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8"
                      >
                        <Trash2 size={13} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

const StatCard = ({ label, value, accent = "text-foreground" }: { label: string; value: number; accent?: string }) => (
  <div className="border border-border rounded-lg p-4 bg-card">
    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
    <p className={`text-2xl font-bold tabular-nums ${accent}`}>{value}</p>
  </div>
);

export default MyProjects;
