import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULTS: Record<string, string> = {
  hero_badge: "Open for new members — Spring 2026",
  hero_headline_1: "Where students build",
  hero_headline_2: "real things.",
  hero_subtext: "A community of developers, designers, and tech enthusiasts pushing boundaries through hackathons, workshops, and open-source.",
  hero_cta_primary: "Join the Club",
  hero_cta_secondary: "Explore Projects",
  stat_members: "200+",
  stat_events: "50+",
  stat_projects: "100+",
  stat_wins: "25+",
};

const HeroSection = () => {
  const [content, setContent] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("*");
      if (data && data.length > 0) {
        const map: Record<string, string> = { ...DEFAULTS };
        data.forEach((item: { key: string; value: string }) => {
          if (item.value) map[item.key] = item.value;
        });
        setContent(map);
      }
    };
    fetchContent();
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-14">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)]" />

      {/* Floating GSA logos */}
      <img
        src="/All logo GSA/element.webp"
        alt=""
        aria-hidden="true"
        className="absolute top-24 left-[8%] w-16 md:w-24 opacity-100 pointer-events-none select-none"
        style={{ animation: "heroFloat 6s ease-in-out infinite" }}
      />
      <img
        src="/All logo GSA/05 (9).png"
        alt=""
        aria-hidden="true"
        className="absolute top-32 right-[12%] w-15 md:w-28 opacity-100 pointer-events-none select-none"
        style={{ animation: "heroFloat 8s ease-in-out 1s infinite" }}
      />
      <img
        src="/All logo GSA/04 (8).png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-28 left-[12%] w-15 md:w-28 opacity-100 pointer-events-none select-none rotate-45"
        style={{ animation: "heroFloat 7s ease-in-out 2s infinite" }}
      />
      <img
        src="/All logo GSA/01 (5).png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-36 right-[10%] w-12 md:w-16 opacity-100 pointer-events-none select-none"
        style={{ animation: "heroFloat 9s ease-in-out 0.5s infinite" }}
      />

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-muted-foreground mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {content.hero_badge}
        </div>

        <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1] mb-6 animate-fade-up animate-fade-up-delay-1">
          {content.hero_headline_1}
          <br />
          <span className="text-primary">{content.hero_headline_2}</span>
        </h1>

        <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-2">
          {content.hero_subtext}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-fade-up-delay-3">
          <Link to="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm">
              {content.hero_cta_primary} <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" className="h-10 px-6 text-sm border-border text-foreground hover:bg-accent">
              {content.hero_cta_secondary}
            </Button>
          </Link>
        </div>

        {/* Minimal stats strip */}
        <div className="flex justify-center gap-12 mt-20 animate-fade-up animate-fade-up-delay-3">
          {[
            { value: content.stat_members, label: "Members" },
            { value: content.stat_events, label: "Events" },
            { value: content.stat_projects, label: "Projects" },
            { value: content.stat_wins, label: "Wins" },
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
};

export default HeroSection;
