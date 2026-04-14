import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Search, Github, ExternalLink, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  author_name: string;
  category: string;
  github_url: string;
  live_url: string;
}

const categories = ["All", "AI", "Web", "App", "Hardware"];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const filtered = projects
    .filter((p) => filter === "All" || p.category === filter)
    .filter((p) => 
      p.title.toLowerCase().includes(search.toLowerCase()) || 
      p.description.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <PageLayout>
      <section className="section-padding border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Projects</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built by members.</h1>
          <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
            Real projects, real impact. Explore what our community has built.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm bg-card border-border"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filter === c
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No projects found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="border border-border rounded-lg p-5 bg-card hover:border-foreground/20 transition-colors flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{p.category}</span>
                    <div className="flex gap-2">
                      <a href={p.github_url} className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-3.5 h-3.5" /></a>
                      <a href={p.live_url} className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[15px] mb-1.5">{p.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.stack?.map((t, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">by {p.author_name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Projects;
