import PageLayout from "@/components/PageLayout";
import { FileText, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

const TermsOfService = () => {
  return (
    <PageLayout>
      <section className="py-8 sm:py-10 border-b border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs text-primary bg-primary/10 mb-4 font-semibold">
            <FileText size={14} /> Official Terms
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Last updated: September 2026 · Department of CSE-AI, Brainware University
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-8 text-sm leading-relaxed text-muted-foreground">
          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or submitting content to the CSE-AI Student Hub, you agree to comply with these Terms & Conditions and all applicable academic integrity policies of Brainware University.
            </p>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> 2. Student Submissions & Code Ownership
            </h2>
            <p>
              Students retain full intellectual property rights to their original code, designs, and project submissions. By submitting projects to the Hub:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              <li>You represent that the project is your original work or properly attributes third-party open-source libraries.</li>
              <li>You grant the CSE-AI Student Hub a non-exclusive license to display your project in the public departmental showcase.</li>
              <li>All project submissions undergo admin moderation before public display to ensure quality and compliance.</li>
            </ul>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> 3. Code of Conduct
            </h2>
            <p>
              Members must maintain respectful, professional conduct in all interactions, comments, project reviews, and event participation. Plagiarism, malicious code, unauthorized access attempts, or abusive behavior will result in account suspension and escalation to department coordinators.
            </p>
          </div>

          <div className="border border-border/80 bg-card/60 rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> 4. Contact & Administration
            </h2>
            <div className="bg-accent/40 rounded-lg p-4 text-xs space-y-1 border border-border">
              <p className="font-semibold text-foreground">Souvik Kundu — Lead Developer & President, AI & TECH CLUB</p>
              <p>Department of CSE-AI, UB-5, Room 103, Brainware University</p>
              <p>Contact Email: <a href="mailto:souvikkundu7880@gmail.com" className="text-primary hover:underline font-medium">souvikkundu7880@gmail.com</a></p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TermsOfService;
