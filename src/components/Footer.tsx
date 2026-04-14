import { Link } from "react-router-dom";
import { Terminal, Github, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm">TechClub</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Building the future, one project at a time.
          </p>
          <div className="flex gap-2">
            {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Pages", links: ["About", "Events", "Projects", "Team", "Blog"] },
          { title: "Resources", links: ["Roadmaps", "Notes", "Sessions", "Tools", "Gallery"] },
          { title: "Connect", links: ["Contact", "Discord", "WhatsApp", "Email", "Careers"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">{col.title}</h4>
            <div className="flex flex-col gap-1.5">
              {col.links.map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} TechClub. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">Built by club members with ❤️</p>
      </div>
    </div>
  </footer>
);

export default Footer;
