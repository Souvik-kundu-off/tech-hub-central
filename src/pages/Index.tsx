import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import AboutPreview from "@/components/home/AboutPreview";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import SponsorsSection from "@/components/home/SponsorsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedEvents />
      <AboutPreview />
      <StatsSection />
      <FeaturedProjects />
      <SponsorsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
