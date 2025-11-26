import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PROPS = [
    { 
        title: "Free Shipping", 
        detail: "On all orders over $75.", 
        icon: "🚚" 
    },
    { 
        title: "Secure Payments", 
        detail: "All transactions are 100% encrypted.", 
        icon: "💳" 
    },
    { 
        title: "Dedicated Support", 
        detail: "24/7 assistance for all your inquiries.", 
        icon: "📞" 
    },
    { 
        title: "Money-Back Guarantee", 
        detail: "30-day refund policy.", 
        icon: "💰" 
    },
];

export default function ValuePropositionBanner() {
  return (
    <div className="bg-light py-5">
        <Container>
            <Row className="g-4">
                {PROPS.map((prop, index) => (
                    <Col key={index} xs={12} md={6} lg={3}>
                        <Card className="h-100 text-center border-0 shadow-sm p-3">
                            <Card.Body>
                                <span className="d-block fs-1 mb-2">{prop.icon}</span>
                                <Card.Title className="fw-bold">{prop.title}</Card.Title>
                                <Card.Text className="text-muted small">{prop.detail}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    </div>
  );
}