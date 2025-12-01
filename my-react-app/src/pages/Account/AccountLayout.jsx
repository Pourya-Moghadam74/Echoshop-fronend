import { Outlet } from "react-router-dom";
import AccountSidebar from "../../components/AccountSidebar";
import AppNavbar from "../../components/AppNavbar";

export default function AccountLayout() {
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