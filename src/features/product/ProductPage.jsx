import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { fetchProductById } from "./productService";
import { addToCart } from "../cart/cartSlice";

export default function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        if (!active) return;
        setProduct(data);
      } catch (err) {
        if (!active) return;
        const msg =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Unable to load this product.";
        setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id]);
 
  const imageUrl = useMemo(() => {
    const BASE = import.meta.env.BASE_URL;
    const PLACEHOLDER = `${BASE}media/product_images/2025/11/25/placeholder.jpg`;

    if (!product?.image) return PLACEHOLDER;

    // Extract filename only
    const filename = product.image.split("/").pop()?.toLowerCase();

    // Backend placeholder or invalid image
    if (
      !filename ||
      filename.includes("placeholder") ||
      filename.includes("default") ||
      filename.includes("no-image")
    ) {
      return PLACEHOLDER;
    }

    // Always load from frontend repo
    return `${BASE}media/product_images/2025/11/26/${filename}`;
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price || 0),
        quantity: 1,
      })
    );
  };

  const renderAttributes = () => {
    const attrs = product?.attributes || [];
    if (!attrs.length) return null;
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur">
        <h4 className="text-sm font-semibold text-slate-800">Details</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {attrs.map((attr, idx) => (
            <div key={`${attr.name || "attr"}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{attr.name}</p>
              <p className="text-sm text-slate-800">{attr.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        {loading && (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Loading product...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && product && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="absolute -left-10 -top-14 h-44 w-44 rounded-full bg-slate-200/40 blur-3xl" />
              <div className="absolute -right-14 -bottom-16 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />
              <div className="relative flex min-h-[420px] items-center justify-center bg-white from-slate-900 via-slate-800 to-slate-900 p-6">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="max-h-[360px] w-full max-w-full rounded-2xl object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  {product.category?.name || "Product"}
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
                <p className="text-sm text-slate-500">SKU: {product.sku || "N/A"}</p>
              </div>

              <p className="text-base leading-relaxed text-slate-700">{product.description}</p>

              <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-50 px-4 py-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                  <p className="text-3xl font-semibold text-slate-900">${parseFloat(product.price || 0).toFixed(2)}</p>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Availability</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-60"
                >
                  {product.stock > 0 ? "Add to cart" : "Out of stock"}
                </button>
                <button
                  type="button"
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
                >
                  Save for later
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Returns</p>
                  <p className="text-sm text-slate-700">30-day returns. Free pickup available.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Shipping</p>
                  <p className="text-sm text-slate-700">Fast shipping within 2-4 business days.</p>
                </div>
              </div>

              {renderAttributes()}
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
