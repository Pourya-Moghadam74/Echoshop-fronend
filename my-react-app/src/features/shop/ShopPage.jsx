import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import axiosInstance from '../../api/axiosInstance';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) || 1 : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('categories/');
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
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]); // Ensure it's always an array
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters/sort/page change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = {
          page: currentPage,
          page_size: pageSize,
        };

        // Add filters
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        if (minPrice) {
          params.price__gte = minPrice;
        }
        if (maxPrice) {
          params.price__lte = maxPrice;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }

        // Add ordering
        if (sortBy === 'price_asc') {
          params.ordering = 'price';
        } else if (sortBy === 'price_desc') {
          params.ordering = '-price';
        } else if (sortBy === 'name') {
          params.ordering = 'name';
        } else if (sortBy === 'newest') {
          params.ordering = '-created_at';
        }

        const response = await axiosInstance.get('products/', { params });
        
        // Handle paginated response (DRF pagination format)
        if (response.data && response.data.results) {
          setProducts(response.data.results);
          setTotalCount(response.data.count || 0);
          setTotalPages(Math.ceil((response.data.count || 0) / pageSize));
        } else if (Array.isArray(response.data)) {
          // Handle non-paginated response (array)
          setProducts(response.data);
          setTotalCount(response.data.length);
          setTotalPages(Math.ceil(response.data.length / pageSize));
        } else {
          // Fallback for unexpected format
          setProducts([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        const errorMessage = err.response?.data?.detail || 
                           err.response?.data?.message || 
                           err.message || 
                           'Failed to load products. Please try again later.';
        setError(errorMessage);
        setProducts([]);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, minPrice, maxPrice, sortBy, searchQuery, currentPage]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sort', sortBy);
    if (searchQuery) params.set('search', searchQuery);
    if (currentPage > 1) params.set('page', currentPage);
    
    setSearchParams(params, { replace: true });
  }, [selectedCategory, minPrice, maxPrice, sortBy, searchQuery, currentPage, setSearchParams]);

  // Handle filter changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handlePriceFilter = () => {
    setCurrentPage(1); // Reset to first page
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('name');
    setCurrentPage(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <AppNavbar />
      <Container fluid className="py-4">
      <Row>
        {/* Sidebar Filters */}
        <Col md={3} className="mb-4">
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-dark text-white">
              <h5 className="mb-0">Filters</h5>
            </Card.Header>
            <Card.Body>
              {/* Search */}
              <Form onSubmit={handleSearch} className="mb-4">
                <Form.Label className="fw-semibold">Search Products</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline-secondary" type="submit">
                    🔍
                  </Button>
                </InputGroup>
              </Form>

              {/* Category Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">All Categories</option>
                  {Array.isArray(categories) && categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Price Range Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Price Range</Form.Label>
                <Row className="g-2">
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      onBlur={handlePriceFilter}
                      min="0"
                      step="0.01"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      onBlur={handlePriceFilter}
                      min="0"
                      step="0.01"
                    />
                  </Col>
                </Row>
              </Form.Group>

              {/* Clear Filters */}
              <Button variant="outline-danger" onClick={clearFilters} className="w-100">
                Clear All Filters
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          {/* Header with Sort and Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Shop All Products</h2>
              {!loading && (
                <p className="text-muted mb-0">
                  Showing {products.length} of {totalCount} products
                </p>
              )}
            </div>
            <Form.Group style={{ minWidth: '200px' }}>
              <Form.Select value={sortBy} onChange={handleSortChange}>
                <option value="name">Sort by Name</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </Form.Select>
            </Form.Group>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-muted">Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <Alert variant="info" className="text-center py-5">
                  <h5>No products found</h5>
                  <p className="mb-0">Try adjusting your filters or search query.</p>
                  <Button variant="primary" onClick={clearFilters} className="mt-3">
                    Clear Filters
                  </Button>
                </Alert>
              ) : (
                <>
                  <Row xs={1} sm={2} lg={3} className="g-4 mb-4">
                    {products.map(product => {
                      // Handle image URL - if it's a relative path, prepend the backend URL
                      let imageUrl = product.image || null;
                      if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                        imageUrl = `http://localhost:8000${imageUrl}`;
                      }
                      
                      return (
                        <Col key={product.id}>
                          <ProductCard
                            id={product.id}
                            title={product.name || 'Untitled Product'}
                            description={product.description || ''}
                            tag={product.category?.name || 'Product'}
                            price={product.price || 0}
                            imageUrl={imageUrl}
                            likes={0} // Add likes if available in backend
                          />
                        </Col>
                      );
                    })}
                  </Row>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center">
                      <nav>
                        <ul className="pagination">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>
                          </li>
                          
                          {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <li
                                  key={page}
                                  className={`page-item ${currentPage === page ? 'active' : ''}`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </button>
                                </li>
                              );
                            } else if (
                              page === currentPage - 2 ||
                              page === currentPage + 2
                            ) {
                              return (
                                <li key={page} className="page-item disabled">
                                  <span className="page-link">...</span>
                                </li>
                              );
                            }
                            return null;
                          })}
                          
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Col>
      </Row>
      </Container>
      <SiteFooter />
    </div>
  );
}

