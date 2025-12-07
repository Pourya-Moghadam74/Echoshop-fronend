import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Form, Button, Alert, Stack } from 'react-bootstrap';
import axios from 'axios';
import { loginSuccess, setLoading } from "../auth/authSlice";
import { useSelector, useDispatch } from 'react-redux';
import { loadCart } from "../cart/cartSlice";

const LOGIN_URL = 'http://localhost:8000/api/token/'; 

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const loading = useSelector((state) => state.auth.loading);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError(null);

    try {
      const response = await axios.post(
        LOGIN_URL, 
        formData, 
        { withCredentials: true }
      );
      try {
        dispatch(loginSuccess({ 
          access: response.data.access,
          refresh: response.data.refresh,
          user: formData.username
         }));
      } catch (e) {
        console.error("Reducer error:", e);
      }

      if (response.status === 200 && response.data.access) {
        // Load cart from backend after successful login
        dispatch(loadCart()).catch((cartError) => {
          console.error("Error loading cart after login:", cartError);
          // Continue with login even if cart loading fails
        });

        navigate('/'); // Redirect to homepage
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Invalid username or password.";
      setError(errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Stack 
      gap={1} 
      className="mx-auto" 
      style={{ maxWidth: '300px', width: '100%' }}
    >
      <div className='m-1'>
        <h2 className="text-center mb-4">Log In</h2>
      </div>
      <div>
          {error && (<Alert variant="danger" className="mb-3">Login failed: {error}</Alert>)}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}
              style={{
                backgroundColor: "#FFD60A",
                color: "#000",
                border: "1px solid #000",
                fontWeight: "450"
              }}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
            <p className="text-center text-muted small mt-3">
              Don't have an account? <a href="/signup">Sign Up Here</a>
            </p>
          </Form>
        </div>
    </Stack>

  );
};
