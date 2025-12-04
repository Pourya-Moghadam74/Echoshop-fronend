import AppNavbar from "../../components/AppNavbar"; 
import HeroBanner from './HeroBanner'; 
import FeaturedProductGrid from './FeaturedProductGrid'; 
import CategoryTiles from './CategoryTiles';
import SiteFooter from '../../components/SiteFooter'; 
import ValuePropositionBanner from './ValuePropositionBanner';
import { useSelector } from 'react-redux';

export default function HomePage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    return (
        <div>
            <AppNavbar isAuthenticated/>
            
            <main>
                {/* 2. Hero Section */}
                <HeroBanner />
                
                {/* 3. Featured Categories (e.g., using CategoryTiles) */}
                <div className="container my-5">
                    <h2 className="text-center mb-4">Shop By Category</h2>
                    {/* Placeholder for Category Tiles Component */}
                    <CategoryTiles />
                    {/* Image of e commerce category tile design */}
                </div>

                {/* 4. Value Proposition */}
                <div className="bg-light py-5">
                    <div className="container">
                        {/* Placeholder for Value Proposition Component */}
                        <ValuePropositionBanner />
                    </div>
                </div>

                {/* 5. Featured Products (Connects to /api/products/?is_featured=true) */}
                <div className="container my-5">
                    <h2 className="text-center mb-4">Bestsellers and New Arrivals</h2>
                    {/* Placeholder for Product Grid */}
                    <FeaturedProductGrid />
                    {/* Image of e commerce featured product grid design */}
                </div>
            </main>

            {/* 6. Global Footer (Should be on all pages) */}
            <SiteFooter />
        </div>
    );
}