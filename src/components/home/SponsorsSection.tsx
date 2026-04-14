const sponsors = [
  "PrepVerse", "TechCorp", "DevHub", "CloudBase",
  "InnoLabs", "CodeAcademy", "ByteWorks", "StackBuild",
];

const SponsorsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <p className="text-primary text-sm font-mono mb-2">// partners</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl">
            Our <span className="gradient-text">Sponsors & Partners</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((name, i) => (
            <div
              key={i}
              className="glass rounded-xl py-8 flex items-center justify-center hover:glow-border transition-all duration-300 group"
            >
              <span className="font-display font-bold text-lg text-muted-foreground group-hover:text-primary transition-colors">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
