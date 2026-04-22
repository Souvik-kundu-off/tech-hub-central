import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import ReportsPanel from "@/components/admin/ReportsPanel";
import { useAuth } from "@/contexts/AuthContext";

const AdminReportsInner = () => {
  const { role } = useAuth();
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <ReportsPanel role={role ?? undefined} />
      </div>
    </PageLayout>
  );
};

const AdminReports = () => (
  <StaffPageWrapper tab="reports">
    {() => <AdminReportsInner />}
  </StaffPageWrapper>
);

export default AdminReports;
