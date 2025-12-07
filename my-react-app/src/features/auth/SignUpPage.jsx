import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const REGISTER_URL = 'http://localhost:8000/api/register/'; 

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '', first_name: '', last_name: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);

    try {
      if (formData.password !== formData.password2) { throw new Error('Passwords must match.'); }
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v != null)
      );

      await axios.post(REGISTER_URL, dataToSend, { withCredentials: true });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500); // Redirect after success message
      
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const messages = Object.keys(errors).map(key => 
          `${key.charAt(0).toUpperCase() + key.slice(1)}: ${errors[key]}`
        );
        setError(messages.join(' | '));
      } else {
        setError(err.message || 'An unknown error occurred during sign-up.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Create Your Account</h2>
          {success && (<Alert variant="success" className="mb-3">Success! Redirecting to login...</Alert>)}
          {error && (<Alert variant="danger" className="mb-3">Registration failed: {error}</Alert>)}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}><Form.Group controlId="formFirstName"><Form.Label>First Name</Form.Label><Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} /></Form.Group></Col>
              <Col md={6}><Form.Group controlId="formLastName"><Form.Label>Last Name</Form.Label><Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Form.Group className="mb-3" controlId="formUsername"><Form.Label>Username*</Form.Label><Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3" controlId="formEmail"><Form.Label>Email Address*</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-3" controlId="formPassword"><Form.Label>Password*</Form.Label><Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required /></Form.Group>
            <Form.Group className="mb-4" controlId="formPassword2"><Form.Label>Confirm Password*</Form.Label><Form.Control type="password" name="password2" value={formData.password2} onChange={handleChange} required /></Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
            <p className="text-center text-muted small mt-3">
              Already have an account? <a href="/login">Log In Here</a>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};
