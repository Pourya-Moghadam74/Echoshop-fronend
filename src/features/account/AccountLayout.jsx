import { Navigate, Outlet } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import { useSelector } from "react-redux";
import Sitefooter from "../../components/Sitefooter";

export default function AccountLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <AppNavbar />
      </div>

      <div className="flex-1">
        <Outlet />
      </div>

      <Sitefooter />
    </div>
  );
}