import { 
  Settings, 
  Database, 
  Lock, 
  Eye, 
  EyeOff, 
  Globe, 
  Terminal,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

const MaintenancePanel = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings size={20} className="text-primary" /> Hub Maintenance
        </h2>
        <p className="text-sm text-muted-foreground">Manage global site configurations and system status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 border border-white/5 rounded-[28px] p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Maintenance Mode</h4>
                <p className="text-[10px] text-muted-foreground">Temporarily disable non-admin access.</p>
              </div>
            </div>
            <Switch disabled />
          </div>
          <p className="text-[11px] text-muted-foreground bg-white/5 p-3 rounded-xl italic">
            Maintenance mode is currently controlled by high-level Overseer commands.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 border border-white/5 rounded-[28px] p-6 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Globe size={20} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Public Discovery</h4>
                <p className="text-[10px] text-muted-foreground">Toggle visibility of the showcase gallery.</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card/50 border border-white/5 rounded-[28px] p-6 space-y-4 col-span-full md:col-span-1"
        >
          <h4 className="font-bold text-sm flex items-center gap-2">
            <Database size={16} className="text-primary"/> System Health
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Database Connection</span>
              <span className="text-emerald-500 font-bold">Stable</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Real-time Channels</span>
              <span className="text-emerald-500 font-bold">Connected</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Auth Service</span>
              <span className="text-emerald-500 font-bold">Online</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/50 border border-white/5 rounded-[28px] p-6 flex flex-col justify-center items-center text-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Terminal size={24} />
          </div>
          <h4 className="font-bold text-sm">Clear Cache</h4>
          <p className="text-[10px] text-muted-foreground max-w-[180px]">Purge all temporary session data and refresh global states.</p>
          <Button variant="outline" size="sm" className="rounded-xl h-8 px-5">Flush Data</Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenancePanel;
