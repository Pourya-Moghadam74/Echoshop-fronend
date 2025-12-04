import { Navigate, Outlet } from "react-router-dom";
import AccountSidebar from "../../components/AccountSidebar";
import AppNavbar from "../../components/AppNavbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AccountLayout() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <AppNavbar />
    
    <div style={{ display: "flex" }}>
      
      <div style={{ width: 250 }}>
            <AccountSidebar />
      </div>
      <div style={{ flex: 1, padding: "32px" }}>
        <Outlet />
      </div>
    </div>
    </>
  );
}