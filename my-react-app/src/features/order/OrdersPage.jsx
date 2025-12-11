import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { getUserOrders } from "./orderService";

const statusBadge = (status) => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("pending")) return "bg-amber-100 text-amber-700 border-amber-200";
  if (normalized.includes("shipped") || normalized.includes("processing")) return "bg-blue-100 text-blue-700 border-blue-200";
  if (normalized.includes("delivered")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (normalized.includes("canceled") || normalized.includes("cancelled")) return "bg-rose-100 text-rose-700 border-rose-200";
  return "bg-slate-100 text-slate-700 border-slate-200";
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const [orders, setOrders] = useState([]);
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
        const data = await getUserOrders();
        // support both array and paginated responses
        const list = Array.isArray(data) ? data : data?.results || [];
        if (active) setOrders(list);
      } catch (err) {
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          "Unable to load your orders. Please try again.";
        if (active) setError(msg);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [isAuthenticated, navigate]);

  const hasOrders = useMemo(() => orders && orders.length > 0, [orders]);

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
              Orders
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Your purchases</h1>
            <p className="text-sm text-slate-200">Track statuses, view totals, and revisit items you love.</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-10 text-sm text-slate-600 shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
            <span className="ml-3">Loading orders...</span>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {!hasOrders && (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">No orders yet</h3>
                <p className="mt-2 text-sm text-slate-600">Start shopping to see your orders here.</p>
                <button
                  onClick={() => navigate("/shop")}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900"
                >
                  Go to shop
                </button>
              </div>
            )}

            {hasOrders && (
              <div className="space-y-4">
                {orders.map((order) => {
                  const items = order.items || order.order_items || [];
                  const total = order.total_amount || order.total || order.amount || 0;
                  const status = order.status || order.order_status || "Pending";
                  const number = order.order_number || order.id;
                  const date = order.order_date || order.created_at || order.date || null;
                  return (
                    <div
                      key={order.id || number}
                      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl" />
                      <div className="relative flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Order #{number}
                          </span>
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(status)}`}>
                            <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                            {status}
                          </span>
                          {date && (
                            <span className="text-xs text-slate-500">
                              {new Date(date).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-700">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Items</p>
                            <p className="font-semibold text-slate-900">{items.length}</p>
                          </div>
                          <div className="h-10 w-px bg-slate-200" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                            <p className="text-lg font-semibold text-slate-900">
                              ${parseFloat(total || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        {!!items.length && (
                          <div className="mt-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                            <div className="divide-y divide-slate-200">
                              {items.map((item, idx) => (
                                <div
                                  key={item.id || `${order.id}-item-${idx}`}
                                  className="flex items-center justify-between text-sm text-slate-700 py-3"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">
                                      {item.product_name_snapshot || item.name || "Item"}
                                    </span>
                                    <span className="text-xs text-slate-500">Qty {item.quantity || 1}</span>
                                  </div>

                                  <span className="font-semibold text-slate-900">
                                    ${parseFloat(item.total_price || item.line_total || item.price || 0).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
