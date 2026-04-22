import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import MemberManager from "@/components/admin/MemberManager";
import { useAuth } from "@/contexts/AuthContext";

// Wrapper component so we can call useAuth() at the top level
const AdminDirectoryInner = ({ readonly }: { readonly: boolean }) => {
  const { role } = useAuth();
  const canManageRoles = role === "admin" || role === "superadmin";
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <MemberManager readonly={readonly} canManageRoles={canManageRoles} />
      </div>
    </PageLayout>
  );
};

const AdminDirectory = () => (
  <StaffPageWrapper tab="directory">
    {({ readonly }) => <AdminDirectoryInner readonly={readonly} />}
  </StaffPageWrapper>
);

export default AdminDirectory;
