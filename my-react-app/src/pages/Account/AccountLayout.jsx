import { Outlet } from "react-router-dom";
import AccountSidebar from "../../components/AccountSidebar";

export default function AccountLayout() {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: 250 }}>
            <AccountSidebar />
      </div>
      <div style={{ flex: 1, padding: "32px" }}>
        <Outlet />
      </div>
    </div>
  );
}