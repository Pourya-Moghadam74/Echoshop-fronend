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

                <section className="relative overflow-hidden">
                    <div className="relative space-y-4 px-6 py-6 sm:px-10 sm:py-8 ">
                        <div className="flex flex-col gap-2 text-center">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Discover</p>
                            <h2 className="text-3xl font-semibold text-slate-900">Shop By Category</h2>
                            <p className="text-sm text-slate-600">Jump straight into curated collections tailored for you.</p>
                        </div>
                        <CategoryTiles />
                    </div>
                </section>

                <section >
                    <ValuePropositionBanner />
                </section>

                <section className="relative overflow-hidden">
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
