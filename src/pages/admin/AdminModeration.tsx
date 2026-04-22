import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import ProjectModeration from "@/components/admin/ProjectModeration";

const AdminModeration = () => (
  <StaffPageWrapper tab="moderation">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <ProjectModeration readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminModeration;
