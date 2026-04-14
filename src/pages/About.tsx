import PageLayout from "@/components/PageLayout";
import { Target, Eye, Clock, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const timeline = [
  { year: "2020", title: "Club Founded", desc: "Started with 15 passionate students in a single lab." },
  { year: "2021", title: "First Hackathon", desc: "Organized HackFusion with 80+ participants." },
  { year: "2022", title: "100 Members", desc: "Crossed 100 active members. Won 5 national competitions." },
  { year: "2023", title: "Industry Partnerships", desc: "Partnered with PrepVerse, TechCorp, and 10+ companies." },
  { year: "2024", title: "Open Source Push", desc: "Launched 30+ open-source projects on GitHub." },
  { year: "2025", title: "200+ Members", desc: "Expanded to multiple departments. Hosted 50+ events." },
];

const achievements = [
  "🏆 1st Place — National Hackathon Championship 2024",
  "🥇 Best Innovation Award — TechSummit 2023",
  "⭐ 500+ GitHub contributions in a single year",
  "🎓 50+ members placed at top tech companies",
  "📱 10+ apps published on Play Store & App Store",
  "🌐 Featured in 3 national tech publications",
];

const About = () => (
  <PageLayout>
    {/* Hero */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">About Us</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">We build builders.</h1>
        <p className="text-muted-foreground text-[15px] max-w-lg mx-auto">
          TechClub is a student-run community dedicated to creating real impact through technology, collaboration, and continuous learning.
        </p>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-6">
        <div className="border border-border rounded-lg p-8 bg-card">
          <Target className="w-6 h-6 text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To empower students with practical technical skills, foster innovation through hands-on projects, and create a supportive community that prepares members for the tech industry.
          </p>
        </div>
        <div className="border border-border rounded-lg p-8 bg-card">
          <Eye className="w-6 h-6 text-primary mb-4" />
          <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To become the most impactful student tech community — producing innovators who solve real problems and contribute meaningfully to the global tech ecosystem.
          </p>
        </div>
      </div>
    </section>

    {/* Timeline */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Our Journey</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Timeline</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-6 mb-8 last:mb-0">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-xs font-mono text-primary shrink-0">
                  {item.year.slice(2)}
                </div>
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <p className="text-xs text-muted-foreground font-mono mb-1">{item.year}</p>
                <h3 className="font-semibold text-[15px] mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Achievements */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4">
        <div className="section-header">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Achievements</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What we've accomplished</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
          {achievements.map((a, i) => (
            <div key={i} className="border border-border rounded-lg p-4 bg-card text-sm">{a}</div>
          ))}
        </div>
      </div>
    </section>

    {/* Why Join */}
    <section className="section-padding">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Why join TechClub?</h2>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto mb-8">
          Gain hands-on experience, build your portfolio, meet like-minded peers, and get mentored by industry professionals — all while having fun.
        </p>
        <Link to="/signup">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm">
            Join Now <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </section>
  </PageLayout>
);

export default About;
