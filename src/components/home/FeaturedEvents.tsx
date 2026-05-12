import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const FeaturedEvents = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["featured_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Floating GSA logos */}
      <img src="/All logo GSA/Gemini Sparkle.png" alt="" aria-hidden="true"
        className="absolute top-8 right-[5%] w-20 md:w-28 opacity-30 pointer-events-none select-none"
        style={{ animation: "sectionFloat 7s ease-in-out infinite" }} />
      <img src="/All logo GSA/07 (1).png" alt="" aria-hidden="true"
        className="absolute bottom-10 left-[4%] w-16 md:w-24 opacity-30 pointer-events-none select-none"
        style={{ animation: "sectionFloat 9s ease-in-out 1.5s infinite" }} />
      <style>{`@keyframes sectionFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }`}</style>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Upcoming</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Featured Events</h2>
          </div>
          <Link to="/events" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-muted-foreground text-sm py-10 text-center">No upcoming events found.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="group border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors bg-card">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{event.type}</span>
                  <span className="text-[11px] text-muted-foreground">{event.spots} spots</span>
                </div>
                <h3 className="font-semibold text-[15px] mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="flex flex-col gap-1.5 text-[13px] text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {format(new Date(event.date), "MMM dd, yyyy")}
                  </span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs h-8 border-border hover:bg-accent">
                  Register
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
