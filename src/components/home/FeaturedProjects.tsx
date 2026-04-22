import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ensureUrl } from "@/lib/utils-url";

const FeaturedProjects = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["featured_projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Showcase</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Projects</h2>
          </div>
          <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground text-sm py-10 text-center">No projects found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="group border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors bg-card flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{p.category || "Project"}</span>
                </div>
                <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags?.map((t: string, j: number) => (
                    <span key={j} className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Club Member</span>
                  <div className="flex gap-2">
                    {p.github_url && <a href={ensureUrl(p.github_url)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-3.5 h-3.5" /></a>}
                    {p.live_url && <a href={ensureUrl(p.live_url)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
