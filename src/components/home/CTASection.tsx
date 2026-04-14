import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => (
  <section className="section-padding">
    <div className="container mx-auto px-4">
      <div className="border border-border rounded-xl p-10 md:p-16 text-center bg-card">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">Ready to build something great?</h2>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto mb-8">
          Join 200+ students shipping real projects. No experience required — just curiosity.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-sm">
              Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="h-10 px-6 text-sm border-border hover:bg-accent">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
