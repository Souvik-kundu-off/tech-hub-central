import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const allEvents = [
  { title: "HackFusion 2026", date: "May 15–16, 2026", location: "Main Auditorium", type: "Hackathon", spots: 120, mode: "Offline", upcoming: true, desc: "48-hour hackathon with prizes worth ₹50,000. Build solutions for real-world problems." },
  { title: "AI/ML Workshop Series", date: "Apr 28, 2026", location: "CS Lab 301", type: "Workshop", spots: 60, mode: "Offline", upcoming: true, desc: "Hands-on workshop covering neural networks, NLP, and computer vision basics." },
  { title: "Code Wars — CP Contest", date: "May 3, 2026", location: "Online", type: "Competition", spots: 200, mode: "Online", upcoming: true, desc: "Competitive programming contest with problems from Div 2 to Div 1 level." },
  { title: "Web Dev Bootcamp", date: "May 20, 2026", location: "Seminar Hall B", type: "Workshop", spots: 80, mode: "Offline", upcoming: true, desc: "Full-stack web development from scratch — React, Node, databases." },
  { title: "Gaming Night", date: "Jun 1, 2026", location: "Student Center", type: "Gaming", spots: 50, mode: "Offline", upcoming: true, desc: "Valorant and CS2 tournament with snacks and prizes." },
  { title: "HackFusion 2025", date: "May 10, 2025", location: "Main Auditorium", type: "Hackathon", spots: 100, mode: "Offline", upcoming: false, desc: "Our flagship hackathon's previous edition." },
  { title: "Python for Beginners", date: "Mar 15, 2025", location: "Online", type: "Workshop", spots: 150, mode: "Online", upcoming: false, desc: "Introductory Python workshop for absolute beginners." },
  { title: "Design Thinking Workshop", date: "Feb 20, 2025", location: "CS Lab 201", type: "Workshop", spots: 40, mode: "Offline", upcoming: false, desc: "Learn the design thinking process and build user-centered solutions." },
];

const filters = ["All", "Hackathon", "Workshop", "Competition", "Gaming"];

const Events = () => {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [filter, setFilter] = useState("All");

  const filtered = allEvents
    .filter((e) => (tab === "upcoming" ? e.upcoming : !e.upcoming))
    .filter((e) => filter === "All" || e.type === filter);

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
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No events found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((event, i) => (
                <div key={i} className="border border-border rounded-lg p-6 bg-card hover:border-foreground/20 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{event.type}</span>
                    <span className="text-[11px] text-muted-foreground">•</span>
                    <span className="text-[11px] text-muted-foreground">{event.mode}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{event.desc}</p>
                  <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {event.spots} spots</span>
                  </div>
                  {event.upcoming && (
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
