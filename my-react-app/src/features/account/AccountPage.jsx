import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AccountPage() {
  // replace with selectors/queries
  const userAddress = useSelector((state) =>  state.user.addresses.results)
  const userInfo = useSelector((state) =>  state.user.userInfo)
  const orders = [
    { id: 'A123', date: '2025-01-04', total: 128.4, status: 'Shipped' },
    { id: 'A122', date: '2024-12-12', total: 89.9, status: 'Delivered' },
  ];

  return (
    <div className="flex-grow bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-2xl font-semibold text-slate-900">{userInfo.first_name} {userInfo.last_name}</h1>
              {/* <p className="text-sm text-slate-600">{user.email} · Member since {user.memberSince}</p> */}
            </div>
            <div className="flex gap-2">
              <Link
                to="/account/profile"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
              >
                Edit Profile
              </Link>
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
                  <p className="text-sm font-semibold text-slate-900">Home</p>
                  <p className="text-sm text-slate-600">Primary</p>
                  <p className="text-sm text-slate-600">
                    {addr.street_address}, {addr.city} {addr.state_province} {addr.postal_code}, {addr.country}
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
                    <span className="font-semibold text-slate-900">${order.total.toFixed(2)}</span>
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
    </div>
  );
}
