import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // <-- NEW IMPORT
import { addToCart } from '../store/cartSlice';

export default function ProductCard({ id, title, description, tag, price, likes, imageUrl }) {
    const dispatch = useDispatch(); // Hook to get the dispatcher
    const handleAddToCart = (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        
        // Dispatch the action with the payload (matching the reducer structure)
        dispatch(
            addToCart({ 
                id: id, 
                name: title, 
                price: parseFloat(price), 
                quantity: 1 
            })
        );
    };
    // Fallback to a random price if none is provided (for mock data)
    const displayPrice = price ? parseFloat(price).toFixed(2) : (Math.random() * 80 + 20).toFixed(2);

    return (
        // Link the entire card to the product detail page (PDP). Assuming the route is /product/id
        <Card as={Link} to={`/product/${id}`} className="product-card border-0 shadow-sm h-100" style={{ textDecoration: 'none', color: 'inherit' }}>
            
            {/* Product Image */}
            <Card.Img 
                variant="top" 
                src={imageUrl || "/placeholder-card.jpg"} // Ensure placeholder-card.jpg exists in public/
                alt={title} 
                style={{ height: '180px', objectFit: 'cover' }}
            />
            
            <Card.Body className="d-flex flex-column">
                
                {/* Title and Description */}
                <Card.Title className="fw-bold mb-1 text-truncate">{title}</Card.Title>
                <Card.Text className="text-muted small mb-2" style={{ minHeight: '30px' }}>
                    {description}
                </Card.Text>

                {/* Price and Add to Cart Section */}
                <div className="mt-auto">
                    
                    {/* Tags and Likes Row */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        {/* Tag */}
                        <Badge bg="light" text="secondary" className="product-tag border border-secondary fw-normal px-2">
                            {tag || "Product"}
                        </Badge>
                        
                        {/* Likes/Heart Icon (Inline SVG) */}
                        <span className="text-muted small d-flex align-items-center">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="14" 
                                height="14" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#dc3545" // Red color for the heart outline
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="me-1" 
                                style={{ minWidth: '14px', marginRight: '4px' }}
                            >
                                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0c-2.4 2.4-2.4 6.31 0 8.7l8.42 8.42 8.42-8.42c2.4-2.39 2.4-6.3 0-8.7z"></path>
                            </svg>
                            {likes.toLocaleString()}
                        </span>
                    </div>

                    {/* Price and Button */}
                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="fw-bolder fs-5 text-dark">
                            ${displayPrice}
                        </span>
                        
                        <Button variant="primary" size="sm" onClick={handleAddToCart}>
                            + Add
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}