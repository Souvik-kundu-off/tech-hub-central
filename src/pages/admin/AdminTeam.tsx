import StaffPageWrapper from "@/components/auth/StaffPageWrapper";
import PageLayout from "@/components/PageLayout";
import TeamManager from "@/components/admin/TeamManager";
import { useAuth } from "@/contexts/AuthContext";

const AdminTeamInner = ({ readonly }: { readonly: boolean }) => {
  const { role } = useAuth();
  const canManageTeam = role === "admin" || role === "superadmin";
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <TeamManager readonly={readonly} canManageTeam={canManageTeam} />
      </div>
    </PageLayout>
  );
};

const AdminTeam = () => (
  <StaffPageWrapper tab="directory">
    {({ readonly }) => <AdminTeamInner readonly={readonly} />}
  </StaffPageWrapper>
);

export default AdminTeam;
