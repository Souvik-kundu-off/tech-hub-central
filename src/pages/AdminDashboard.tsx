import { Navigate } from "react-router-dom";

// Redirect /admin to /admin/overview for backwards compatibility
const AdminDashboard = () => {
  return <Navigate to="/admin" replace />;
};

export default AdminDashboard;
