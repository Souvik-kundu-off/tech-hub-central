import PageLayout from "@/components/PageLayout";
import { Trophy, Medal, Award } from "lucide-react";

const topContributors = [
  { rank: 1, name: "Vikram Singh", points: 2450, projects: 8, wins: 5 },
  { rank: 2, name: "Ananya Reddy", points: 2180, projects: 6, wins: 4 },
  { rank: 3, name: "Rahul Sharma", points: 1950, projects: 7, wins: 3 },
  { rank: 4, name: "Priya Patel", points: 1720, projects: 5, wins: 3 },
  { rank: 5, name: "Arjun Mehta", points: 1580, projects: 4, wins: 2 },
  { rank: 6, name: "Sneha Gupta", points: 1340, projects: 5, wins: 2 },
  { rank: 7, name: "Karan Joshi", points: 1200, projects: 3, wins: 1 },
  { rank: 8, name: "Meera Shah", points: 1080, projects: 4, wins: 1 },
  { rank: 9, name: "Rohan Verma", points: 960, projects: 3, wins: 1 },
  { rank: 10, name: "Diya Nair", points: 890, projects: 2, wins: 1 },
];

const RankIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
  if (rank === 2) return <Medal className="w-4 h-4 text-gray-400" />;
  if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
  return <span className="text-xs text-muted-foreground w-4 text-center">{rank}</span>;
};

const Leaderboard = () => (
  <PageLayout>
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Leaderboard</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Top contributors.</h1>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
          Recognizing members who've made the biggest impact through projects, contributions, and wins.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Top 3 highlight */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {topContributors.slice(0, 3).map((c) => (
            <div
              key={c.rank}
              className={`border rounded-lg p-5 bg-card text-center ${
                c.rank === 1 ? "border-yellow-500/30" : "border-border"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-sm font-semibold text-muted-foreground mx-auto mb-3">
                {c.name.split(" ").map(w => w[0]).join("")}
              </div>
              <RankIcon rank={c.rank} />
              <h3 className="font-semibold text-sm mt-1.5">{c.name}</h3>
              <p className="text-xl font-bold text-primary mt-1">{c.points}</p>
              <p className="text-[11px] text-muted-foreground">points</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-4 px-4 py-2.5 bg-accent text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>#</span>
            <span>Member</span>
            <span className="text-right">Points</span>
            <span className="text-right">Projects</span>
            <span className="text-right">Wins</span>
          </div>
          {topContributors.map((c) => (
            <div
              key={c.rank}
              className="grid grid-cols-[40px_1fr_80px_80px_80px] gap-4 px-4 py-3 border-t border-border items-center hover:bg-accent/50 transition-colors"
            >
              <RankIcon rank={c.rank} />
              <span className="text-sm font-medium">{c.name}</span>
              <span className="text-sm text-right text-primary font-semibold">{c.points}</span>
              <span className="text-sm text-right text-muted-foreground">{c.projects}</span>
              <span className="text-sm text-right text-muted-foreground">{c.wins}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Leaderboard;
