import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
// Updated imports based on likely file placement/compilation environment needs
// If files are siblings in src/, we assume direct import works, but using 
// './ProductCard' is better if they are in the same 'components' folder.
// Since the path is failing, we must assume the compiler needs the file extension or a simpler path.
import ProductCard from './ProductCard.jsx'; // Explicitly set JSX extension
import axiosInstance from '../api/axiosInstance.js'; // Assuming api is outside components/

// Fetches 4 featured products from the Django API
const FEATURED_PRODUCTS_URL = 'products/'; 

export default function FeaturedProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Use axiosInstance to fetch data
                const response = await axiosInstance.get(FEATURED_PRODUCTS_URL, {
                    params: { limit: 4, is_featured: true } 
                });
                setProducts(response.data.results || response.data); 
                setError(null);
            } catch (err) {
                console.error("Error fetching featured products:", err);
                setError("Failed to load featured products from the server.");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-5">
                <p>No featured products found right now.</p>
                <Button as={Link} to="/shop" variant="secondary">Go to Shop</Button>
            </div>
        );
    }

    return (
        <div className="py-4">
            <Row xs={1} md={2} lg={4} className="g-4">
                {products.slice(0, 4).map(product => ( // Ensure max of 4 products are shown
                    <Col key={product.id}>
                        <ProductCard 
                            id={product.id}
                            title={product.name}
                            description={product.description}
                            tag={product.tag || product.category.name} // Use tag or category name
                            likes={product.likes || Math.floor(Math.random() * 5000)}
                            price={product.price}
                            imageUrl={product.image}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}