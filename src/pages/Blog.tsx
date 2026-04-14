import PageLayout from "@/components/PageLayout";
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  { title: "HackFusion 2025 Recap — What Went Down", date: "May 12, 2025", category: "Event Recap", excerpt: "120+ participants, 30 teams, and some incredible projects. Here's a complete recap of our flagship hackathon." },
  { title: "Top 5 Projects from This Semester", date: "Apr 30, 2025", category: "Announcement", excerpt: "We highlight the five most impactful projects built by club members this semester." },
  { title: "Getting Started with Open Source — A Beginner's Guide", date: "Apr 15, 2025", category: "Article", excerpt: "Everything you need to know to make your first open-source contribution, from finding issues to submitting PRs." },
  { title: "Why Every Student Should Learn Git", date: "Mar 28, 2025", category: "Article", excerpt: "Version control isn't just for pros. Here's why Git is the most important tool in your developer toolkit." },
  { title: "New Partnership with PrepVerse", date: "Mar 10, 2025", category: "Announcement", excerpt: "We're excited to announce our partnership with PrepVerse, giving members free access to their interview prep platform." },
  { title: "Design Thinking Workshop Highlights", date: "Feb 22, 2025", category: "Event Recap", excerpt: "Our design thinking workshop brought together 40 students to learn human-centered problem solving." },
];

const Blog = () => (
  <PageLayout>
    <section className="section-padding border-b border-border">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Blog</p>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Updates & insights.</h1>
        <p className="text-muted-foreground text-[15px] max-w-md mx-auto">
          Announcements, articles, and event recaps from the TechClub community.
        </p>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-1">
          {posts.map((post, i) => (
            <article key={i} className="border-b border-border py-6 first:pt-0 last:border-0 group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-primary">{post.category}</span>
                <span className="text-[11px] text-muted-foreground">•</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
              </div>
              <h2 className="font-semibold text-lg mb-1.5 group-hover:text-primary transition-colors cursor-pointer">{post.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Blog;
