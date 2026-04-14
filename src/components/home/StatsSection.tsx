import { Code, Trophy, Calendar, Users, GitBranch, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "200+", label: "Active Members" },
  { icon: Calendar, value: "50+", label: "Events Hosted" },
  { icon: Code, value: "100+", label: "Projects Built" },
  { icon: Trophy, value: "25+", label: "Hackathon Wins" },
  { icon: GitBranch, value: "500+", label: "GitHub Contributions" },
  { icon: Star, value: "15+", label: "Industry Partners" },
];

const StatsSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-8 md:p-12 glow-border">
          <div className="text-center mb-10">
            <p className="text-primary text-sm font-mono mb-2">// our impact</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Numbers That <span className="gradient-text">Speak</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-display font-black text-2xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
