import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center transition-opacity hover:opacity-80 group"
    >
      <span className="text-4xl leading-none filter drop-shadow-md group-hover:scale-110 transition-transform duration-200">
        🍑
      </span>
    </Link>
  );
};

export default Logo;