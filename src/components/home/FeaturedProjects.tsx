import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

const projects = [
  { title: "PrepVerse", desc: "AI-powered interview prep platform with mock interviews and resume analysis.", stack: ["React", "Node.js", "OpenAI"], author: "Rahul S.", category: "AI" },
  { title: "CampusConnect", desc: "Social platform for students to share notes, form study groups, and collaborate.", stack: ["Next.js", "Supabase", "Tailwind"], author: "Priya P.", category: "Web" },
  { title: "SmartAttend", desc: "Face-recognition attendance system for classrooms using computer vision.", stack: ["Python", "OpenCV", "Flask"], author: "Arjun M.", category: "AI" },
  { title: "EcoTrack", desc: "Track and reduce your carbon footprint with gamification and challenges.", stack: ["React Native", "Firebase"], author: "Sneha G.", category: "App" },
  { title: "CodeBattle Arena", desc: "Real-time competitive coding platform with live leaderboards.", stack: ["TypeScript", "Socket.io", "Redis"], author: "Vikram S.", category: "Web" },
  { title: "DroneNav", desc: "Autonomous drone navigation with GPS waypoints and obstacle avoidance.", stack: ["Python", "ROS", "Arduino"], author: "Ananya R.", category: "Hardware" },
];

const FeaturedProjects = () => (
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <div key={i} className="group border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors bg-card flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{p.category}</span>
            </div>
            <h3 className="font-semibold text-[15px] mb-1.5 group-hover:text-primary transition-colors">{p.title}</h3>
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 flex-1">{p.desc}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.stack.map((t, j) => (
                <span key={j} className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground">{p.author}</span>
              <div className="flex gap-2">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="w-3.5 h-3.5" /></a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProjects;
