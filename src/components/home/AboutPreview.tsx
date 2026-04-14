import { Link } from "react-router-dom";
import { ArrowRight, Target, Lightbulb, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const pillars = [
  { icon: Lightbulb, title: "Learn", desc: "Workshops, bootcamps & mentorship" },
  { icon: Rocket, title: "Build", desc: "Real-world projects & hackathons" },
  { icon: Users, title: "Connect", desc: "Network with peers & industry" },
  { icon: Target, title: "Compete", desc: "Code wars & tech challenges" },
];

const AboutPreview = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary text-sm font-mono mb-2">// about us</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">
              More Than Just a <span className="gradient-text">Club</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We're a student-run tech community dedicated to bridging the gap between
              classroom learning and industry-ready skills. From beginner-friendly workshops
              to advanced hackathons, there's something for everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Founded in 2020, we've grown from 15 members to 200+ passionate technologists
              who've built incredible projects, won national competitions, and landed
              dream internships.
            </p>
            <Link to="/about">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                Learn more about us <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="glass rounded-xl p-6 hover:glow-border transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center mb-3">
                  <pillar.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-bold text-foreground mb-1">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
