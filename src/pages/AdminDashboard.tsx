import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { 
  ShieldCheck, 
  Layout, 
  Megaphone, 
  Users, 
  Settings,
  Loader2,
  AlertCircle,
  BookOpen,
  BarChart3,
  Calendar
} from "lucide-react";

import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectModeration from "@/components/admin/ProjectModeration";
import BroadcastManager from "@/components/admin/BroadcastManager";
import MemberManager from "@/components/admin/MemberManager";
import MaintenancePanel from "@/components/admin/MaintenancePanel";
import ResourceManager from "@/components/admin/ResourceManager";
import EventManager from "@/components/admin/EventManager";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import { motion } from "framer-motion";



import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { role, loading: authLoading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [timedOut, setTimedOut] = useState(false);
  
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (authLoading) {
      const timer = setTimeout(() => {
        setTimedOut(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  if (authLoading && !timedOut) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground animate-pulse font-medium">Verifying Authority...</p>
        </div>
      </div>
    );
  }

  if (role !== "admin" && !authLoading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-40">
          <AlertCircle size={48} className="text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-sm">This area is reserved for Hub Overseers only.</p>
        </div>
      </PageLayout>
    );
  }


  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary mb-4">
                <ShieldCheck size={12} />
                Nexus Overseer Panel
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Command Center.</h1>
              <p className="text-muted-foreground max-w-lg">
                Manage the community ecosystem—moderate builds, broadcast updates, and empower members.
              </p>
            </div>
          </motion.div>
        </header>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setSearchParams({ tab: value })}
          className="space-y-8"
        >
          <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 border-b border-white/5">
            <TabsList className="bg-white/5 border border-white/10 p-1.5 h-14 rounded-2xl overflow-x-auto justify-start md:justify-center">
              <TabsTrigger value="overview" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <BarChart3 size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <Layout size={16} /> Moderation
              </TabsTrigger>
              <TabsTrigger value="events" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <Calendar size={16} /> Events
              </TabsTrigger>
              <TabsTrigger value="broadcasts" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <Megaphone size={16} /> Broadcasts
              </TabsTrigger>
              <TabsTrigger value="members" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <Users size={16} /> Directory
              </TabsTrigger>
              <TabsTrigger value="resources" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <BookOpen size={16} /> Resources
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="rounded-xl px-4 md:px-5 gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all">
                <Settings size={16} /> Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-0 outline-none"><AnalyticsPanel /></TabsContent>
          <TabsContent value="projects" className="mt-0 outline-none"><ProjectModeration /></TabsContent>
          <TabsContent value="events" className="mt-0 outline-none"><EventManager /></TabsContent>
          <TabsContent value="broadcasts" className="mt-0 outline-none"><BroadcastManager /></TabsContent>
          <TabsContent value="members" className="mt-0 outline-none"><MemberManager /></TabsContent>
          <TabsContent value="resources" className="mt-0 outline-none"><ResourceManager /></TabsContent>
          <TabsContent value="maintenance" className="mt-0 outline-none"><MaintenancePanel /></TabsContent>

        </Tabs>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
