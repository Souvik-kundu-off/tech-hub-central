import PageLayout from "@/components/PageLayout";
import { BookOpen, FileText, Video, Wrench, ExternalLink } from "lucide-react";

const sections = [
  {
    icon: BookOpen,
    title: "Roadmaps",
    desc: "Curated learning paths for different tech domains.",
    items: [
      { name: "Frontend Development Roadmap", link: "#" },
      { name: "Backend Development Roadmap", link: "#" },
      { name: "Data Science & ML Roadmap", link: "#" },
      { name: "Mobile App Development Roadmap", link: "#" },
      { name: "DevOps & Cloud Roadmap", link: "#" },
    ],
  },
  {
    icon: FileText,
    title: "Notes & PDFs",
    desc: "Study materials shared by club members and mentors.",
    items: [
      { name: "DSA Complete Notes", link: "#" },
      { name: "System Design Handbook", link: "#" },
      { name: "Operating Systems Quick Reference", link: "#" },
      { name: "DBMS Cheat Sheet", link: "#" },
      { name: "Computer Networks Summary", link: "#" },
    ],
  },
  {
    icon: Video,
    title: "Recorded Sessions",
    desc: "Watch our past workshops and talks at your own pace.",
    items: [
      { name: "Intro to React — Workshop Recording", link: "#" },
      { name: "Git & GitHub Masterclass", link: "#" },
      { name: "Building REST APIs with Node.js", link: "#" },
      { name: "ML for Beginners — Session 1–5", link: "#" },
    ],
  },
  {
    icon: Wrench,
    title: "Tools & Links",
    desc: "Useful tools and platforms we recommend.",
    items: [
      { name: "VS Code Setup Guide", link: "#" },
      { name: "Free Hosting Platforms", link: "#" },
      { name: "Design Resources (Figma, Icons)", link: "#" },
      { name: "Competitive Programming Judges", link: "#" },
    ],
  },
];

const Resources = () => (
  <PageLayout>
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Resources</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need.</h1>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
          Roadmaps, notes, recorded sessions, and tools — curated by the community.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto px-4 space-y-12">
        {sections.map((section, i) => (
          <div key={i}>
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="w-5 h-5 text-primary" />
              <div>
                <h2 className="font-semibold text-lg">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.items.map((item, j) => (
                <a
                  key={j}
                  href={item.link}
                  className="border border-border rounded-lg p-4 bg-card hover:border-foreground/20 transition-colors flex items-center justify-between group"
                >
                  <span className="text-sm">{item.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  </PageLayout>
);

export default Resources;
