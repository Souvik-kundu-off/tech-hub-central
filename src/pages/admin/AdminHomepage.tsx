import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import HomepageEditor from "@/components/admin/HomepageEditor";

// Homepage Editor is restricted to settings tab — only admin/superadmin have settings access
const AdminHomepage = () => (
  <StaffPageWrapper tab="settings">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <HomepageEditor readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminHomepage;
