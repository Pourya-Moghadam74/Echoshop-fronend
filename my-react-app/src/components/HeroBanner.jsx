import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function HeroBanner() {
    return (
        // Use a div with background styling for a dramatic full-width effect
        <div 
            className="text-white d-flex align-items-center justify-content-center text-center"
            style={{
                // Example background image (Ensure this image exists in your public folder!)
                backgroundImage: 'url(/hero-background.jpg)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '65vh', // Sets the height to 65% of the viewport height
                position: 'relative',
                boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.45)', // Dark overlay for text readability
            }}
        >
            <Container style={{ zIndex: 1 }}>
                
                {/* Main Headline */}
                <h1 className="display-3 fw-bolder mb-3 text-shadow">
                    Discover What's Possible with 3D Printing
                </h1>
                
                {/* Subtext */}
                <p className="lead fs-5 mb-4 text-shadow" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    Join our community of creators and explore the world's most innovative 
                    library of user-submitted models, tools, and accessories.
                </p>
                
                {/* Call-to-Action Button */}
                <Button 
                    as={Link} 
                    to="/shop" 
                    variant="warning" 
                    size="lg" 
                    className="mt-3 py-3 px-5 fw-bold"
                >
                    SHOP ALL COLLECTIONS
                </Button>
                
            </Container>
            
            {/* Optional style for text readability against the background */}
            <style jsx="true">{`
                .text-shadow {
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
                }
            `}</style>
        </div>
    );
}