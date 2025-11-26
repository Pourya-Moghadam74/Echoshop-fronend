import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import { useState } from 'react';
import LoginPage from '../pages/LoginPage';
import { useSelector } from 'react-redux'; // <-- NEW IMPORT

export default function AppNavbar() {
    // Check authentication status locally
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const [showLogin, setShowLogin] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const handleCartShow = () => setShowCart(true);
    const handleCartClose = () => setShowCart(false);
    const handleCloseLogin = () => setShowLogin(false);
    const handleShowLogin = () => setShowLogin(true);
    const { itemCount, subtotal, items } = useSelector(state => state.cart); 
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
            <Container fluid>
                
                {/* 1. Logo/Brand */}
                <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-warning">
                    E-Commerce Store
                </Navbar.Brand>
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/* 2. Main Navigation Links (Left) */}
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/shop">Shop All</Nav.Link>
                        {/* Optional protected link */}
                        {isAuthenticated && (
                            <Nav.Link as={Link} to="/account">Account</Nav.Link>
                        )}
                    </Nav>
                    
                    {/* 3. Utility/Auth Links (Right, pushed by 'ms-auto') */}
                    {/* This group pushes to the right due to the "me-auto" on the primary Nav above */}
                    <Nav className="d-flex align-items-center">
                        
                        {/* Cart Link (Always visible) */}
                        <Button variant='outline-light' className="mx-2" onClick={handleCartShow}>
                            {/* Placeholder for Cart Icon (e.g., Shopping Cart SVG) */}
                            🛒 Cart ({itemCount}) - ${subtotal.toFixed(2)}
                        </Button>
                        <Offcanvas show={showCart} onHide={handleCartClose} placement="end">
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title>Your Cart</Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className="d-flex flex-column">
                                {items.length === 0 ? (
                                    <div className="text-center text-muted py-5">
                                        <div className="display-6 mb-3">🛒</div>
                                        <h5 className="fw-semibold mb-2">Your cart is empty</h5>
                                        <p className="mb-3">Browse products and add items to your cart.</p>
                                        <Button
                                            variant="dark"
                                            as={Link}
                                            to="/shop"
                                            onClick={handleCartClose}
                                        >
                                            Start Shopping
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <ul className="list-group mb-3">
                                            {items.map(item => (
                                                <li
                                                    key={item.id}
                                                    className="list-group-item border-0 border-bottom d-flex justify-content-between align-items-center px-0"
                                                >
                                                    <div className="flex-grow-1 me-3">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <span className="fw-semibold">{item.name}</span>
                                                            <span className="fw-bold">
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </span>
                                                        </div>
                                                        <div className="text-muted small mt-1">
                                                            Qty:{' '}
                                                            <span className="badge bg-secondary rounded-pill">
                                                                {item.quantity}
                                                            </span>
                                                            <span className="ms-2">x ${item.price.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto border-top pt-3">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <span className="fw-semibold">Subtotal</span>
                                                <span className="fs-5 fw-bold text-success">
                                                    ${subtotal.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="d-grid gap-2">
                                                <Button
                                                    variant="warning"
                                                    as={Link}
                                                    to="/checkout"
                                                    onClick={handleCartClose}
                                                >
                                                    Proceed to Checkout
                                                </Button>
                                                <Button
                                                    variant="outline-secondary"
                                                    as={Link}
                                                    to="/shop"
                                                    onClick={handleCartClose}
                                                >
                                                    Continue Shopping
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Offcanvas.Body>
                        </Offcanvas>

                        {isAuthenticated ? (
                            // Logged-in view
                            <Button variant="outline-danger" as={Link} to="/logout">
                                Log Out
                            </Button>
                        ) : (
                            // Anonymous view
                            <>
                                <Button variant="outline-light" onClick={handleShowLogin} className="me-2">
                                    Log In
                                </Button>
                                <Offcanvas show={showLogin} onHide={isAuthenticated} placement="end">
                                    <Offcanvas.Header closeButton>
                                    {/* <Offcanvas.Title>Log In</Offcanvas.Title> */}
                                    </Offcanvas.Header>
                                    <Offcanvas.Body>
                                    <LoginPage />
                                    </Offcanvas.Body>
                                </Offcanvas>
                                <Button variant="warning" onClick={handleShowLogin}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Nav>
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}