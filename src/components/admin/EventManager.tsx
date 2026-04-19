import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Calendar, Plus, Trash2, Edit3, Loader2, MapPin, Users, X,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  type: string | null;
  spots: number | null;
  mode: string | null;
  banner_url: string | null;
  register_url: string | null;
  is_upcoming: boolean;
  created_at: string;
}

const empty = {
  title: "", description: "", date: "", location: "",
  type: "Workshop", spots: 50, mode: "Offline",
  banner_url: "", register_url: "", is_upcoming: true,
};

const EventManager = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load events");
    else setEvents((data as Event[]) || []);
    setLoading(false);
  };

  const startEdit = (e: Event) => {
    setEditing(e.id); setCreating(false);
    setForm({
      title: e.title || "", description: e.description || "", date: e.date || "",
      location: e.location || "", type: e.type || "Workshop", spots: e.spots || 0,
      mode: e.mode || "Offline", banner_url: e.banner_url || "",
      register_url: e.register_url || "", is_upcoming: e.is_upcoming,
    });
  };

  const cancel = () => { setEditing(null); setCreating(false); setForm(empty); };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const query = editing
      ? supabase.from("events").update(form).eq("id", editing)
      : supabase.from("events").insert([form]);
    const { error } = await query;
    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Event updated" : "Event created");
      cancel(); fetchEvents();
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setEvents((e) => e.filter((x) => x.id !== id)); }
  };

  const showForm = creating || editing !== null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={20} className="text-primary" /> Event Manager
          </h2>
          <p className="text-sm text-muted-foreground">Create, edit, and archive hub events.</p>
        </div>
        {!showForm && (
          <Button onClick={() => { setCreating(true); setForm(empty); }} className="gap-2">
            <Plus size={16} /> New Event
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border border-border rounded-xl p-6 bg-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editing ? "Edit Event" : "Create Event"}</h3>
            <button onClick={cancel} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Title">
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Type">
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Hackathon", "Workshop", "Competition", "Gaming", "Meetup", "Talk"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date">
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Mar 15, 2025" />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Hall A or Online" />
            </Field>
            <Field label="Mode">
              <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Spots Available">
              <Input type="number" value={form.spots} onChange={(e) => setForm({ ...form, spots: parseInt(e.target.value) || 0 })} />
            </Field>
            <Field label="Banner Image URL">
              <Input value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} placeholder="https://..." />
            </Field>
            <Field label="Register URL (external)">
              <Input value={form.register_url} onChange={(e) => setForm({ ...form, register_url: e.target.value })} placeholder="https://..." />
            </Field>
          </div>

          <Field label="Description">
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-[100px]" />
          </Field>

          <div className="flex items-center gap-3 p-3 rounded-md bg-accent">
            <Switch checked={form.is_upcoming} onCheckedChange={(v) => setForm({ ...form, is_upcoming: v })} />
            <Label className="text-sm">Upcoming Event (shows in upcoming tab)</Label>
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            <Button onClick={save} disabled={saving} className="flex-1 gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? "Update Event" : "Publish Event"}
            </Button>
            <Button variant="outline" onClick={cancel}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : events.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-20 text-center text-sm text-muted-foreground">
          No events created yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {events.map((e) => (
            <div key={e.id} className="border border-border rounded-lg p-4 bg-card group">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary">{e.type}</span>
                    {!e.is_upcoming && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">· Past</span>}
                  </div>
                  <h4 className="font-semibold text-sm truncate">{e.title}</h4>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(e)} className="p-1.5 rounded hover:bg-accent"><Edit3 size={13} /></button>
                  <button onClick={() => remove(e.id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{e.description}</p>
              <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                {e.date && <span className="flex items-center gap-1"><Calendar size={11} /> {e.date}</span>}
                {e.location && <span className="flex items-center gap-1"><MapPin size={11} /> {e.location}</span>}
                {e.spots != null && <span className="flex items-center gap-1"><Users size={11} /> {e.spots}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default EventManager;
