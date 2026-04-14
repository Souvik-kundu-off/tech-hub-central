const sponsors = ["PrepVerse", "TechCorp", "DevHub", "CloudBase", "InnoLabs", "CodeAcademy", "ByteWorks", "StackBuild"];

const SponsorsSection = () => (
  <section className="section-padding border-t border-border">
    <div className="container mx-auto px-4">
      <div className="section-header">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Partners</p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Backed by the best</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sponsors.map((name, i) => (
          <div key={i} className="border border-border rounded-lg h-20 flex items-center justify-center hover:border-foreground/20 transition-colors bg-card">
            <span className="font-semibold text-sm text-muted-foreground">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
