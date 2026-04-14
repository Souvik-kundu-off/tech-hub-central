import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-glow-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <div className="container mx-auto px-4 relative z-10 text-center pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/20 text-sm text-primary mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4" />
          <span>🚀 Open for new members — Spring 2026</span>
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 animate-slide-up animate-slide-up-delay-1">
          Build. Learn.
          <br />
          <span className="gradient-text">Innovate.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animate-slide-up-delay-2">
          We're a community of student developers, designers, and tech enthusiasts
          pushing boundaries through hackathons, workshops, and open-source projects.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-slide-up-delay-3">
          <Link to="/signup">
            <Button size="lg" className="gradient-primary text-primary-foreground text-base px-8 hover:opacity-90 glow-border">
              Join the Club <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/projects">
            <Button size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary text-base px-8">
              Explore Projects
            </Button>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 animate-slide-up animate-slide-up-delay-4">
          {[
            { icon: Users, value: "200+", label: "Members" },
            { icon: Zap, value: "50+", label: "Events" },
            { icon: Sparkles, value: "100+", label: "Projects" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
