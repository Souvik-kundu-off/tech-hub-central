import PageLayout from "@/components/PageLayout";
import { Image as ImageIcon } from "lucide-react";

const galleries = [
  { title: "HackFusion 2025", count: 24, thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop" },
  { title: "AI Workshop Series", count: 12, thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop" },
  { title: "Orientation Day 2025", count: 18, thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop" },
  { title: "Code Wars Finals", count: 8, thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop" },
  { title: "Team Outing", count: 15, thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop" },
  { title: "Design Sprint", count: 10, thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop" },
];

const Gallery = () => (
  <PageLayout>
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Gallery</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Moments captured.</h1>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
          Photos and highlights from our events, workshops, and hangouts.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleries.map((g, i) => (
            <div key={i} className="group border border-border rounded-lg overflow-hidden bg-card hover:border-foreground/20 transition-colors cursor-pointer">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={g.thumbnail}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-foreground" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm">{g.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{g.count} photos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Gallery;
