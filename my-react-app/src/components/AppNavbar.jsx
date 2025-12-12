import { Search, ShoppingCart, MapPin, ChevronDown, Menu, User, Repeat2, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../features/category/categorySlice';
import LoginPage from '../features/auth/LoginPage.jsx';
import { useCartSync } from '../hooks/useCartSync.js';
import { useAddressesSync } from '../hooks/useAddressesSync.js';
import { useUserInfoSync } from '../hooks/useUserInfoSync.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.categories);
  const { items, itemCount } = useSelector((state) => state.cart);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAccount, setShowAccount] = useState(false);
  const addresses = useSelector((state) => state.user.addresses?.results || []);
  const userInfoState = useSelector((state) => state.user.userInfo )
  
  const addressInfo = addresses[0] || {
    full_name: "Guest",
    street_address: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "",
  };
  
  const openAccount = () => setShowAccount(true);
  const handleAccountClick = () => {
    if (isAuthenticated) {
      navigate('/logout')
    } else {
      navigate('/login');
    }
  };
  useCartSync();
  useUserInfoSync();
  useAddressesSync();
  const closeAccount = () => setShowAccount(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // const {}

  useEffect(() => {
    if (!categories.length && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, loading]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = searchTerm.trim();
    if (trimmed) params.set('search', trimmed);
    if (selectedCategory) params.set('category', selectedCategory); // category id
    navigate(`/shop?${params.toString()}`);
  };

  const NavLink = ({ topText, bottomText, icon: Icon, isDropdown = false }) => (
    <div
      className={`group flex flex-col justify-center h-full p-2 text-white border border-transparent hover:border-white cursor-pointer ${
        bottomText === 'Cart' ? 'flex-row items-end' : ''
      }`}
    >
      {Icon && bottomText === 'Cart' ? (
        <>
        <button onClick={() => {navigate('/cart')}}>
          <div className="relative">
            
            <Icon size={30} strokeWidth={1.5} />
            <span className="absolute -top-1 left-4 w-4 h-4 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center text-black">
              {itemCount === undefined ? 0 : itemCount}
            </span>
            
          </div>
          <span className="ml-1 text-base font-bold whitespace-nowrap">Cart</span>
          </button>
        </>
      ) : (
        <>
          <span className="text-xs leading-3 whitespace-nowrap">{topText}</span>
          <span className="font-bold text-sm whitespace-nowrap flex items-center">
            {bottomText} {isDropdown && <ChevronDown size={14} className="ml-0.5" />}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex flex-col w-full">
        {showAccount && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeAccount}
            aria-hidden="true"
          />
          {/* Drawer */}
          <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-2xl transform transition translate-x-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-[#124b45]">
              <h3 className="text-lg font-semibold text-white">Account</h3>
              <button
                onClick={closeAccount}
                className="rounded-md px-2 py-1 text-sm font-medium text-white hover:bg-green-100 hover:text-black transition"
              >
                Close
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-4">
              <LoginPage onSuccess={closeAccount}/> 
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#124b45] flex justify-between gap-2 items-center h-[60px] px-2 text-white font-inter shadow-md">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center">
        <div className="flex items-center h-full border border-transparent p-1 mr-2 hover:border-slate-50 cursor-pointer">
          <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="white">
            <rect x="0" y="0" width="100" height="30" fill="none" />
            <text x="50" y="20" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">
              ECO SHOP
            </text>
            <text x="50" y="28" fontSize="6" fontWeight="normal" fill="white" textAnchor="middle">
              Marketplace
            </text>
          </svg>
        </div>
        </button>

        {/* Deliver To */}
        {( userInfoState !== null ) && (
          <div className="hidden lg:flex items-center gap-0.5">
            <div className="flex">
              <MapPin size={18} />
            </div>
            <div className="flex flex-col leading-none">
              <p className="text-xs">Deliver to</p>
              <p className="font-bold text-sm">{addressInfo.city} {addressInfo.postal_code}</p>
            </div> 
          </div>
        )}
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-grow h-[40px] hidden md:flex mx-2">
          <div className="relative group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-200 text-gray-800 text-sm h-full rounded-l-md border-r border-gray-400 focus:outline-none px-2 cursor-pointer hover:bg-gray-300 transition duration-150"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${selectedCategory ? 'category' : 'all'} on EcoShop`}
            className="flex-grow h-full bg-gray-200 p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#ff6f7e] focus:border-transparent text-base"
          />

          <button
            type="submit"
            className="bg-[#ff6f7e] hover:bg-[#ff8591] text-black h-full w-12 rounded-r-md flex items-center justify-center transition duration-150"
          >
            <Search size={24} strokeWidth={2.5} />
          </button>
        </form>

        {/* Right Links */}
        <div className="flex items-center space-x-2 ml-auto flex-grow justify-evenly sm:flex-grow-0">
          {/* <div className="hidden md:flex items-center h-full border border-transparent hover:border-white cursor-pointer p-1">
            <span className="text-sm font-bold mr-1">🇨🇦</span>
            <span className="text-sm font-bold">EN</span>
            <ChevronDown size={14} className="ml-0.5" />
          </div> */}

          {/* <NavLink topText="Hello, Sign In" bottomText="Account & Lists" icon={User} isDropdown /> */}
        <button
          onClick={handleAccountClick}
          className="group flex flex-col justify-center h-full p-2 text-white border border-transparent hover:border-white cursor-pointer"
        >
          <span className="text-xs leading-3 whitespace-nowrap">Hello {userInfoState === null ? "Guest" : userInfoState.first_name}</span>
          <span className="font-bold text-sm whitespace-nowrap flex items-center">
            {isAuthenticated ? "Sing Out" : "Sign In"} <ChevronDown size={14} className="ml-0.5" />
          </span>
        </button>

        <button onClick={() => {
          isAuthenticated ? navigate('/account') : navigate('/login')
        }}>
          <div className="hidden lg:block">
            <NavLink topText="Account" bottomText="& Orders" icon={Repeat2} />
          </div>
        </button>
          <NavLink topText="" bottomText="Cart" icon={ShoppingCart} />

          <button className="md:hidden p-2 text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0f3d3b] gap-3 h-8 flex items-center text-white px-2 text-sm space-x-4 overflow-x-auto whitespace-nowrap font-inter shadow-md">
        <Menu size={20} className="mr-1 cursor-pointer hover:text-gray-300" />
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">
          All
        </a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">
          Prime
        </a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">
          Today&apos;s Deals
        </a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">
          Customer Service
        </a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1 hidden sm:inline">
          Registry
        </a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1 hidden sm:inline">
          Gift Cards
        </a>
      </div>
    </div>
  );
};

export default Navbar;
