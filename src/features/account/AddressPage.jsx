// src/features/account/AddressPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserAddresses, updateUserAddresses } from '../user/userSlice';
import { createUserAddresses } from '../user/userService';

const blankAddress = {
    id: null,
    label: "",
    full_name: "",
    street_address: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "",
  };

export default function AddressPage() {
  const dispatch = useDispatch();
  const { results = [], error } = useSelector((state) => state.user.addresses || {});
  const addresses = results;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(blankAddress);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteHandler = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await dispatch(updateUserAddresses({ id: form.id, delete: true })).unwrap();
      closeDrawer();
    } catch (err) {
      console.error('Delete user info failed', err);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    dispatch(fetchUserAddresses()).catch((err) => console.error('Fetch addresses failed', err));
  }, [dispatch,]);

  const openNew = () => {
    setForm(blankAddress);
    setDrawerOpen(true);
  };

  const openEdit = (addr) => {
    setForm({ ...blankAddress, ...addr });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setForm(blankAddress);
    setConfirmDelete(false);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (form.id == null) {
        await createUserAddresses(form);
        dispatch(fetchUserAddresses());
      } else {
        await dispatch(updateUserAddresses(form)).unwrap();
      }

      dispatch(fetchUserAddresses());
      closeDrawer(); 
    } catch (err) {
      console.error('Save address failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Your Addresses</h1>
            <p className="text-sm text-slate-600">Manage where you receive orders.</p>
          </div>
          <button
            onClick={openNew}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            + Add Address
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
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
                  onClick={() => openEdit(addr)}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                >
                  Edit
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

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200 px-4 py-3 bg-slate-50">
              <h2 className="text-lg font-semibold text-slate-900">
                {form.id ? 'Edit Address' : 'Add Address'}
              </h2>
              <button
                onClick={closeDrawer}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Label</label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Street Address</label>
                <input
                  name="street_address"
                  value={form.street_address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">State</label>
                  <input
                    name="state_province"
                    value={form.state_province}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Postal code</label>
                  <input
                    name="postal_code"
                    value={form.postal_code}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-70"
              >
                {submitting ? 'Saving...' : form.id ? 'Save Changes' : 'Add Address'}
              </button>
              {form.id && <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
                className="w-full rounded-lg bg-[#E84545] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>}
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete this address?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This action cannot be undone. Are you sure you want to remove this address?
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => { setConfirmDelete(false); deleteHandler(e); }}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
