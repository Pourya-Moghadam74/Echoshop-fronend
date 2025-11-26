import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
    return (
        <footer className="bg-dark text-white-50 mt-5 pt-5 pb-3">
            <Container>
                <Row className="g-4">
                    
                    {/* Column 1: Brand Info */}
                    <Col md={4}>
                        <h5 className="text-white fw-bold mb-3">E-Commerce Store</h5>
                        <p className="small">
                            The platform for creators, designers, and innovators. <br/>
                            Built with Django & React.
                        </p>
                        <p className="small">
                            &copy; {new Date().getFullYear()} All rights reserved.
                        </p>
                    </Col>

                    {/* Column 2: Quick Links */}
                    <Col md={3}>
                        <h5 className="text-white mb-3">Shop</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/shop" className="text-white-50 p-0 mb-1">All Products</Nav.Link>
                            <Nav.Link as={Link} to="/categories" className="text-white-50 p-0 mb-1">Categories</Nav.Link>
                            <Nav.Link as={Link} to="/cart" className="text-white-50 p-0 mb-1">Your Cart</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Column 3: Customer Service */}
                    <Col md={3}>
                        <h5 className="text-white mb-3">Support</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/account" className="text-white-50 p-0 mb-1">My Account</Nav.Link>
                            <Nav.Link as={Link} to="/contact" className="text-white-50 p-0 mb-1">Contact Us</Nav.Link>
                            <Nav.Link as={Link} to="/faq" className="text-white-50 p-0 mb-1">FAQ</Nav.Link>
                        </Nav>
                    </Col>

                    {/* Column 4: Legal */}
                    <Col md={2}>
                        <h5 className="text-white mb-3">Legal</h5>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/terms" className="text-white-50 p-0 mb-1">Terms of Use</Nav.Link>
                            <Nav.Link as={Link} to="/privacy" className="text-white-50 p-0 mb-1">Privacy Policy</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}