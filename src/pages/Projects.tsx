import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Search, Github, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";

const allProjects = [
  { title: "PrepVerse", desc: "AI-powered interview prep platform with mock interviews and resume analysis.", stack: ["React", "Node.js", "OpenAI", "MongoDB"], author: "Rahul Sharma", category: "AI", github: "#", live: "#" },
  { title: "CampusConnect", desc: "Social platform for students to share notes, form study groups, and collaborate on assignments.", stack: ["Next.js", "Supabase", "Tailwind CSS"], author: "Priya Patel", category: "Web", github: "#", live: "#" },
  { title: "SmartAttend", desc: "Face-recognition attendance system for classrooms using computer vision and deep learning.", stack: ["Python", "OpenCV", "Flask", "TensorFlow"], author: "Arjun Mehta", category: "AI", github: "#", live: "#" },
  { title: "EcoTrack", desc: "Mobile app to track and reduce personal carbon footprint with gamification and social challenges.", stack: ["React Native", "Firebase", "Charts.js"], author: "Sneha Gupta", category: "App", github: "#", live: "#" },
  { title: "CodeBattle Arena", desc: "Real-time competitive coding platform with live leaderboards and multiplayer coding rooms.", stack: ["TypeScript", "Socket.io", "Redis", "PostgreSQL"], author: "Vikram Singh", category: "Web", github: "#", live: "#" },
  { title: "DroneNav", desc: "Autonomous drone navigation system using GPS waypoints and obstacle avoidance sensors.", stack: ["Python", "ROS", "Arduino", "C++"], author: "Ananya Reddy", category: "Hardware", github: "#", live: "#" },
  { title: "MedBot", desc: "AI chatbot for preliminary medical symptom analysis and doctor appointment scheduling.", stack: ["Python", "LangChain", "React", "FastAPI"], author: "Karan Joshi", category: "AI", github: "#", live: "#" },
  { title: "BudgetBuddy", desc: "Personal finance tracker with expense categorization, budget goals, and visual reports.", stack: ["Flutter", "Firebase", "Dart"], author: "Meera Shah", category: "App", github: "#", live: "#" },
  { title: "GitViz", desc: "Visualize your GitHub contribution graph in 3D with interactive exploration.", stack: ["Three.js", "React", "GitHub API"], author: "Rohan Verma", category: "Web", github: "#", live: "#" },
];

const categories = ["All", "AI", "Web", "App", "Hardware"];

const Projects = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = allProjects
    .filter((p) => filter === "All" || p.category === filter)
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));

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

          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No projects found.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <div key={i} className="border border-border rounded-lg p-5 bg-card hover:border-foreground/20 transition-colors flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{p.category}</span>
                    <div className="flex gap-2">
                      <a href={p.github} className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-3.5 h-3.5" /></a>
                      <a href={p.live} className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[15px] mb-1.5">{p.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.stack.map((t, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">by {p.author}</span>
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
