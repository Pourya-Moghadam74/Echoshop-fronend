import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';

export default function ProductCard({
  id,
  title,
  description,
  tag,
  price,
  likes = 0,
  imageUrl,
}) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        id,
        name: title,
        price: parseFloat(price),
        quantity: 1,
      })
    );
  };

  const displayPrice = price
    ? parseFloat(price).toFixed(2)
    : (Math.random() * 80 + 20).toFixed(2);

  return (
    <Link
      to={`/product/${id}`}
      className="group block h-full rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      style={{ textDecoration: 'none' }}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-slate-50">
          <img
            src={imageUrl || '/placeholder-card.jpg'}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-1 flex-col space-y-2">
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600">{description}</p>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {tag || 'Product'}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc3545"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0c-2.4 2.4-2.4 6.31 0 8.7l8.42 8.42 8.42-8.42c2.4-2.39 2.4-6.3 0-8.7z" />
              </svg>
              {Number(likes || 0).toLocaleString()}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-lg font-semibold text-slate-900">
              ${displayPrice}
            </span>
            <button
              type="button"
              onClick={handleAddToCart}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
