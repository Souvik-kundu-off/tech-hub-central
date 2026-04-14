import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Users, 
  Search, 
  Trophy, 
  Shield, 
  ShieldCheck, 
  PlusCircle, 
  MinusCircle, 
  Loader2,
  ExternalLink,
  Mail,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Member {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  role: string;
  points: number;
  programme_name: string;
  created_at: string;
}

const MemberManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("points", { ascending: false });

    if (error) {
      toast.error("Failed to load directory");
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  const handlePointAdjustment = async (memberId: string, amount: number) => {
    setProcessing(memberId);
    
    // 1. Update Profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ points: members.find(m => m.id === memberId)!.points + amount })
      .eq("id", memberId);

    if (profileError) {
      toast.error("Point update failed");
    } else {
      // 2. Log in points_history
      await supabase.from("points_history").insert([{
        user_id: memberId,
        amount: amount,
        action_type: "ADMIN_ADJUSTMENT",
        description: `Manual adjustment by Nexus Overseer: ${amount > 0 ? '+' : ''}${amount} pts`
      }]);

      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, points: m.points + amount } : m));
      toast.success(`Credits adjusted: ${amount > 0 ? '+' : ''}${amount}`);
    }
    setProcessing(null);
  };

  const toggleRole = async (memberId: string, currentRole: string) => {
    if (!confirm(`Promote this member to ${currentRole === 'admin' ? 'Member' : 'Admin'}?`)) return;
    
    setProcessing(memberId);
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", memberId);

    if (error) {
      toast.error("Role update failed");
    } else {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      toast.success(`Access updated to ${newRole}`);
    }
    setProcessing(null);
  };

  const filtered = members.filter(m => 
    m.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase()) ||
    m.programme_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" /> Member Directory
          </h2>
          <p className="text-sm text-muted-foreground">Manage roles, audit contributions, and award credits.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search name, email, or dept..." 
            className="pl-9 bg-card border-white/10 rounded-xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card/30 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Member</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Programme</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Hub Credits</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin inline text-primary" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center text-muted-foreground text-sm">No members matching your search.</td></tr>
              ) : (
                filtered.map(member => (
                  <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="text-[10px] font-bold">{member.full_name?.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[150px]">{member.full_name}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] font-medium text-muted-foreground">{member.programme_name || "Nexus Explorer"}</span>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${member.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-muted-foreground'}`}>
                        {member.role === 'admin' ? <ShieldCheck size={10} /> : <Shield size={10} />}
                        {member.role === 'admin' ? 'Overseer' : 'Hub Member'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => handlePointAdjustment(member.id, -10)}
                          disabled={processing === member.id}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        ><MinusCircle size={16} /></button>
                        <span className="text-sm font-black tabular-nums min-w-[30px]">{member.points}</span>
                        <button 
                          onClick={() => handlePointAdjustment(member.id, 10)}
                          disabled={processing === member.id}
                          className="text-primary hover:scale-110 transition-all"
                        ><PlusCircle size={16} /></button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Nexus Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.open(`mailto:${member.email}`)} className="gap-2">
                             <Mail size={14} /> Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleRole(member.id, member.role)} className="gap-2">
                             <Shield size={14} /> {member.role === 'admin' ? 'Demote to Member' : 'Promote to Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                             <ExternalLink size={14} /> Ban from Hub
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManager;
