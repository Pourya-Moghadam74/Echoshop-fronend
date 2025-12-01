import React, { useEffect, useState } from "react";
import { fetchUserAddresses } from "../../services/userService";


function AccountProfilePage() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
              async function fetchUser() {
                try {
                  const apiResponse = await fetchUserAddresses(); // Renamed for clarity
                  
                    // 💡 FIX: Extract ONLY the 'results' array from the response object
                  const resultsArray = apiResponse.results; 
                  
                  setUser(resultsArray); // Set the state with just the array of addresses
                } catch (err) {
                  setError("Error fetching data"); // Use a more descriptive error message
                } finally {
                  setLoading(false);
                }
              }
              fetchUser();
            }, []);

  
    return (
        loading ? (
            <div>Loading profile...</div>
        ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
        ) : user ? (
            <div>
                <h2>Profile</h2>
                <pre style={{ background: "#f5f5f5", padding: "1em", borderRadius: "8px" }}>
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        ) : (
            <div>No user data found.</div>
        )
    ); // <-- Closing parenthesis
}

export default AccountProfilePage;
