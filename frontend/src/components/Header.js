import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="nav-warm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 natural-card flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-earth-green" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L19 7.27L14.55 12.09L21 12L13.09 15.74L19 16.73L12 22L5 16.73L10.91 15.74L3 12L9.45 12.09L5 7.27L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span className="text-xl font-medium text-warm heading-handwritten hover:text-earth-green transition-colors duration-300">
              SecondChance
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-warm-secondary hover:text-warm transition-colors duration-300 font-medium">
              Browse Items
            </Link>
            <Link to="/sell" className="btn-earth-primary flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Sell an Item
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 natural-card px-4 py-2">
                  <img
                    src={user.imageUrl || 'https://via.placeholder.com/32'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-green-200"
                  />
                  <span className="hidden sm:block text-sm text-warm font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-earth-secondary text-sm px-4 py-2 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-green-100">
        <div className="px-4 py-4">
          <nav className="flex space-x-6">
            <Link to="/" className="text-warm-secondary hover:text-warm transition-colors font-medium">
              Browse
            </Link>
            <Link to="/sell" className="text-earth-green font-medium">
              Sell Item
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
