import React from 'react';
import { Camera } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xl font-bold tracking-tight"
        >
          <Camera size={28} className="text-teal-400" />
          <span>FaceAuth</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className={`transition-colors hover:text-teal-300 ${
              location.pathname === '/' ? 'text-teal-300 font-medium' : 'text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/verify" 
            className={`transition-colors hover:text-teal-300 ${
              location.pathname === '/verify' ? 'text-teal-300 font-medium' : 'text-white'
            }`}
          >
            Verify
          </Link>
          <Link 
            to="/detect" 
            className={`transition-colors hover:text-teal-300 ${
              location.pathname === '/detect' ? 'text-teal-300 font-medium' : 'text-white'
            }`}
          >
            Detect
          </Link>
        </nav>
        
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
          <button className="p-2 focus:outline-none">
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;