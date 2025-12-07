import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, ChevronDown, Menu, User, Repeat2 } from 'lucide-react';

// Main component, designed to mimic the key elements and layout of the Amazon navbar
const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All', 'Electronics', 'Books', 'Home & Kitchen', 'Toys & Games', 'Software'
  ];

  // Helper component for the smaller, two-line link structure (like "Account & Lists")
  const NavLink = ({ topText, bottomText, icon: Icon, isDropdown = false }) => (
    <div 
      className={`group flex flex-col justify-center h-full p-2 text-white border border-transparent hover:border-white cursor-pointer ${bottomText === 'Cart' ? 'flex-row items-end' : ''}`}
    >
      {Icon && bottomText === 'Cart' ? (
        <>
          <div className="relative">
            <Icon size={30} strokeWidth={1.5} />
            <span className="absolute -top-1 left-4 w-4 h-4 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center text-black">
              0
            </span>
          </div>
          <span className="ml-1 text-base font-bold whitespace-nowrap">Cart</span>
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
      {/* Top Navbar Section (Main Navigation) */}
      <div className="bg-[#124b45] flex justify-between gap-2 items-center h-[60px] px-2 text-white font-inter shadow-md">
        
        {/* 1. Logo and Home Link */}
        <div className="flex items-center h-full border border-transparent p-1 mr-2">
          {/* Custom SVG Logo to replicate the look */}
          <svg className="h-6 w-auto" viewBox="0 0 100 30" fill="white" xmlns="my-react-app\public\logo.png">
            <rect x="0" y="0" width="100" height="30" fill="none"/>
            <text x="50" y="20" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">
              ECO SHOP
            </text>
            <text x="50" y="28" fontSize="6" fontWeight="normal" fill="white" textAnchor="middle">
              Marketplace
            </text>
          </svg>
        </div>

        {/* 2. Deliver To Location (Hidden on small screens) */}
        <div className="hidden lg:flex items-center gap-0.5">
            <div className='flex'>
                <MapPin size={18} />    
            </div>
            <div className="flex flex-col leading-none">
                <p className="text-xs">Deliver to</p>
                <p className="font-bold text-sm">Toronto M4Y</p>
            </div>
        </div>

        {/* 3. Search Bar (Takes most of the horizontal space) */}
        <div className="flex-grow h-[40px] hidden md:flex mx-2">
          
          {/* Category Dropdown */}
          <div className="relative group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-200 text-gray-800 text-sm h-full rounded-l-md border-r border-gray-400 focus:outline-none px-2 cursor-pointer hover:bg-gray-300 transition duration-150"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${selectedCategory} on EcoShop`}
            className="flex-grow h-full bg-gray-200 p-2 text-black focus:outline-none focus:ring-2 focus:ring-[#ff6f7e] focus:border-transparent text-base"
          />

          {/* Search Button */}
          <button
            className="bg-[#ff6f7e] hover:bg-[#ff8591] text-black h-full w-12 rounded-r-md flex items-center justify-center transition duration-150"
            onClick={() => console.log(`Searching for: ${searchTerm} in ${selectedCategory}`)}
          >
            <Search size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* 4. Right-Side Links */}
        <div className="flex items-center space-x-2 ml-auto flex-grow justify-evenly sm:flex-grow-0">
          
          {/* Language Selector (Hidden on small screens) */}
          <div className="hidden md:flex items-center h-full border border-transparent hover:border-white cursor-pointer p-1">
            {/* Flag Placeholder - Use a small icon or text here */}
            <span className="text-sm font-bold mr-1">🇨🇦</span>
            <span className="text-sm font-bold">EN</span>
            <ChevronDown size={14} className="ml-0.5" />
          </div>

          {/* Account & Lists */}
          <NavLink
            topText="Hello, Sign In"
            bottomText="Account & Lists"
            icon={User}
            isDropdown={true}
          />

          {/* Returns & Orders (Hidden on small screens) */}
          <div className="hidden lg:block">
            <NavLink
              topText="Returns"
              bottomText="& Orders"
              icon={Repeat2}
            />
          </div>

          {/* Shopping Cart */}
          <NavLink
            topText="" // Top text is usually hidden or small for cart
            bottomText="Cart"
            icon={ShoppingCart}
          />

          {/* Mobile Search/Menu Button (Shown on small screens) */}
          <button className="md:hidden p-2 text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Bottom Bar Section (For category links or quick access, often green/teal in Amazon) */}
      <div className="bg-[#0f3d3b] gap-3 h-8 flex items-center text-white px-2 text-sm space-x-4 overflow-x-auto whitespace-nowrap font-inter shadow-md">
        <Menu size={20} className="mr-1 cursor-pointer hover:text-gray-300" />
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">All</a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">Prime</a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">Today's Deals</a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1">Customer Service</a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1 hidden sm:inline">Registry</a>
        <a href="#" className="border border-transparent hover:border-white cursor-pointer p-1 hidden sm:inline">Gift Cards</a>
      </div>
    </div>
  );
};

export default Navbar;