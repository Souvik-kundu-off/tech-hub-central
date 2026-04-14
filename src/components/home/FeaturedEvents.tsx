import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const events = [
  {
    title: "HackFusion 2026",
    date: "May 15–16, 2026",
    location: "Main Auditorium",
    type: "Hackathon",
    attendees: 120,
    color: "from-primary to-glow-purple",
  },
  {
    title: "AI/ML Workshop Series",
    date: "Apr 28, 2026",
    location: "CS Lab 301",
    type: "Workshop",
    attendees: 60,
    color: "from-glow-purple to-pink-500",
  },
  {
    title: "Code Wars — Competitive Programming",
    date: "May 3, 2026",
    location: "Online",
    type: "Competition",
    attendees: 200,
    color: "from-emerald-500 to-primary",
  },
];

const FeaturedEvents = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-mono mb-2">// upcoming</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl">
              Featured <span className="gradient-text">Events</span>
            </h2>
          </div>
          <Link to="/events">
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <div
              key={i}
              className="group glass rounded-xl overflow-hidden hover:glow-border transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${event.color}`} />
              <div className="p-6">
                <span className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {event.type}
                </span>
                <h3 className="font-display font-bold text-lg mt-3 mb-3 text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {event.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {event.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {event.attendees} attending
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-5 border-primary/30 text-primary hover:bg-primary/10"
                >
                  Register Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
