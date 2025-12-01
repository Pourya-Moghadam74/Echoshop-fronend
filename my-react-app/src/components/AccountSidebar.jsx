import React from "react";
import { FaUser, FaClipboardList, FaLock, FaSignOutAlt, FaHome, FaAddressCard, FaCreditCard, FaHeart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "../../public/css/AccountSidebar.css";

const sidebarItems = [
  {
    label: "Profile",
    icon: <FaUser />,
    to: "/account/profile",
  },
  {
    label: "Orders",
    icon: <FaClipboardList />,
    to: "/account/orders",
  },
  {
    label: "Address",   
    icon: <FaAddressCard />,
    to: "/account/address",
  },
  {
    label: "Payment",
    icon: <FaCreditCard />,
    to: "/account/payment",
  },
  {
    label: "Wishlist",
    icon: <FaHeart />,
    to: "/account/wishlist",
  },
  {
    label: "Logout",
    icon: <FaSignOutAlt />,
    to: "/logout",
  },
];

function AccountSidebar() {
  const location = useLocation();

  return (
    <nav className="nav-menu active" style={{ minWidth: 250, borderRight: "1px solid #eee", background: "#fff" }}>
      <ul className="nav-menu-items" style={{ paddingTop: 32 }}>
        <li style={{ padding: "16px 16px 32px 16px", borderBottom: "1px solid #eee" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "#222", letterSpacing: ".5px" }}>Your Account</h2>
        </li>
        {sidebarItems.map((item) => (
          <li
            key={item.label}
            className="nav-text"
            style={{
              background: location.pathname === item.to ? "#f0f0f0" : "transparent",
              borderLeft: location.pathname === item.to ? "4px solid #0d6efd" : "4px solid transparent",
              transition: "background 0.2s",
            }}
          >
            <Link to={item.to} style={{ display: "flex", alignItems: "center", width: "100%" }}>
              {item.icon}
              <span style={{ marginLeft: 16 }}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default AccountSidebar;
