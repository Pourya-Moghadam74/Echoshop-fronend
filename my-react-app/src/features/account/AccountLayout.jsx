import { Navigate, Outlet } from "react-router-dom";
// import AccountSidebar from "../../components/AccountSidebar";
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
    <div className="sticky top-0 z-50">
      <AppNavbar />   
    </div>
    
    
    <div >
      {/* <div style={{ width: 250 }}>
            <AccountSidebar />
      </div> */}
      <div >
        <Outlet />
      </div>
    </div>
    </>
  );
}