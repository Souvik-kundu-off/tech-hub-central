import PageLayout from "@/components/PageLayout";
import { Target, Eye, Clock, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const timeline = [
  { year: "Phase 1", title: "Department Hub Launch", desc: "Official launch of the CSE-AI Student Hub platform for project submissions and event updates." },
  { year: "Phase 2", title: "Project Showcase & Review", desc: "Enabling student project submissions, peer feedback, and admin moderation workflows." },
  { year: "Phase 3", title: "Google Student Community Jams", desc: "Hosting Google Ambassador workshops, hands-on tech sessions, and AI study jams." },
  { year: "Phase 4", title: "Credit System & Recognition", desc: "Rewarding active student contributors with department participation points and leaderboard rankings." },
];

const achievements = [
  "🚀 Official project showcase platform for CSE-AI students",
  "💡 Google Student Community workshops & AI study jams",
  "💻 Peer code reviews and student project moderation",
  "📊 Transparent credit economy for student contributions",
  "🏆 Department hackathons and technical competitions in planning",
  "📂 Centralized resource hub for CSE-AI course materials",
];

const About = () => (
  <PageLayout>
    {/* Hero */}
    <section className="py-8 sm:py-10 border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">About Us</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">Empowering CSE-AI Students</h1>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-lg mx-auto">
          Fostering project showcase, peer collaboration, and technical growth for Computer Science & Engineering (AI) students.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="py-6 sm:py-8 border-b border-border">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="border border-border rounded-xl p-6 bg-card">
          <Target className="w-5 h-5 text-primary mb-3" />
          <h3 className="font-semibold text-base mb-1.5">Our Mission</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            To provide CSE-AI students with a central platform to publish projects, discover technical resources, track department events, and gain recognition for active technical contributions.
          </p>
        </div>
        <div className="border border-border rounded-xl p-6 bg-card">
          <Eye className="w-5 h-5 text-primary mb-3" />
          <h3 className="font-semibold text-base mb-1.5">Our Vision</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            To establish a transparent, student-driven hub that showcases technical excellence, encourages peer mentorship, and prepares CSE-AI students for software engineering careers.
          </p>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="py-6 sm:py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Pilot Roadmap</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Departmental Roadmap</h2>
        </div>
        <div className="max-w-xl mx-auto">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-4 mb-4 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-xs font-mono font-bold text-primary shrink-0">
                  {i + 1}
                </div>
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="pb-4">
                <p className="text-[11px] text-muted-foreground font-mono mb-0.5">{item.year}</p>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Highlights */}
    <section className="py-6 sm:py-8 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Focus Areas</p>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Key Initiatives</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {achievements.map((a, i) => (
            <div key={i} className="border border-border rounded-lg p-3.5 bg-card text-xs sm:text-sm leading-relaxed">{a}</div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Join */}
    <section className="py-8 sm:py-10">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">Get Started with CSE-AI Student Hub</h2>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-6">
          Share your projects, access study resources, stay updated on department events, and connect with fellow students.
        </p>
        <Link to="/signup">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-6 text-xs sm:text-sm font-semibold rounded-lg">
            Get Started <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </section>
  </PageLayout>
);

export default About;
