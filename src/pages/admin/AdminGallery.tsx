import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import GalleryManager from "@/components/admin/GalleryManager";

const AdminGallery = () => (
  <StaffPageWrapper tab="resources">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <GalleryManager readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminGallery;
