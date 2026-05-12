import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Code, Users, Trophy } from "lucide-react";

const pillars = [
  { icon: BookOpen, title: "Learn", desc: "Workshops, bootcamps, and mentorship from industry professionals." },
  { icon: Code, title: "Build", desc: "Real-world projects, hackathons, and open-source contributions." },
  { icon: Users, title: "Connect", desc: "Network with peers, alumni, and tech industry leaders." },
  { icon: Trophy, title: "Compete", desc: "Coding contests, tech quizzes, and national-level competitions." },
];

const AboutPreview = () => (
  <section className="section-padding border-t border-border relative overflow-hidden">
    {/* Floating GSA logos */}
    <img src="/All logo GSA/10 (14).png" alt="" aria-hidden="true"
      className="absolute top-12 left-[3%] w-18 md:w-24 opacity-35 pointer-events-none select-none"
      style={{ animation: "aboutFloat 8s ease-in-out 0.5s infinite" }} />
    <img src="/All logo GSA/Google Gemini Logo on White.png" alt="" aria-hidden="true"
      className="absolute bottom-8 right-[4%] w-20 md:w-28 opacity-30 pointer-events-none select-none"
      style={{ animation: "aboutFloat 10s ease-in-out 2s infinite" }} />
    <style>{`@keyframes aboutFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(2deg)} }`}</style>

    <div className="container mx-auto px-4 relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">About Us</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">More than just a club.</h2>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
            We're a student-run tech community bridging classroom learning and industry skills. From beginner-friendly workshops to national hackathons, there's a place for everyone.
          </p>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
            Founded in 2020, we've grown from 15 members to 200+ passionate technologists who've shipped real products, won competitions, and landed dream roles.
          </p>
          <Link to="/about" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Learn more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {pillars.map((p, i) => (
            <div key={i} className="border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors bg-card">
              <p.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutPreview;
