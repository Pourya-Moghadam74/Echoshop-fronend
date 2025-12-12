import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../user/userSlice'
import { getUserOrders } from '../order/orderService'

export default function AccountPage() {
  const userAddress = useSelector((state) => state.user.addresses?.results || []);
  const userInfo = useSelector((state) => state.user.userInfo) || {};
  const dispatch = useDispatch();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({
    first_name: userInfo.first_name || '',
    last_name: userInfo.last_name || '',
    email: userInfo.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // const orders = [
  //   { id: 'A123', date: '2025-01-04', total: 128.4, status: 'Shipped' },
  //   { id: 'A122', date: '2024-12-12', total: 89.9, status: 'Delivered' },
  // ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data.results);
      } catch (err) {
        setError("Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);
  const openDrawer = () => {
    setForm({
      first_name: userInfo.first_name || '',
      last_name: userInfo.last_name || '',
      email: userInfo.email || '',
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dispatch(updateUserInfo(form)).unwrap(); // ensure this thunk exists
      closeDrawer();
    } catch (err) {
      console.error('Update user info failed', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-grow bg-slate-50 px-4 py-8 relative">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                {userInfo.first_name || ''} {userInfo.last_name || ''}
              </h1>
              <p className="text-sm text-slate-600">Member since {new Date(userInfo.date_joined).toLocaleDateString()}</p>
              <p className="text-sm text-slate-600">{userInfo.email || ''}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openDrawer}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Edit Profile
              </button>
              <Link
                to="/logout"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link className="rounded-2xl bg-white p-4 shadow-sm hover:shadow" to="/orders">
            <p className="text-sm text-slate-500">Orders</p>
            <p className="text-lg font-semibold text-slate-900">View & track</p>
          </Link>
          <Link className="rounded-2xl bg-white p-4 shadow-sm hover:shadow" to="/account/addresses">
            <p className="text-sm text-slate-500">Addresses</p>
            <p className="text-lg font-semibold text-slate-900">Manage shipping</p>
          </Link>
          <Link className="rounded-2xl bg-white p-4 shadow-sm hover:shadow" to="/account/security">
            <p className="text-sm text-slate-500">Security</p>
            <p className="text-lg font-semibold text-slate-900">Password & sign-in</p>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Addresses */}
          <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Addresses</h2>
              <Link to="/account/addresses" className="text-sm font-semibold text-slate-700 hover:underline">
                Manage
              </Link>
            </div>
            <div className="mt-4 space-y-4">
              {userAddress.map((addr) => (
                <div key={addr.id} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-slate-900">{addr.label}</p>
                  <p className="text-sm text-slate-600">{addr.street_address}</p>
                  <p className="text-sm text-slate-600">
                    {addr.city} {addr.state_province} {addr.postal_code}, {addr.country}
                  </p>
                </div>
              ))}
              {!userAddress.length && (
                <p className="text-sm text-slate-500">No addresses yet. Add one to speed up checkout.</p>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
              <Link to="/orders" className="text-sm font-semibold text-slate-700 hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-4 divide-y divide-slate-200">
              {orders.map((order) => (
                <div key={order.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Order #{order.id}</p>
                    <p className="text-xs text-slate-500">Placed {order.date}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-slate-900">${order.total_amount}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {order.status}
                    </span>
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-sm font-semibold text-slate-700 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
              {!orders.length && (
                <p className="py-3 text-sm text-slate-500">You haven’t placed any orders yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
          <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-900">Edit Profile</h2>
              <button
                onClick={closeDrawer}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">First Name</label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Last Name</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
