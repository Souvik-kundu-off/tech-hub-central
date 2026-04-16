import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import MemberHome from "@/components/home/MemberHome";
import FeaturedEvents from "@/components/home/FeaturedEvents";
import AboutPreview from "@/components/home/AboutPreview";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import SponsorsSection from "@/components/home/SponsorsSection";
import CTASection from "@/components/home/CTASection";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!loading && session && role === "admin") {
      navigate("/admin");
    }
  }, [loading, session, role, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        console.warn("Auth initialization is taking longer than expected. Showing fallback content.");
        setTimedOut(true);
      }, 5000); // 5 second safety break
    }
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Synchronizing with Hub...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {session ? (
        <MemberHome />
      ) : (
        <>
          <HeroSection />
          <FeaturedEvents />
          <AboutPreview />
          <FeaturedProjects />
          <SponsorsSection />
          <CTASection />
        </>
      )}
      <Footer />
    </div>
  );
};

export default Index;
