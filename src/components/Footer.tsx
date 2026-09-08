import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <img
              src="/Uni logo/CSE_AI_WHITE_LOGO_FULL.png"
              alt="CSE-AI Student Hub"
              className="h-14 sm:h-18 w-auto"
            />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Official project & innovation hub for CSE-AI students.
          </p>
          <a href="mailto:cse-ai@university.edu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Mail className="w-4 h-4" />
            <span>cse-ai@university.edu</span>
          </a>
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
      <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/All logo GSA/Google Logo.png"
            alt="Google"
            className="h-6 w-auto opacity-60"
          />
          <span className="text-xs text-muted-foreground">Google Student Community</span>
        </div>
        <img
          src="/All logo GSA/Gemini Sparkle.png"
          alt="#TeamGemini"
          className="h-5 w-auto opacity-50"
        />
      </div>
      <div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CSE-AI Student Hub. Department of CSE-AI.</p>
        <p className="text-xs text-muted-foreground">Built by students. Powered by ideas.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
