import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from "../auth/authSlice";
import { clearCart } from "../cart/cartSlice";


const LOGOUT_URL = 'http://localhost:8000/api/token/blacklist/';

export default function LogoutPage() {
  const [statusMessage, setStatusMessage] = useState("Logging out...");
  const refreshToken = useSelector(state => state.auth.refreshToken);
  const cartItems = useSelector(state => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    const performLogout = async () => {
      try {
        if (refreshToken) {
          try {
            await axios.post(
              LOGOUT_URL, 
              { refresh: refreshToken },
              { withCredentials: true } 
            );
          } catch (error) {
            // Handle failure (e.g., server down or token already invalid)
            console.error("Server-side logout failed, performing client-side cleanup.", error);
          }
        }

        // 3. Perform client-side cleanup (always happens)
        dispatch(logout());
        dispatch(clearCart());
      } catch (error) {
        // Ensure cleanup happens even if something fails
        console.error("Error during logout:", error);
        dispatch(logout());
        dispatch(clearCart());
      }
    };

    performLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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