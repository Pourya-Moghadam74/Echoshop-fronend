import AppNavbar from "../../components/AppNavbar"; 
import HeroBanner from './HeroBanner'; 
import FeaturedProductGrid from './FeaturedProductGrid'; 
import CategoryTiles from './CategoryTiles';
import SiteFooter from '../../components/SiteFooter'; 
import ValuePropositionBanner from './ValuePropositionBanner';
import { useSelector } from 'react-redux';

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen font-serif bg-gray-200">

            <div>
                <AppNavbar />
            </div>

            <div className="w-[1024px] mx-auto bg-gray-100">
                <div>
                    <HeroBanner />
                </div>
                
                <div className="flex flex-col">
                    <h2 className="text-3xl mt-5 font-bold text-center">
                        Shop By Category
                    </h2>
                    <CategoryTiles />
                </div>

                <div className="bg-gray-500">
                    <ValuePropositionBanner />
                </div>

                <div>
                    <h2 className="text-3xl mt-5 font-bold text-center">
                        Featured Products
                    </h2>   
                    <FeaturedProductGrid />
                </div>
            </div>

            <div>
                <SiteFooter />
            </div>
    
        </div>
    );
}
