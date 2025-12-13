import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard.jsx';
import axiosInstance from '../../api/axiosInstance.js';

const FEATURED_PRODUCTS_URL = 'api/products/';

export default function FeaturedProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get(FEATURED_PRODUCTS_URL, {
          params: { limit: 4, is_featured: true },
        });
        setProducts(response.data.results || response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  
  if (loading) {
    return (
      <div className="flex justify-center py-8 text-sm text-slate-600">
        Loading featured products…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-slate-200 bg-white px-6 py-8 text-center">
        <p className="text-sm text-slate-700">No featured products found right now.</p>
        <Link
          to="/shop"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 mb-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
            let imageUrl = product.image || null;
            if (imageUrl) {
              // Always map to frontend images when running on GitHub Pages
              const filename = imageUrl.split('/').pop(); // "11.jpg"

            // Point GitHub Pages to its own repo
            imageUrl = `${import.meta.env.BASE_URL}media/product_images/2025/11/26/${imageUrl}`;
          }

          return (
            <div key={product.id} className="h-[360px] w-[220px]">
              <ProductCard
                id={product.id}
                title={product.name}
                description={product.description}
                tag={product.tag || product.category?.name}
                likes={product.likes || Math.floor(Math.random() * 5000)}
                price={product.price}
                imageUrl={imageUrl}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
