import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Loader2, 
  User, 
  BookOpen, 
  Hash, 
  Phone, 
  Mail, 
  Github, 
  Linkedin, 
  Edit3, 
  Save, 
  X,
  Trophy,
  Layout,
  Award,
  ExternalLink
} from "lucide-react";

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  student_code: string;
  programme_name: string;
  phone_number: string;
  github_url: string;
  linkedin_url: string;
  points: number;
  projects_count: number;
  wins_count: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
      } else {
        setProfile(data);
        setFormData(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          student_code: formData.student_code,
          programme_name: formData.programme_name,
          phone_number: formData.phone_number,
          github_url: formData.github_url,
          linkedin_url: formData.linkedin_url,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      setProfile({ ...profile!, ...formData as ProfileData });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-8">
          
          {/* Left Column: Stats & Meta */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 mx-auto overflow-hidden flex items-center justify-center relative group">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.programme_name || "Club Member"}</p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-accent hover:bg-primary/10 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-accent hover:bg-primary/10 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{profile?.points}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Contr. Points</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Layout className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{profile?.projects_count}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Projects</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl font-bold leading-none">{profile?.wins_count}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">Wins</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Edit */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 border-b border-border pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Edit3 className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Profile Details</h3>
                </div>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2 h-8 text-[13px]">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="h-8 text-[13px]">
                      <X className="w-3.5 h-3.5 mr-1.5" /> Cancel
                    </Button>
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        className="pl-9 h-10 bg-background"
                        value={formData.full_name}
                        onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled
                        className="pl-9 h-10 bg-accent/30 opacity-70"
                        value={profile?.email}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Student Code</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        placeholder="e.g. CS2024001"
                        className="pl-9 h-10 bg-background"
                        value={formData.student_code}
                        onChange={e => setFormData({ ...formData, student_code: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Programme</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        placeholder="e.g. B.Tech Computer Science"
                        className="pl-9 h-10 bg-background"
                        value={formData.programme_name}
                        onChange={e => setFormData({ ...formData, programme_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        className="pl-9 h-10 bg-background"
                        value={formData.phone_number}
                        onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      GitHub URL {profile?.github_url && <a href={profile.github_url} target="_blank" className="text-primary hover:underline lowercase tracking-normal flex items-center gap-0.5"><ExternalLink className="w-2.5 h-2.5" /> visit</a>}
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        placeholder="github.com/username"
                        className="pl-9 h-10 bg-background"
                        value={formData.github_url}
                        onChange={e => setFormData({ ...formData, github_url: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                      LinkedIn URL {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" className="text-primary hover:underline lowercase tracking-normal flex items-center gap-0.5"><ExternalLink className="w-2.5 h-2.5" /> visit</a>}
                    </Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        disabled={!editing}
                        placeholder="linkedin.com/in/username"
                        className="pl-9 h-10 bg-background"
                        value={formData.linkedin_url}
                        onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {editing && (
                  <Button 
                    disabled={saving}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-[15px] rounded-xl transition-all active:scale-[0.98]"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
