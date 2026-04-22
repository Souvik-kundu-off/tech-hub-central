import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import { useAuth } from "@/contexts/AuthContext";

const AdminOverviewInner = () => {
  const { role } = useAuth();
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <AnalyticsPanel role={role ?? undefined} />
      </div>
    </PageLayout>
  );
};

const AdminOverview = () => (
  <StaffPageWrapper tab="overview">
    {() => <AdminOverviewInner />}
  </StaffPageWrapper>
);

export default AdminOverview;
