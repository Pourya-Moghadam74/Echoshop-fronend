import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'
import { useSelector } from 'react-redux';
const LOGOUT_URL = 'http://localhost:8000/api/token/blacklist/';

export default function LogoutPage() {
  const [statusMessage, setStatusMessage] = useState("Logging out...");
  const refreshToken = useSelector(state => state.auth.refreshToken)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {

    // 1. Check for Refresh Token
    if (refreshToken) {
      // 2. Blacklist the Refresh Token on the server
      axios.post(
        LOGOUT_URL, 
        { refresh: refreshToken }, // Send the refresh token to be blacklisted
        { withCredentials: true } 
      )
      .then(() => {
        // Success (even if we get a 200 or 204 from the server)
        dispatch(logout())
      })
      .catch((error) => {
        // Handle failure (e.g., server down or token already invalid)
        console.error("Server-side logout failed, performing client-side cleanup.", error);
        // We proceed with client-side cleanup anyway to ensure the user is logged out locally
        dispatch(logout())
      });
    } else {
      // No refresh token found, just perform client-side cleanup
      dispatch(logout())
    }
  }, [navigate]); // Depend on navigate

  // const performFrontendLogout = () => {
  //   // 3. Client-Side Cleanup (CRITICAL STEP)
  //   localStorage.removeItem('accessToken');
  //   localStorage.removeItem('refreshToken');
    
  // setStatusMessage("You have been successfully logged out.");
    
    // 4. Redirect to a public page (e.g., Home or Login)
  setTimeout(() => {
    navigate('/'); 
  }, 1000);
  // };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-sm p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title>{statusMessage}</Card.Title>
          {statusMessage === "Logging out..." && <Spinner animation="border" className="mt-3" />}
        </Card.Body>
      </Card>
    </Container>
  );
}