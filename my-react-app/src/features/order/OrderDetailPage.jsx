import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { getOrderDetails } from "./orderService";

const statusBadge = (status) => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("pending")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (normalized.includes("processing")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (normalized.includes("shipped")) return "bg-indigo-100 text-indigo-700 border-indigo-200";
  if (normalized.includes("delivered")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (normalized.includes("canceled") || normalized.includes("cancelled")) return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetails(id);
        if (active) setOrder(data);
      } catch (err) {
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          "Unable to load this order. Please try again.";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [id, isAuthenticated, navigate]);

  const items = useMemo(() => order?.items || order?.order_items || [], [order]);
  const status = order?.status || order?.order_status || "Pending";
  const total = order?.total_amount || order?.total || order?.amount || 0;
  const subtotal = order?.subtotal || order?.sub_total || order?.items_total || 0;
  const tax = order?.tax_amount || order?.tax || 0;
  const shipping = order?.shipping_cost || order?.shipping || 0;

  const shippingAddress = useMemo(() => {
    if (!order) return null;
    return {
      name: order.shipping_name,
      street: order.shipping_street_address,
      city: order.shipping_city,
      state: order.shipping_state_province,
      postal: order.shipping_postal_code,
      country: order.shipping_country,
      email: order.shipping_email,
      phone: order.shipping_phone_number,
      note: order.shipping_note,
    };
  }, [order]);

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
              Order Detail
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Order #{order?.order_number || id}</h1>
            <p className="text-sm text-slate-200">
              Track your order, review items, and view delivery details.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-10 text-sm text-slate-600 shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span className="ml-3">Loading order...</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && order && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(status)}`}>
                    <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                    {status}
                  </span>
                  {order.order_date && (
                    <span className="text-xs text-slate-500">
                      Placed on {new Date(order.order_date).toLocaleString()}
                    </span>
                  )}
                </div>
                {order.payment_status !== undefined && (
                  <p className="mt-3 text-sm text-slate-600">
                    Payment status: <span className="font-semibold text-slate-900">{String(order.payment_status)}</span>
                  </p>
                )}
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Items</h3>
                <div className="mt-4 divide-y divide-slate-200">
                  {items.length ? (
                    items.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-start justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.product_name || item.name || "Item"}</p>
                          <p className="text-xs text-slate-500">Qty {item.quantity || 1}</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          ${parseFloat(item.total_price || item.line_total || item.price || 0).toFixed(2)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-sm text-slate-600">No items found for this order.</p>
                  )}
                </div>
              </div>

              {shippingAddress && (
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">Shipping</h3>
                  <div className="mt-3 space-y-1 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{shippingAddress.name}</p>
                    <p>{shippingAddress.street}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal}
                    </p>
                    <p>{shippingAddress.country}</p>
                    {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
                    {shippingAddress.email && <p>Email: {shippingAddress.email}</p>}
                    {shippingAddress.note && (
                      <p className="text-slate-600">Note: {shippingAddress.note}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${parseFloat(subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${parseFloat(shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${parseFloat(tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Total</span>
                    <span>${parseFloat(total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="text-sm font-semibold text-slate-800">Need help?</h4>
                <p className="mt-2 text-sm text-slate-600">
                  If you have questions about this order, contact support with your order number.
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900"
                >
                  Contact support
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
