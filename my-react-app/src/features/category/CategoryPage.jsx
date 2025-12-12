import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../../components/AppNavbar";
import SiteFooter from "../../components/SiteFooter";
import { fetchCategories as fetchCategoriesApi } from "./categoryService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchCategoriesApi();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          "Unable to load categories. Please try again.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleExplore = (id) => {
    navigate(`/shop?category=${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex flex-col">
      <div className="sticky top-0 z-50">
        <AppNavbar />
      </div>
      
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-10 flex-grow">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
          <div className="absolute -left-12 -top-14 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Shop by category
            </p>
            <h1 className="text-3xl font-semibold leading-tight">Find your next favorite</h1>
            <p className="max-w-3xl text-sm text-slate-200">
              Explore curated collections across electronics, lifestyle, and more. Jump straight into the products that
              match what you love.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
              Loading categories...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, idx) => (
              <div
                key={cat.id || cat.slug || idx}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/60 blur-2xl transition group-hover:bg-emerald-200/70" />
                <div className="relative space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {cat.slug || "category"}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{cat.name}</h3>
                  <p className="text-sm text-slate-600">
                    Discover curated picks in {cat.name}. Tap below to browse all items in this category.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleExplore(cat.id)}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-slate-800 hover:to-slate-900"
                    >
                      Explore {cat.name}
                    </button>
                    <Link
                      to={`/shop?category=${cat.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      View products
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {!categories.length && (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600 shadow-sm">
                No categories available right now. Please check back later.
              </div>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
