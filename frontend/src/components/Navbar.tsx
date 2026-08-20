import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface StoredUser {
  name?: string;
  username?: string;
  is_admin?: boolean;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const token = localStorage.getItem('token');
  let user: StoredUser | null = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw) user = JSON.parse(raw);
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`hover:text-pink-400 transition-colors ${
        location.pathname === to ? 'text-pink-400 font-semibold' : ''
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-navy-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <Plane className="h-8 w-8 group-hover:text-pink-400 transition-colors" />
          <span className="text-xl font-bold group-hover:text-pink-400 transition-colors">
            CraftMyTravel
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {navLink('/', 'Home')}
          {navLink('/about', 'About Us')}
          {navLink('/support', 'Help & Support')}
          {navLink('/itinerary', 'Itinerary Generator')}
          {user?.is_admin && navLink('/admin', 'Admin')}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {token && user ? (
            <>
              <span className="text-sm text-gray-300">
                Hi, {user.name || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="border border-white/40 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition"
            >
              Login/Sign Up
            </button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 pb-4 flex flex-col space-y-3">
          {navLink('/', 'Home')}
          {navLink('/about', 'About Us')}
          {navLink('/support', 'Help & Support')}
          {navLink('/itinerary', 'Itinerary Generator')}
          {user?.is_admin && navLink('/admin', 'Admin')}
          {token && user ? (
            <button onClick={handleLogout} className="text-left text-pink-400">
              Logout ({user.name || user.username})
            </button>
          ) : (
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/login');
              }}
              className="text-left text-pink-400"
            >
              Login/Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
