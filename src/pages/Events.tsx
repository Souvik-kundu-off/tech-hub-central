import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: string;
  spots: number;
  mode: string;
  is_upcoming: boolean;
}

const filters = ["All", "Hackathon", "Workshop", "Competition", "Gaming"];

const Events = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [filter, setFilter] = useState("All");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", tab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_upcoming", tab === "upcoming")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const filtered = events.filter((e) => filter === "All" || e.type === filter);

  return (
    <PageLayout>
      <section className="section-padding border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Events</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Learn, compete, grow.</h1>
          <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
            From hackathons to workshops — we host events that sharpen your skills and expand your network.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border border-border rounded-lg p-1 w-fit">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-sm rounded-md capitalize transition-colors ${
                  tab === t ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filter === f
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No events found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-6 bg-card hover:border-foreground/20 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{event.type}</span>
                    <span className="text-[11px] text-muted-foreground">•</span>
                    <span className="text-[11px] text-muted-foreground">{event.mode}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.spots} spots</span>
                  </div>
                  {event.is_upcoming && (
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
                      Register Now
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Events;
