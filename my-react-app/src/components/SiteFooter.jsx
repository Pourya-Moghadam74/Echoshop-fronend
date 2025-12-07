import React from 'react';
import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="mt-8 bg-[#0f3d3b] py-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h5 className="text-lg font-semibold text-white">E-Commerce Store</h5>
            <p className="mt-3 text-sm text-slate-400">
              The platform for creators, designers, and innovators.
              <br />
              Built with Django & React.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div>
            <h5 className="text-base font-semibold text-white">Shop</h5>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="hover:text-white" to="/shop">All Products</Link>
              <Link className="hover:text-white" to="/categories">Categories</Link>
              <Link className="hover:text-white" to="/cart">Your Cart</Link>
            </nav>
          </div>

          <div>
            <h5 className="text-base font-semibold text-white">Support</h5>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="hover:text-white" to="/account">My Account</Link>
              <Link className="hover:text-white" to="/contact">Contact Us</Link>
              <Link className="hover:text-white" to="/faq">FAQ</Link>
            </nav>
          </div>

          <div>
            <h5 className="text-base font-semibold text-white">Legal</h5>
            <nav className="mt-3 flex flex-col gap-2 text-sm">
              <Link className="hover:text-white" to="/terms">Terms of Use</Link>
              <Link className="hover:text-white" to="/privacy">Privacy Policy</Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
