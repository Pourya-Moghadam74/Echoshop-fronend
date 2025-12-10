import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders typically ship within 1-2 business days. Delivery usually takes 2-4 business days after dispatch.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. We offer 30-day returns on most items as long as they are unused and in original packaging.",
  },
  {
    q: "Do you ship internationally?",
    a: "We currently ship within the US. International shipping is coming soon.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, we send a tracking link by email and you can also view it in your account under Orders.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept major credit/debit cards and secure wallet options at checkout.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <AppNavbar />
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
          <div className="absolute -left-12 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              FAQ
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Frequently Asked Questions</h1>
            <p className="max-w-3xl text-sm text-slate-200">
              Quick answers to common questions. If you need anything else, reach out via our contact page.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-4">
            {faqs.map((item, idx) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 transition hover:border-slate-200"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{item.q}</p>
                    <p className="text-sm text-slate-600">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
