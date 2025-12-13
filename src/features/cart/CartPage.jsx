import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addToCart, removeFromCart, updateQuantity, clearCart } from './cartSlice';
import axiosInstance from '../../api/axiosInstance'; // add this import
import Appnavbar from '../../components/AppNavbar';
import SiteFooter from '../../components/SiteFooter';

export default function CartPage() {
  const { items, itemCount, subtotal } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [imageMap, setImageMap] = useState({}); // itemId -> image URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleIncrement = (id) => dispatch(addToCart({ id, quantity: 1 }));
  const handleDecrement = (id, quantity) =>
    quantity > 1 ? dispatch(updateQuantity({ id, quantity: quantity - 1 })) : dispatch(removeFromCart(id));
  const handleRemove = (id) => dispatch(removeFromCart(id));
  const handleClear = () => dispatch(clearCart());
  
useEffect(() => {
  let cancelled = false;

  const fetchMissingImages = async () => {
    const missing = items.filter((item) => !imageMap[item.id]);
    if (!missing.length) return;

    await Promise.all(
      missing.map(async (item) => {
        try {
          const { data } = await axiosInstance.get(
            `api/products/${item.id}/`
          );

          let img = data?.image || null;

          // No image at all → frontend placeholder
          if (!img) {
            img = `${BASE}media/product_images/placeholder.jpg`;
          } else {
            const filename = img.split("/").pop().toLowerCase();

            // Detect placeholder coming from backend or dataset
            const isPlaceholder =
              filename.includes("placeholder") ||
              filename.includes("default") ||
              filename === "no-image.jpg";

            if (isPlaceholder) {
              img = `${BASE}media/product_images/placeholder.jpg`;
            } else {
              // Real product image
              img = `${BASE}media/product_images/2025/11/26/${filename}`;
            }
          }

          if (!cancelled) {
            setImageMap((prev) => ({ ...prev, [item.id]: img }));
          }
        } catch (err) {
          console.error("Error fetching product image", err);

          if (!cancelled) {
            setImageMap((prev) => ({
              ...prev,
              [item.id]: `${BASE}media/product_images/placeholder.jpg`,
            }));
          }
        }
      })
    );
  };

  fetchMissingImages();

    fetchMissingImages();
    return () => {
      cancelled = true;
    };
  }, [items, imageMap]);

  const tax = useMemo(() => +(subtotal * 0.08).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);

  const handleCheckout = () => {
    if (!isAuthenticated) return navigate('/login');
    navigate('/checkout');
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-slate-900">Your Cart</h1>
          <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
            <p className="text-sm text-slate-600">Add some items to see them here.</p>
            <Link
              to="/shop"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
        <div className='sticky top-0 z-50'>
            <Appnavbar />
        </div>
    <div className="bg-slate-50 px-4 py-10 flex-grow">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        {/* Items */}
        <div className="flex-1 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-900">Your Cart</h1>
            <button
              onClick={handleClear}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Clear cart
            </button>
          </div>

          <div className="mt-6 divide-y divide-slate-200">
            {items.map((item) => {
               const imgSrc = imageMap[item.id] || 'https://via.placeholder.com/150'
            
            return (
              <div key={item.id} className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-start gap-4">
                    
                    <img
                       src={imgSrc}
                       alt={item.name}
                       className="h-20 w-20 rounded-xl object-contain bg-slate-50"
                     />
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{item.name}</h3>
                    <p className="text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button
                      onClick={() => handleDecrement(item.id, item.quantity)}
                      className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item.id)}
                      className="px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="w-20 text-right text-sm font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        </div>

        {/* Summary */}
        <aside className="w-full rounded-2xl bg-white p-6 shadow-lg lg:w-80">
          <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Items ({itemCount})</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Proceed to Checkout
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Shipping and taxes calculated at checkout.
          </p>
        </aside>
      </div>
    </div>
    <div>
      <SiteFooter />
    </div>
    </div>
  );
}
