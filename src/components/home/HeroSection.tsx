import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-14">
    {/* Subtle grid background */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
    {/* Radial fade */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-8 animate-fade-up">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Open for new members — Spring 2026
      </div>

      <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 animate-fade-up animate-fade-up-delay-1">
        Where students build
        <br />
        <span className="text-primary">real things.</span>
      </h1>

      <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-2">
        A community of developers, designers, and tech enthusiasts pushing boundaries through hackathons, workshops, and open-source.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-fade-up-delay-3">
        <Link to="/signup">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm">
            Join the Club <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
        <Link to="/projects">
          <Button variant="outline" className="h-10 px-6 text-sm border-border text-foreground hover:bg-accent">
            Explore Projects
          </Button>
        </Link>
      </div>

      {/* Minimal stats strip */}
      <div className="flex justify-center gap-12 mt-20 animate-fade-up animate-fade-up-delay-3">
        {[
          { value: "200+", label: "Members" },
          { value: "50+", label: "Events" },
          { value: "100+", label: "Projects" },
          { value: "25+", label: "Wins" },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
