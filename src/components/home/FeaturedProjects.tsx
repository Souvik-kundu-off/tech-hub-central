import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "PrepVerse",
    description: "AI-powered interview preparation platform with mock interviews and resume analysis.",
    techStack: ["React", "Node.js", "OpenAI", "MongoDB"],
    author: "Rahul Sharma",
    stars: 42,
    category: "AI",
  },
  {
    title: "CampusConnect",
    description: "Social platform for college students to share notes, find study groups, and collaborate.",
    techStack: ["Next.js", "Supabase", "Tailwind"],
    author: "Priya Patel",
    stars: 38,
    category: "Web",
  },
  {
    title: "SmartAttend",
    description: "Face-recognition based attendance system for classrooms using computer vision.",
    techStack: ["Python", "OpenCV", "Flask", "TensorFlow"],
    author: "Arjun Mehta",
    stars: 55,
    category: "AI",
  },
  {
    title: "EcoTrack",
    description: "Mobile app to track and reduce personal carbon footprint with gamification.",
    techStack: ["React Native", "Firebase", "Charts"],
    author: "Sneha Gupta",
    stars: 29,
    category: "App",
  },
  {
    title: "CodeBattle Arena",
    description: "Real-time competitive coding platform with live leaderboards and multiplayer rooms.",
    techStack: ["TypeScript", "Socket.io", "Redis", "PostgreSQL"],
    author: "Vikram Singh",
    stars: 67,
    category: "Web",
  },
  {
    title: "DroneNav",
    description: "Autonomous drone navigation system using GPS waypoints and obstacle avoidance.",
    techStack: ["Python", "ROS", "Arduino", "C++"],
    author: "Ananya Reddy",
    stars: 34,
    category: "Hardware",
  },
];

const FeaturedProjects = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-mono mb-2">// showcase</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Featured <span className="gradient-text">Projects</span>
            </h2>
          </div>
          <Link to="/projects">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="w-3 h-3 fill-primary text-primary" /> {project.stars}
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.techStack.map((tech, j) => (
                  <span key={j} className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <span className="text-xs text-muted-foreground">by {project.author}</span>
                <div className="flex gap-2">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
