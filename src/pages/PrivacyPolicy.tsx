import PageLayout from "@/components/PageLayout";
import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <section className="py-8 sm:py-10 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-primary bg-primary/10 mb-4 font-semibold">
            <ShieldCheck size={14} /> Official Policy
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Last updated: September 2026 · Department of CSE-AI, Brainware University
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" /> 1. Information We Collect
            </h2>
            <p>
              The CSE-AI Student Hub collects information that you provide directly to us when registering an account, submitting software projects, registering for department events, or contacting department officers.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li><strong className="text-foreground">Account & Profile Information:</strong> Name, student email address, department roll number, batch, and optional social/GitHub handles.</li>
              <li><strong className="text-foreground">Submitted Content:</strong> Project titles, descriptions, repository links, demo URLs, screenshots, and event registration details.</li>
              <li><strong className="text-foreground">Inquiries:</strong> Messages and contact information submitted via our contact forms.</li>
            </ul>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> 2. How We Use Your Data
            </h2>
            <p>
              We use the collected information solely for department administration, student verification, project moderation, event logistics, and participation credit tracking.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>Verifying active student enrollment in the Department of CSE-AI.</li>
              <li>Displaying approved student projects in the public showcase directory.</li>
              <li>Managing event registrations, study jams, and hackathon rosters.</li>
              <li>Tracking participation points for department leaderboards.</li>
            </ul>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" /> 3. Data Protection & Security
            </h2>
            <p>
              We implement industry-standard security measures, including role-based access control (RLS), encrypted authentication sessions, and secure HTTPS transport. Your credentials are never shared with third parties or used for commercial marketing.
            </p>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> 4. Contact Information
            </h2>
            <p>
              For any questions regarding this Privacy Policy or to request account/data updates, please reach out to:
            </p>
            <div className="bg-accent/40 rounded-lg p-4 text-xs space-y-1 border border-border">
              <p className="font-semibold text-foreground">Souvik Kundu — Lead Developer & President, AI & TECH CLUB</p>
              <p>Department of CSE-AI, UB-5, Room 103, Brainware University</p>
              <p>Email: <a href="mailto:souvikkundu7880@gmail.com" className="text-primary hover:underline font-medium">souvikkundu7880@gmail.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicy;
