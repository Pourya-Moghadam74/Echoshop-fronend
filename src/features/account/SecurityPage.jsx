import { useState } from "react";
import { updateUserPassword } from "../auth/authService.js";

const API_BASE = "http://127.0.0.1:8000";
const CHANGE_PASSWORD_ENDPOINT = "/api/auth/password/change/";

const passwordRequirements = (pw) => [
  { label: "8+ characters", met: pw.length >= 8 },
  { label: "Upper & lower case", met: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { label: "Number", met: /\d/.test(pw) },
  { label: "Symbol", met: /[^A-Za-z0-9]/.test(pw) },
];

const strengthFor = (pw) => {
  if (!pw) {
    return {
      label: "Start typing to see strength",
      width: 0,
      color: "bg-slate-200",
      text: "text-slate-500",
    };
  }

  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { label: "Weak", width: 30, color: "bg-rose-500", text: "text-rose-600" };
  if (score === 2) return { label: "Fair", width: 55, color: "bg-amber-500", text: "text-amber-600" };
  if (score === 3) return { label: "Good", width: 75, color: "bg-blue-500", text: "text-blue-600" };
  return { label: "Strong", width: 100, color: "bg-emerald-500", text: "text-emerald-600" };
};

export default function SecurityPage() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const strength = strengthFor(form.newPassword);
  const requirements = passwordRequirements(form.newPassword);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword({
        old_password: form.currentPassword,
        new_password: form.newPassword,
        new_password2: form.confirmPassword
      })
        setStatus({ type: "success", message: "Password updated successfully." });
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
        setStatus({ type: "error", message: err.message });
        console.error('Error updating user password:', error);
        throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-xl">
          <div className="absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 right-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-100">
                <span className="rounded-full bg-white/10 px-3 py-1">Account Security</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-50">JWT Protected</span>
              </div>
              <h1 className="text-3xl font-semibold">Keep your account locked down</h1>
              <p className="text-sm text-slate-200">
                Update your password regularly and stay ahead of unauthorized access.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
              <p className="text-emerald-100">Session status</p>
              <p className="text-lg font-semibold text-white">Authenticated</p>
              <p className="text-xs text-slate-200">Secure token in use</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600">Password</p>
                <h2 className="text-xl font-semibold text-slate-900">Change your password</h2>
                <p className="text-sm text-slate-500">Choose something memorable and unique to you.</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Recommended monthly
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Current password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">New password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                  minLength={8}
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                    <span className="text-slate-500">{strength.width}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${strength.color} transition-all`}
                      style={{ width: `${strength.width}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {requirements.map((req) => (
                      <span
                        key={req.label}
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-semibold ${
                          req.met
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${req.met ? "bg-emerald-500" : "bg-slate-400"}`}
                        />
                        {req.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Confirm new password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                  required
                  minLength={8}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Pro tip: avoid reusing passwords across different sites. Consider a passphrase for better memorability.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-70"
                >
                  {loading ? "Saving..." : "Update password"}
                </button>
              </div>

              {status.type && (
                <div
                  className={`flex items-start gap-3 rounded-xl border px-3 py-3 text-sm ${
                    status.type === "error"
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                      status.type === "error" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {status.type === "error" ? "!" : "OK"}
                  </span>
                  <div className="leading-tight">
                    <p className="font-semibold">
                      {status.type === "error" ? "Update failed" : "Password updated"}
                    </p>
                    <p>{status.message}</p>
                  </div>
                </div>
              )}
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Stay safe online</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-slate-600">
                  Tips
                </span>
              </div>
              <ul className="mt-3 space-y-3 text-sm text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Use a unique password for this account.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Turn on notifications for suspicious sign-ins.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Consider a password manager for strong, memorable phrases.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Security score</h3>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">Live</span>
              </div>
              <p className="mt-2 text-sm text-emerald-50">
                Strength grows as you add length, numbers, and symbols.
              </p>
              <div className="mt-4 h-2 rounded-full bg-white/30">
                <div
                  className="h-2 rounded-full bg-white shadow"
                  style={{ width: `${strength.width}%` }}
                />
              </div>
              <p className="mt-2 text-sm font-semibold">{strength.label || "Start typing a new password"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
