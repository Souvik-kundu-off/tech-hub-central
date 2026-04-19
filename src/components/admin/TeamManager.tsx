import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users, Plus, Trash2, Loader2, Edit3, X,
  Github, Linkedin, Twitter, GraduationCap, Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { logAdminAction } from "./AuditLog";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  department: string;
  avatar_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  is_faculty: boolean;
  sort_order: number;
  created_at: string;
}

const emptyForm = {
  full_name: "",
  role: "",
  department: "",
  avatar_url: "",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
  is_faculty: false,
  sort_order: 0,
};

const TeamManager = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error("Failed to load team");
    else setMembers((data as TeamMember[]) || []);
    setLoading(false);
  };

  const startEdit = (m: TeamMember) => {
    setEditing(m.id); setCreating(false);
    setForm({
      full_name: m.full_name || "", role: m.role || "", department: m.department || "",
      avatar_url: m.avatar_url || "", github_url: m.github_url || "",
      linkedin_url: m.linkedin_url || "", twitter_url: m.twitter_url || "",
      is_faculty: m.is_faculty, sort_order: m.sort_order || 0,
    });
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(emptyForm); };

  const save = async () => {
    if (!form.full_name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);

    const saveData = {
      ...form,
      sort_order: editing ? form.sort_order : members.length,
    };

    const query = editing
      ? supabase.from("team_members").update(saveData).eq("id", editing)
      : supabase.from("team_members").insert([saveData]);

    const { error } = await query;
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Team member updated" : "Team member added!");
      await logAdminAction({
        actionType: editing ? "UPDATE" : "CREATE",
        targetType: "TEAM",
        targetId: editing || "",
        targetLabel: form.full_name,
        details: `${form.is_faculty ? "Faculty" : "Core Team"} — ${form.role}`,
      });
      cancel(); fetchMembers();
    }
    setSaving(false);
  };

  const remove = async (m: TeamMember) => {
    if (!confirm(`Remove ${m.full_name} from the team page?`)) return;
    const { error } = await supabase.from("team_members").delete().eq("id", m.id);
    if (error) toast.error(error.message);
    else {
      setMembers(prev => prev.filter(x => x.id !== m.id));
      toast.success("Removed from team");
      await logAdminAction({
        actionType: "DELETE",
        targetType: "TEAM",
        targetId: m.id,
        targetLabel: m.full_name,
        details: "Removed from team page",
      });
    }
  };

  const showForm = creating || editing !== null;
  const coreTeam = members.filter(m => !m.is_faculty);
  const faculty = members.filter(m => m.is_faculty);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" /> Team Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage who appears on the public team page. {coreTeam.length} core, {faculty.length} faculty.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => { setCreating(true); setForm(emptyForm); }} className="gap-2">
            <Plus size={16} /> Add Member
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border border-white/10 rounded-[24px] p-6 bg-card space-y-4 shadow-2xl shadow-primary/5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editing ? "Edit Member" : "Add Team Member"}</h3>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Role/Title</label>
              <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. President, Dev Lead" className="bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Department</label>
              <Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} placeholder="e.g. Computer Science" className="bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <CloudinaryUpload
                label="Avatar Photo"
                variant="avatar"
                folder="tech-hub/team"
                currentUrl={form.avatar_url}
                onUpload={(url) => setForm({ ...form, avatar_url: url })}
                onClear={() => setForm({ ...form, avatar_url: "" })}
              />
              <Input
                value={form.avatar_url}
                onChange={e => setForm({ ...form, avatar_url: e.target.value })}
                placeholder="...or paste a URL"
                className="bg-black/20 border-white/10 rounded-xl text-[11px]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1"><Github size={10} /> GitHub URL</label>
              <Input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." className="bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1"><Linkedin size={10} /> LinkedIn URL</label>
              <Input value={form.linkedin_url} onChange={e => setForm({ ...form, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." className="bg-black/20 border-white/10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1"><Twitter size={10} /> Twitter URL</label>
              <Input value={form.twitter_url} onChange={e => setForm({ ...form, twitter_url: e.target.value })} placeholder="https://twitter.com/..." className="bg-black/20 border-white/10 rounded-xl" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent">
            <Switch checked={form.is_faculty} onCheckedChange={v => setForm({ ...form, is_faculty: v })} />
            <Label className="text-sm">{form.is_faculty ? "Faculty Coordinator" : "Core Team Member"}</Label>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button onClick={save} disabled={saving} className="flex-1 gap-2 rounded-xl">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Update Member" : "Add to Team"}
            </Button>
            <Button variant="outline" onClick={cancel} className="rounded-xl">Cancel</Button>
          </div>
        </div>
      )}

      {/* Team List */}
      {!showForm && (
        loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : members.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-[24px] py-20 text-center text-sm text-muted-foreground">No team members added yet.</div>
        ) : (
          <div className="space-y-6">
            {/* Core Team */}
            {coreTeam.length > 0 && (
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                  <Crown size={14} className="text-primary" /> Core Team ({coreTeam.length})
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {coreTeam.map(m => (
                    <TeamCard key={m.id} member={m} onEdit={() => startEdit(m)} onRemove={() => remove(m)} />
                  ))}
                </div>
              </div>
            )}
            {/* Faculty */}
            {faculty.length > 0 && (
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                  <GraduationCap size={14} className="text-primary" /> Faculty ({faculty.length})
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {faculty.map(m => (
                    <TeamCard key={m.id} member={m} onEdit={() => startEdit(m)} onRemove={() => remove(m)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

const TeamCard = ({ member, onEdit, onRemove }: { member: TeamMember; onEdit: () => void; onRemove: () => void }) => (
  <div className="bg-card/50 border border-white/5 rounded-2xl p-5 group hover:border-primary/20 transition-all relative">
    <div className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-[11px] font-bold text-muted-foreground shrink-0 overflow-hidden">
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
        ) : (
          member.full_name?.split(" ").map(w => w[0]).join("")
        )}
      </div>
      <div className="min-w-0">
        <h4 className="font-bold text-sm truncate">{member.full_name}</h4>
        <p className="text-[11px] text-primary font-medium">{member.role}</p>
        <p className="text-[10px] text-muted-foreground">{member.department}</p>
        <div className="flex gap-2 mt-2">
          {member.github_url && <Github size={12} className="text-muted-foreground" />}
          {member.linkedin_url && <Linkedin size={12} className="text-muted-foreground" />}
          {member.twitter_url && <Twitter size={12} className="text-muted-foreground" />}
        </div>
      </div>
    </div>
    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={onEdit} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"><Edit3 size={12} /></button>
      <button onClick={onRemove} className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={12} /></button>
    </div>
  </div>
);

export default TeamManager;
