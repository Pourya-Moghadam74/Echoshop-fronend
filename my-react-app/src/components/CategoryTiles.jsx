import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosInstance.js'; // Assuming api is outside components/
import { Link } from 'react-router-dom';

const CATEGORY_URL = 'categories/'; 

export default function CategoryTiles() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(CATEGORY_URL); 
                // Handle different response formats (array, paginated, etc.)
                let categoriesData = [];
                if (Array.isArray(response.data)) {
                    categoriesData = response.data;
                } else if (response.data.results && Array.isArray(response.data.results)) {
                    categoriesData = response.data.results;
                } else if (response.data && typeof response.data === 'object') {
                    // If it's an object, try to extract array values
                    categoriesData = Object.values(response.data).filter(Array.isArray)[0] || [];
                }
                setCategories(categoriesData);
                setError(null);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories.");
                setCategories([]); // Ensure it's always an array
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return <div className="text-center py-4"><Spinner animation="grow" variant="secondary" /></div>;
    }

    if (error) {
        return <Alert variant="warning">{error}</Alert>;
    }

    // Display max 4 categories for the homepage layout
    // Ensure categories is an array before calling slice
    const featuredCategories = Array.isArray(categories) ? categories.slice(0, 4) : []; 

    return (
        <div className="py-4">
            <Row xs={1} sm={2} lg={4} className="g-4">
                {featuredCategories.map(category => ( 
                    <Col key={category.id}>
                        {/* Link the tile to the shop page with the category filter slug */}
                        <Card as={Link} to={`/shop?category=${category.slug}`} 
                              className="category-tile shadow-sm text-center border-0"
                              style={{ textDecoration: 'none', overflow: 'hidden' }}>
                            
                            {/* Placeholder for visual tile background */}
                            <div style={{ height: '120px', 
                                          backgroundColor: '#ddd', 
                                          backgroundImage: `url(/category-${category.id}-bg.jpg)`, // Add images to public/
                                          backgroundSize: 'cover',
                                          display: 'flex',
                                          alignItems: 'flex-end',
                                          justifyContent: 'center' }}>
                                
                                <Card.Title className="text-white fw-bold mb-2 p-2 bg-dark bg-opacity-50 w-100">
                                    {category.name.toUpperCase()}
                                </Card.Title>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Custom style to ensure link colors work inside the card */}
            <style jsx="true">{`
                .category-tile:hover {
                    box-shadow: 0 0 10px rgba(255, 102, 0, 0.5) !important;
                    transform: scale(1.02);
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
}