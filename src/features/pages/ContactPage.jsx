import { useState } from "react";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Thanks for reaching out. We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
          <div className="absolute -left-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              We are here to help
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Contact Us</h1>
            <p className="max-w-3xl text-sm text-slate-200">
              Questions about products, orders, or partnerships? Send us a note and our team will respond quickly.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-600">Message our team</p>
              <p className="text-sm text-slate-500">We typically reply within one business day.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Your full name"
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Tell us how we can help"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900"
            >
              Send message
            </button>
            {status && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {status}
              </div>
            )}
          </form>

          <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Visit or reach us</h3>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Customer Care</p>
              <p className="text-sm text-slate-600">support@store.com</p>
              <p className="text-sm text-slate-600">+1 (800) 555-0123</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Showroom</p>
              <p className="text-sm text-slate-600">123 Market Street, Suite 400</p>
              <p className="text-sm text-slate-600">San Francisco, CA</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Hours</p>
              <p className="text-sm text-slate-600">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-sm text-slate-600">Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
