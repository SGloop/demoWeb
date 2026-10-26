import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.totalItems());
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_e) {}
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Demo<span className="text-blue-600">Web</span>
        </Link>

        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Catalog</Link>
          <Link to="/?category=electronics" className="hover:text-blue-600 transition-colors">Electronics</Link>
          <Link to="/?category=apparel" className="hover:text-blue-600 transition-colors">Apparel</Link>
          <Link to="/?category=home-living" className="hover:text-blue-600 transition-colors">Home & Living</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-700 font-medium">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 text-sm font-medium">
              <Link to="/login" className="text-gray-700 hover:text-blue-600">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
