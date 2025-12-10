import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: null, message: "", resetUrl: null });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "", resetUrl: null });
    setLoading(true);

    try {
      const res = await axiosInstance.post("auth/password/forgot/", { email });
      setStatus({
        type: "success",
        message: res.data?.detail || "If an account exists, a reset link is below.",
        resetUrl: res.data?.reset_url || null,
      });
      setEmail("");
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "We could not generate a reset link. Try again.";
      setStatus({ type: "error", message, resetUrl: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Account recovery
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Forgot your password?</h1>
            <p className="text-sm text-slate-200">
              Enter the email associated with your account and we will generate a secure reset link instantly. No waiting
              on email delivery.
            </p>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Secure, time-limited tokens are created for each request.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Use the link below to set a new password right away.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Keep your account safe: choose a strong, unique password.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-semibold text-slate-600">Reset access</p>
            <h2 className="text-2xl font-semibold text-slate-900">Send reset link</h2>
            <p className="text-sm text-slate-500">We will generate a one-time link for you to set a new password.</p>
          </div>

          {status.type && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              <p className="font-semibold">
                {status.type === "success" ? "Link ready" : "Request failed"}
              </p>
              <p>{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-70"
            >
              {loading ? "Generating link..." : "Send reset link"}
            </button>
          </form>

          {status.resetUrl && (
            <div className="mt-6 space-y-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-800">
              <p className="text-sm font-semibold text-slate-900">Your reset link</p>
              <p className="break-words text-xs text-slate-600">{status.resetUrl}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-white px-3 py-1 font-semibold">Expires per token policy</span>
                <span className="rounded-full bg-white px-3 py-1 font-semibold">One-time use</span>
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-600">
            Remembered your password?{" "}
            <a href="/login" className="font-semibold text-slate-900 hover:underline">
              Go back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
