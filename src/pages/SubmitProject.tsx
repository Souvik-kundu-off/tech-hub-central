import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Loader2, Save, Send, Github, Globe, Image as ImageIcon, X, Plus, ArrowLeft,
} from "lucide-react";
import { z } from "zod";
import { isValidGithubUrl, normalizeSocialUrl } from "@/lib/utils-url";

const projectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().trim().min(20, "Describe your project in detail").max(5000),
  category: z.string().min(1, "Pick a category"),
  github_url: z.string().trim().url("Invalid URL").max(300).optional().or(z.literal("")),
  live_url: z.string().trim().url("Invalid URL").max(300).optional().or(z.literal("")),
});

const categories = ["AI", "Web", "App", "Hardware", "Game", "Other"];

const SubmitProject = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState<"draft" | "submit" | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    github_url: "",
    live_url: "",
  });
  const [stack, setStack] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [team, setTeam] = useState<string[]>([]);
  const [teamInput, setTeamInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!isEdit || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("projects").select("*").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error("Project not found");
        navigate("/my-projects");
        return;
      }
      if (data.author_id !== user.id) {
        toast.error("Not your project");
        navigate("/my-projects");
        return;
      }
      setForm({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        github_url: data.github_url || "",
        live_url: data.live_url || "",
      });
      setStack(data.stack || []);
      setTags(data.tags || []);
      setTeam(data.team_members || []);
      setImages(data.images || []);
      setLoading(false);
    })();
  }, [id, user, isEdit, navigate]);

  const addChip = (
    val: string,
    list: string[],
    setList: (v: string[]) => void,
    setInput: (v: string) => void
  ) => {
    const v = val.trim();
    if (!v || list.includes(v) || list.length >= 15) return;
    setList([...list, v]);
    setInput("");
  };

  const removeChip = (i: number, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((_, idx) => idx !== i));
  };
  const save = async (status: "draft" | "pending") => {
    if (!user || !profile) return;
    if (status === "pending") {
      const result = projectSchema.safeParse(form);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      if (form.github_url && !isValidGithubUrl(form.github_url)) {
        toast.error("Please enter a valid GitHub repository URL (e.g. github.com/username/repository)");
        return;
      }
      if (stack.length === 0) {
        toast.error("Add at least one tech stack tag");
        return;
      }
    }
    setSaving(status === "draft" ? "draft" : "submit");

    const payload = {
      ...form,
      github_url: normalizeSocialUrl(form.github_url),
      live_url: normalizeSocialUrl(form.live_url),
      stack,
      tags,
      team_members: team,
      images,
      status,
      author_id: user.id,
      author_name: profile.full_name || "Anonymous",
    };

    const query = isEdit
      ? supabase.from("projects").update(payload).eq("id", id)
      : supabase.from("projects").insert([payload]);

    const { error } = await query;
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        status === "draft" ? "Draft saved" : "Project submitted for review!"
      );
      navigate("/my-projects");
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-40">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <button
          onClick={() => navigate("/my-projects")}
          className="text-xs text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back to My Projects
        </button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-1">
            {isEdit ? "Edit Project" : "Submit a Project"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Showcase your work to the community. Approved submissions earn 50 credits.
          </p>
        </header>

        <div className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Project Title *</Label>
            <Input
              value={form.title}
              maxLength={100}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Real-time Code Collaboration Tool"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description *</Label>
            <Textarea
              value={form.description}
              maxLength={5000}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does it do? What problem does it solve? What did you learn?"
              className="min-h-[140px]"
            />
            <p className="text-[11px] text-muted-foreground text-right">{form.description.length}/5000</p>
          </div>

          {/* Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category *</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Live Demo URL</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  value={form.live_url}
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                  placeholder="https://your-project.com"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* GitHub */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">GitHub Repo</Label>
            <div className="relative">
              <Github className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                placeholder="https://github.com/you/repo"
                className="pl-9"
              />
            </div>
          </div>

          {/* Tech Stack */}
          <ChipsField
            label="Tech Stack *"
            placeholder="React, Node.js, Postgres..."
            input={stackInput}
            setInput={setStackInput}
            list={stack}
            onAdd={() => addChip(stackInput, stack, setStack, setStackInput)}
            onRemove={(i) => removeChip(i, stack, setStack)}
          />

          {/* Tags */}
          <ChipsField
            label="Search Tags"
            placeholder="ai, productivity, education..."
            input={tagInput}
            setInput={setTagInput}
            list={tags}
            onAdd={() => addChip(tagInput, tags, setTags, setTagInput)}
            onRemove={(i) => removeChip(i, tags, setTags)}
          />

          {/* Team */}
          <ChipsField
            label="Team Members"
            placeholder="Their name..."
            input={teamInput}
            setInput={setTeamInput}
            list={team}
            onAdd={() => addChip(teamInput, team, setTeam, setTeamInput)}
            onRemove={(i) => removeChip(i, team, setTeam)}
          />

          {/* Images */}
          <CloudinaryMultiUpload
            images={images}
            onChange={setImages}
            maxImages={6}
            maxSizeMB={5}
            folder="tech-hub/projects"
            label="Screenshots (max 6, 5MB each)"
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border">
            <Button
              variant="outline"
              onClick={() => save("draft")}
              disabled={!!saving}
              className="flex-1 gap-2"
            >
              {saving === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
              Save Draft
            </Button>
            <Button
              onClick={() => save("pending")}
              disabled={!!saving}
              className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saving === "submit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
              Submit for Review
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const ChipsField = ({
  label, placeholder, input, setInput, list, onAdd, onRemove,
}: {
  label: string; placeholder: string;
  input: string; setInput: (v: string) => void;
  list: string[];
  onAdd: () => void;
  onRemove: (i: number) => void;
}) => (
  <div className="space-y-2">
    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
    <div className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
      />
      <Button type="button" variant="outline" onClick={onAdd}><Plus size={14} /></Button>
    </div>
    {list.length > 0 && (
      <div className="flex flex-wrap gap-1.5 pt-1">
        {list.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent text-xs">
            {item}
            <button type="button" onClick={() => onRemove(i)} className="text-muted-foreground hover:text-destructive">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

export default SubmitProject;
