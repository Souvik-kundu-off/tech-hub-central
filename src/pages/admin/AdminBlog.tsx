import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import BlogManager from "@/components/admin/BlogManager";

const AdminBlog = () => (
  <StaffPageWrapper tab="blog">
    {({ readonly }) => (
      <PageLayout>
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <BlogManager readonly={readonly} />
        </div>
      </PageLayout>
    )}
  </StaffPageWrapper>
);

export default AdminBlog;
