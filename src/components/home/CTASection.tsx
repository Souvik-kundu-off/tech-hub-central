import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULTS: Record<string, string> = {
  cta_headline: "Ready to build something great?",
  cta_subtext: "Join 200+ students shipping real projects. No experience required — just curiosity.",
};

const CTASection = () => {
  const [content, setContent] = useState<Record<string, string>>(DEFAULTS);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("*")
        .in("key", ["cta_headline", "cta_subtext"]);
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
    <section className="section-padding relative overflow-hidden">
      {/* Floating GSA logos */}
      <img src="/All logo GSA/element.webp" alt="" aria-hidden="true"
        className="absolute top-6 left-[6%] w-16 md:w-24 opacity-35 pointer-events-none select-none"
        style={{ animation: "ctaFloat 8s ease-in-out 0.5s infinite" }} />
      <img src="/All logo GSA/Gemini Sparkle.png" alt="" aria-hidden="true"
        className="absolute bottom-6 right-[5%] w-20 md:w-28 opacity-30 pointer-events-none select-none"
        style={{ animation: "ctaFloat 10s ease-in-out 2s infinite" }} />
      <style>{`@keyframes ctaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>

      <div className="container mx-auto px-4 relative z-10">
        <div className="border border-border rounded-xl p-10 md:p-16 text-center bg-card">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{content.cta_headline}</h2>
          <p className="text-muted-foreground text-[15px] max-w-md mx-auto mb-8">
            {content.cta_subtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm">
                Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="h-10 px-6 text-sm border-border hover:bg-accent">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
