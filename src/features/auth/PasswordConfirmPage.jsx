import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const strengthFor = (pw) => {
  if (!pw) return { label: "Start typing", width: 0, color: "bg-slate-200", text: "text-slate-500" };
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

export default function PasswordConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const presetUid = location.state?.uid || searchParams.get("uid") || "";
  const presetToken = location.state?.token || searchParams.get("token") || "";
  const presetEmail = location.state?.email || "";

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
    uid: presetUid,
    token: presetToken,
    email: presetEmail,
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => strengthFor(form.newPassword), [form.newPassword]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setStatus({ type: null, message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.uid || !form.token) {
      setStatus({ type: "error", message: "Reset link is missing. Request a new one." });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("api/auth/password/reset/", {
        uid: form.uid,
        token: form.token,
        new_password: form.newPassword,
        new_password2: form.confirmPassword,
      });
      setStatus({ type: "success", message: "Password has been reset. Redirecting to login..." });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.token ||
        err.response?.data?.uid ||
        err.response?.data?.new_password ||
        err.response?.data?.error ||
        "Reset failed. Please request a new link.";
      setStatus({ type: "error", message: Array.isArray(msg) ? msg.join(" ") : msg });
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
              Secure reset
            </div>
            <h1 className="text-3xl font-semibold leading-tight">Choose a new password</h1>
            <p className="text-sm text-slate-200">
              Your token is ready. Set a strong password to regain access to your account.
            </p>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Passwords should be unique to this account.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Longer passphrases are easier to remember and harder to guess.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Tokens expire after a short time—finish the reset now.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 space-y-1">
            <p className="text-sm font-semibold text-slate-600">Finalize reset</p>
            <h2 className="text-2xl font-semibold text-slate-900">Set your new password</h2>
            <p className="text-sm text-slate-500">
              We have your reset token. Enter and confirm your new password to complete the process.
            </p>
          </div>

          {status.type && (
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              <p className="font-semibold">{status.type === "success" ? "Success" : "There was a problem"}</p>
              <p>{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="••••••••"
              />
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${strength.text}`}>{strength.label}</span>
                <span className="text-slate-500">{strength.width}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div className={`h-2 rounded-full ${strength.color} transition-all`} style={{ width: `${strength.width}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm new password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900 disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Have the wrong email or token?{" "}
            <a href="/forgot-password" className="font-semibold text-slate-900 hover:underline">
              Request a new link
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
