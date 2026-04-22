import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import MaintenancePanel from "@/components/admin/MaintenancePanel";

const AdminSettings = () => (
  <StaffPageWrapper tab="settings">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <MaintenancePanel readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminSettings;
