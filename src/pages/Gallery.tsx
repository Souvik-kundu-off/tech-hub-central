import PageLayout from "@/components/PageLayout";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  image_url: string;
  album: string;
}

const Gallery = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["gallery_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  // Group by album
  const albums = [...new Set(items.map(i => i.album).filter(Boolean))];
  const ungrouped = items.filter(i => !i.album);

  return (
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
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm py-20 text-center">No gallery images yet.</p>
          ) : (
            <div className="space-y-12">
              {albums.map(album => {
                const albumItems = items.filter(i => i.album === album);
                return (
                  <div key={album}>
                    <h2 className="text-lg font-bold mb-4">{album} <span className="text-xs text-muted-foreground font-normal ml-1">{albumItems.length} photos</span></h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {albumItems.map(g => (
                        <GalleryCard key={g.id} item={g} />
                      ))}
                    </div>
                  </div>
                );
              })}
              {ungrouped.length > 0 && (
                <div>
                  {albums.length > 0 && <h2 className="text-lg font-bold mb-4">Other</h2>}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ungrouped.map(g => (
                      <GalleryCard key={g.id} item={g} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

const GalleryCard = ({ item }: { item: GalleryItem }) => (
  <div className="group border border-border rounded-lg overflow-hidden bg-card hover:border-foreground/20 transition-colors cursor-pointer">
    <div className="aspect-video relative overflow-hidden">
      <img
        src={item.image_url}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-foreground" />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-sm">{item.title}</h3>
      {item.caption && <p className="text-xs text-muted-foreground mt-0.5">{item.caption}</p>}
    </div>
  </div>
);

export default Gallery;
