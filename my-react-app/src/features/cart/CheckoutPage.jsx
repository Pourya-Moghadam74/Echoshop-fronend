import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { fetchProductById } from "../product/productService";
import { checkoutOrder } from "../order/orderService";

export default function CheckoutPage() {
  const { items, subtotal } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [imageMap, setImageMap] = useState({}); // itemId -> image URL
  const navigate = useNavigate();
  const results = useSelector((state) => state.user.addresses || {});
  const addresses = results.results
  const blankAddress = {
    id: null,
    label: "",
    full_name: "",
    company_name: "",
    apartment_unit: "",
    street_address: "",
    city: "",
    email: "",
    note: "",
    state_province: "",
    postal_code: "",
    country: "",
  };
  const [form, setForm] = useState(blankAddress);
  const [placing, setPlacing] = useState(false);
  const tax = useMemo(() => +(subtotal * 0.13).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);
  const selectAddress = (addr) => {
    setForm({ ...blankAddress, ...addr });
  };

  useEffect(() => {
    let cancelled = false;

    const fetchMissingImages = async () => {
      const missing = items.filter((item) => !imageMap[item.id]);
      if (!missing.length) return;

      await Promise.all(
        missing.map(async (item) => {
          try {
            const  data  = await fetchProductById(item.id);
            const img =
              data?.image ||
              data?.images?.[0]?.url ||
              null;

            if (!cancelled && img) {
              setImageMap((prev) => ({ ...prev, [item.id]: img }));
            }
          } catch (err) {
            // If fetch fails, just skip; item will fall back to placeholder
            console.error('Error fetching product image', err);
          }
        })
      );
    };

    fetchMissingImages();
    return () => {
      cancelled = true;
    };
  }, [items, imageMap]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // 1. Prepare items list for backend
    const formattedItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      attribute: item.attribute || null, 
    }));

    // 2. Prepare payload matching OrderCreateSerializer
    const payload = {
      shipping_name: form.full_name,
      shipping_street_address: form.street_address,
      shipping_city: form.city,
      shipping_state_province: form.state_province,
      shipping_country: form.country || "Canada",
      shipping_postal_code: form.postal_code,
      shipping_note: form.notes || "",
      shipping_phone_number: form.phone,
      shipping_email: form.email,

      items: formattedItems,

      subtotal: subtotal.toFixed(2),
      shipping_cost: "0.00", // free shipping? or calculate dynamically
      tax_amount: tax.toFixed(2),
      total_amount: total.toFixed(2),
    };

    try {
      setPlacing(true);

      const response = await checkoutOrder(payload);

      navigate("/account");
    } catch (error) {
      console.error("Order creation failed:", error);
    } finally {
      setPlacing(false);
    }
  };

  const displayItems = items || [];


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-14 bottom-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative flex flex-col gap-3">
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Secure Checkout
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Complete your order</h1>
            <p className="text-sm text-slate-200">
              Confirm your details, choose delivery, and review your items before placing the order.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={handlePlaceOrder} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-700">Contact & Delivery</p>
              <p className="text-sm text-slate-500">We use these details to confirm your order and ship your items.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Alex Johnson"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="San Francisco"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-700">Street address</label>
                <input
                  name="address"
                  value={form.street_address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="123 Market Street, Apt 4B"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">State</label>
                <input
                  name="state"
                  value={form.state_province}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="CA"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Postal code</label>
                <input
                  name="postal"
                  value={form.postal_code}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="94103"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Order notes (optional)</label>
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  placeholder="Delivery instructions, gate code, etc."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Payment</p>
              <p className="text-sm text-slate-700">
                Payments are securely processed. You will confirm and pay on the next step after reviewing your order.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">All data is transmitted securely over TLS.</p>
              <button
                type="submit"
                disabled={!displayItems.length || placing}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-60"
              >
                {placing ? "Processing..." : "Place order"}
              </button>
            </div>
          </form>
          {/* To choose from user's addresses */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="pb-2 pl-2">You can choose from your saved addresses.</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {addresses.map((addr) => (
              <div key={addr.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{addr.label || 'Address'}</p>
                    <p className="text-sm text-slate-700">{addr.street_address}</p>
                    <p className="text-sm text-slate-700">
                      {addr.city}, {addr.state_province}, {addr.country} {addr.postal_code}
                    </p>
                  </div>
                  <button
                    onClick={() => selectAddress(addr)}
                    className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
            {!addresses.length && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                No addresses yet. Add one to speed up checkout.
              </div>
            )}
          </div>
        </div>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Order Summary</h3>
              <div className="mt-4 divide-y divide-slate-200">
              {displayItems.length ? (
                displayItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 py-3">
                    <div className="flex items-center gap-3">

                      {/* IMAGE CONTAINER */}
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                        <img
                          src={imageMap[item.id]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* ITEM TEXT */}
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                      </div>
                    </div>

                    {/* PRICE */}
                    <p className="text-sm font-semibold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="py-4 text-sm text-slate-600">No items in cart.</p>
              )}

              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="text-sm font-semibold text-slate-800">Delivery confidence</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Free returns within 30 days.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Track your order in real time.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Secure checkout with token-based auth.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
