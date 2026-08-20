import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Mail size={20} />
            <span>CraftMyTravel@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={20} />
            <span>JSSATE Noida</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone size={20} />
            <span>9999945799</span>
          </div>
          <Link to="/support" className="hover:text-blue-300">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
