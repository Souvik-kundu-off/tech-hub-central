import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import BroadcastManager from "@/components/admin/BroadcastManager";

const AdminBroadcasts = () => (
  <StaffPageWrapper tab="broadcasts">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <BroadcastManager readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminBroadcasts;
