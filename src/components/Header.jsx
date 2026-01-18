
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto flex h-20 items-center px-4">
        <Link 
          to="/" 
          className="flex items-center transition-opacity hover:opacity-80 group"
        >
          <span className="text-4xl leading-none filter drop-shadow-md group-hover:scale-110 transition-transform duration-200">
            🍑
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
