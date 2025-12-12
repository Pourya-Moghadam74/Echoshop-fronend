import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";

export default function TermsPage() {
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
              Terms of Use
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Our Terms and Conditions</h1>
            <p className="max-w-3xl text-sm text-slate-200">
              Please read these terms carefully. By using our site and services, you agree to follow them.
            </p>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">1. Use of the site</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              You may browse, purchase products, and create an account subject to these terms. Do not misuse the platform
              or attempt unauthorized access.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">2. Accounts and security</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Keep your credentials safe and notify us of any unauthorized use. We may suspend accounts for suspected
              misuse or security reasons.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">3. Orders and payments</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              Orders are subject to availability and confirmation. Prices may change. You are responsible for providing
              accurate payment details at checkout.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">4. Returns and refunds</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We offer 30-day returns for most items if they are unused and in original condition. Certain products may
              be final sale where noted.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">5. Limitation of liability</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              To the fullest extent permitted by law, we are not liable for indirect damages or loss of data arising from
              use of the site or services.
            </p>
          </section>
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">6. Changes to terms</h2>
            <p className="text-sm leading-relaxed text-slate-700">
              We may update these terms. Continued use of the site after changes means you accept the revised terms.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
