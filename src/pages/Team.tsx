import PageLayout from "@/components/PageLayout";
import { Github, Linkedin, Twitter } from "lucide-react";

const coreTeam = [
  { name: "Aarav Kapoor", role: "President", dept: "CS — 4th Year", social: { github: "#", linkedin: "#", twitter: "#" } },
  { name: "Diya Nair", role: "Vice President", dept: "IT — 3rd Year", social: { github: "#", linkedin: "#", twitter: "#" } },
  { name: "Kabir Malhotra", role: "Tech Lead", dept: "CS — 3rd Year", social: { github: "#", linkedin: "#" } },
  { name: "Isha Verma", role: "Design Lead", dept: "CS — 2nd Year", social: { github: "#", linkedin: "#" } },
  { name: "Rohan Das", role: "Events Head", dept: "ECE — 3rd Year", social: { github: "#", linkedin: "#" } },
  { name: "Anika Sharma", role: "Content Lead", dept: "IT — 2nd Year", social: { linkedin: "#", twitter: "#" } },
  { name: "Vihaan Joshi", role: "Open Source Lead", dept: "CS — 3rd Year", social: { github: "#", linkedin: "#" } },
  { name: "Myra Reddy", role: "Community Manager", dept: "CS — 2nd Year", social: { linkedin: "#", twitter: "#" } },
];

const faculty = [
  { name: "Dr. Suresh Kumar", role: "Faculty Advisor", dept: "HOD, Computer Science" },
  { name: "Prof. Anita Singh", role: "Technical Mentor", dept: "Dept. of Information Technology" },
];

const Team = () => (
  <PageLayout>
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Team</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">The people behind it all.</h1>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
          Meet the students and mentors who make TechClub possible.
        </p>
      </div>
    </section>

    {/* Core Team */}
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-8">Core Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coreTeam.map((m, i) => (
            <div key={i} className="border border-border rounded-lg p-5 bg-card hover:border-foreground/20 transition-colors">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground mb-4">
                {m.name.split(" ").map(w => w[0]).join("")}
              </div>
              <h3 className="font-semibold text-sm">{m.name}</h3>
              <p className="text-xs text-primary mt-0.5">{m.role}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.dept}</p>
              <div className="flex gap-2 mt-3">
                {m.social.github && <a href={m.social.github} className="text-muted-foreground hover:text-foreground"><Github className="w-3.5 h-3.5" /></a>}
                {m.social.linkedin && <a href={m.social.linkedin} className="text-muted-foreground hover:text-foreground"><Linkedin className="w-3.5 h-3.5" /></a>}
                {m.social.twitter && <a href={m.social.twitter} className="text-muted-foreground hover:text-foreground"><Twitter className="w-3.5 h-3.5" /></a>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Faculty */}
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-8">Faculty Coordinators</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
          {faculty.map((f, i) => (
            <div key={i} className="border border-border rounded-lg p-5 bg-card">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground mb-4">
                {f.name.split(" ").filter(w => w[0] === w[0].toUpperCase()).map(w => w[0]).join("")}
              </div>
              <h3 className="font-semibold text-sm">{f.name}</h3>
              <p className="text-xs text-primary mt-0.5">{f.role}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.dept}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Team;
