import { useSelector } from "react-redux";

function AccountPage() {
  const userName = useSelector(state => state.auth.user);
  
  return (
    <div>
        <h2>Hi {userName}!</h2>
        <p>Welcome to your account dashboard. Please select an option from the sidebar.</p>
    </div>
  );
}

export default AccountPage;