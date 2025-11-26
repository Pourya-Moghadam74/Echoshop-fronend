import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading } from '../store/authSlice'
import { useSelector } from 'react-redux';
import { loadCart } from '../store/cartSlice';

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
          refresh: response.data.refresh
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
    // <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
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
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </Button>
            <p className="text-center text-muted small mt-3">
              Don't have an account? <a href="/signup">Sign Up Here</a>
            </p>
          </Form>
        </Card.Body>
      </Card>
    // </Container>
  );
};
