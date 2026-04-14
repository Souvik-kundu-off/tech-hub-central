import { Link } from "react-router-dom";
import { Code2, Github, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">TechClub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Building the future, one project at a time. Join our community of passionate developers and innovators.
            </p>
            <div className="flex gap-3 mt-4">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["About", "Events", "Projects", "Team", "Blog"].map((item) => (
                <Link key={item} to={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Resources</h4>
            <div className="flex flex-col gap-2">
              {["Roadmaps", "Notes & PDFs", "Recorded Sessions", "Tools & Links", "Gallery"].map((item) => (
                <a key={item} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Get in Touch</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:hello@techclub.dev" className="hover:text-primary transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@techclub.dev
              </a>
              <p>Computer Science Department</p>
              <p>Your College Name</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TechClub. Built with 💙 by club members.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
