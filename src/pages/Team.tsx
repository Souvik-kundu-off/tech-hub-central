import PageLayout from "@/components/PageLayout";
import { Github, Linkedin, Twitter, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  department: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  is_faculty: boolean;
}

const Team = () => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("role", "is", null)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as TeamMember[];
    },
  });

  const coreTeam = members.filter(m => !m.is_faculty);
  const faculty = members.filter(m => m.is_faculty);

  return (
    <PageLayout>
      <section className="section-padding border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Team</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The people behind it all.</h1>
          <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
            Meet the students and mentors who make TechClub possible.
          </p>
        </div>
      </section>

      {/* Core Team */}
      <section className="section-padding border-b border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-8">Core Team</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : coreTeam.length === 0 ? (
            <p className="text-muted-foreground text-sm py-10">No core team members found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coreTeam.map((m) => (
                <div key={m.id} className="border border-border rounded-lg p-5 bg-card hover:border-foreground/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground mb-4">
                    {m.full_name?.split(" ").map(w => w[0]).join("")}
                  </div>
                  <h3 className="font-semibold text-sm">{m.full_name}</h3>
                  <p className="text-xs text-primary mt-0.5">{m.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.department}</p>
                  <div className="flex gap-2 mt-3">
                    {m.github_url && <a href={m.github_url} className="text-muted-foreground hover:text-foreground"><Github className="w-3.5 h-3.5" /></a>}
                    {m.linkedin_url && <a href={m.linkedin_url} className="text-muted-foreground hover:text-foreground"><Linkedin className="w-3.5 h-3.5" /></a>}
                    {m.twitter_url && <a href={m.twitter_url} className="text-muted-foreground hover:text-foreground"><Twitter className="w-3.5 h-3.5" /></a>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Faculty */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-8">Faculty Coordinators</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : faculty.length === 0 ? (
            <p className="text-muted-foreground text-sm py-10">No faculty coordinators found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {faculty.map((f) => (
                <div key={f.id} className="border border-border rounded-lg p-5 bg-card">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground mb-4">
                    {f.full_name?.split(" ").filter(w => w[0] === w[0].toUpperCase()).map(w => w[0]).join("")}
                  </div>
                  <h3 className="font-semibold text-sm">{f.full_name}</h3>
                  <p className="text-xs text-primary mt-0.5">{f.role}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.department}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Team;
