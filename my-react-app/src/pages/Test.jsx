import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance'; // Use the protected instance
import { Card, Spinner } from 'react-bootstrap';

export default function TestAuth() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Example: Fetching the user's details (requires authentication)
        // We use the 'customers' API which is protected by default
        const fetchProtectedData = async () => {
            try {
                // The interceptor automatically attaches the access token here
                const response = await axiosInstance.get('addresses/'); // Hypothetical protected endpoint
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching protected data:", error);
                // If token expired, the interceptor should handle the refresh/logout
                setUserData({ detail: "Failed to load data. Log in again." });
            } finally {
                setLoading(false);
            }
        };
        fetchProtectedData();
    }, []);

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <Card className="mt-4">
            <Card.Body>
                <Card.Title>Protected Endpoint Test</Card.Title>
                <pre>{JSON.stringify(userData, null, 2)}</pre>
                <p>
                <a href="/login">Login</a> | <a href="/signup">Sign Up</a>
                </p>
            </Card.Body>
        </Card>
    );
}