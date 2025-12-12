import AppNavbar from "../../components/AppNavbar"; 
import HeroBanner from './HeroBanner'; 
import FeaturedProductGrid from './FeaturedProductGrid'; 
import CategoryTiles from './CategoryTiles';
import SiteFooter from '../../components/SiteFooter'; 
import ValuePropositionBanner from './ValuePropositionBanner';
import { useSelector } from 'react-redux';

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
            <div className="sticky top-0 z-50 shadow-sm">
                <AppNavbar />
            </div>

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10">
                <HeroBanner />

                <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="absolute -left-12 -top-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl" />
                    <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-slate-200/50 blur-3xl" />
                    <div className="relative space-y-4 px-6 py-6 sm:px-10 sm:py-8">
                        <div className="flex flex-col gap-2 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Discover</p>
                            <h2 className="text-3xl font-semibold text-slate-900">Shop By Category</h2>
                            <p className="text-sm text-slate-600">Jump straight into curated collections tailored for you.</p>
                        </div>
                        <CategoryTiles />
                    </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-sm">
                    <ValuePropositionBanner />
                </section>

                <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="absolute -left-14 -top-14 h-36 w-36 rounded-full bg-blue-100/50 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-44 w-44 rounded-full bg-emerald-100/50 blur-3xl" />
                    <div className="relative space-y-4 px-6 py-6 sm:px-10 sm:py-8">
                        <div className="flex flex-col gap-2 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Fresh picks</p>
                            <h2 className="text-3xl font-semibold text-slate-900">Featured Products</h2>
                            <p className="text-sm text-slate-600">Handpicked bestsellers and new arrivals you will love.</p>
                        </div>
                        <FeaturedProductGrid />
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
