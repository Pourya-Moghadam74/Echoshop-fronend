import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
          <div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Privacy
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Privacy Policy</h1>
            <p className="max-w-3xl text-sm text-slate-200">
              We respect your data. Learn how we collect, use, and protect information when you use our services.
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">1. Data we collect</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We collect information you provide (account details, orders, support messages) and technical data (device,
              browser, usage analytics) to operate and improve the site.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">2. How we use data</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We use data to fulfill orders, provide support, personalize content, and enhance security. We do not sell
              your personal information.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">3. Sharing</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We may share data with payment processors, shipping providers, or analytics tools under strict agreements.
              We require partners to protect your data.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">4. Cookies and tracking</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We use cookies to keep you signed in, remember preferences, and measure performance. You can manage cookies
              in your browser settings.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">5. Your choices</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              You can access or update your account info, request deletion where allowed, and opt out of marketing
              emails via account settings.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">6. Security</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We use encryption in transit, token-based auth, and role-based access. No system is perfect, so please use
              a strong, unique password.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
