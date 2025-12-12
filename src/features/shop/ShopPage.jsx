import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import AppNavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';
import axiosInstance from '../../api/axiosInstance';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
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

  // NEW: sync state from URL when params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSortBy(searchParams.get('sort') || 'name');
    setSearchQuery(searchParams.get('search') || '');
    const page = searchParams.get('page');
    setCurrentPage(page ? parseInt(page, 10) || 1 : 1);
  }, [searchParams]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('categories/');
        let categoriesData = [];
        if (Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          categoriesData = response.data.results;
        } else if (response.data && typeof response.data === 'object') {
          categoriesData = Object.values(response.data).filter(Array.isArray)[0] || [];
        }
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
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
        const params = {
          page: currentPage,
          page_size: pageSize,
        };

        if (selectedCategory) params.category = selectedCategory;
        if (minPrice) params.price__gte = minPrice;
        if (maxPrice) params.price__lte = maxPrice;
        if (searchQuery) params.search = searchQuery;

        if (sortBy === 'price_asc') params.ordering = 'price';
        else if (sortBy === 'price_desc') params.ordering = '-price';
        else if (sortBy === 'name') params.ordering = 'name';
        else if (sortBy === 'newest') params.ordering = '-created_at';

        const response = await axiosInstance.get('products/', { params });

        if (response.data && response.data.results) {
          setProducts(response.data.results);
          setTotalCount(response.data.count || 0);
          setTotalPages(Math.ceil((response.data.count || 0) / pageSize));
        } else if (Array.isArray(response.data)) {
          setProducts(response.data);
          setTotalCount(response.data.length);
          setTotalPages(Math.ceil(response.data.length / pageSize));
        } else {
          setProducts([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        const errorMessage =
          err.response?.data?.detail ||
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

  // Handlers
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePriceFilter = () => {
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    setSortBy('name');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className='sticky top-0 z-50'>
        <AppNavbar />
      </div>
      
      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="rounded-t-xl border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
                  <h5 className="text-base font-semibold">Filters</h5>
                </div>
                <div className="p-4 space-y-5">
                  {/* Search */}
                  <form onSubmit={handleSearch} className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Search Products</label>
                    <div className="flex rounded-lg border border-slate-200 shadow-sm focus-within:border-slate-400">
                      <input
                        type="text"
                        className="w-full rounded-l-lg px-3 py-2 text-sm text-slate-900 outline-none"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="rounded-r-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                      >
                        🔍
                      </button>
                    </div>
                  </form>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                    >
                      <option value="">All Categories</option>
                      {Array.isArray(categories) &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Price Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={handlePriceFilter}
                        min="0"
                        step="0.01"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={handlePriceFilter}
                        min="0"
                        step="0.01"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3 space-y-4">
              {/* Header with Sort and Results Count */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Shop All Products</h2>
                  {!loading && (
                    <p className="text-sm text-slate-500">
                      Showing {products.length} of {totalCount} products
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-56">
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white py-10 text-sm text-slate-600 shadow-sm">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                  <p className="mt-3">Loading products...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Products Grid */}
              {!loading && !error && (
                <>
                  {products.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
                      <h5 className="text-lg font-semibold text-slate-900">No products found</h5>
                      <p className="text-sm text-slate-600">Try adjusting your filters or search query.</p>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                      >
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                          let imageUrl = product.image || null;
                          if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                            imageUrl = `${API_BASE}${imageUrl}`;
                          }

                          return (
                            <div key={product.id} className="h-full">
                              <ProductCard
                                id={product.id}
                                title={product.name || 'Untitled Product'}
                                description={product.description || ''}
                                tag={product.category?.name || 'Product'}
                                price={product.price || 0}
                                imageUrl={imageUrl}
                                likes={0}
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                              const page = index + 1;
                              if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                              ) {
                                const active = currentPage === page;
                                return (
                                  <button
                                    key={page}
                                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                                      active
                                        ? 'bg-slate-900 text-white'
                                        : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                    onClick={() => handlePageChange(page)}
                                  >
                                    {page}
                                  </button>
                                );
                              } else if (page === currentPage - 2 || page === currentPage + 2) {
                                return (
                                  <span key={page} className="px-2 text-slate-400">
                                    …
                                  </span>
                                );
                              }
                              return null;
                            })}

                            <button
                              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>
        </div >
      </div>
      <SiteFooter />  
    </div>
);
}
