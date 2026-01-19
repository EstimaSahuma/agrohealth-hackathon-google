
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <i className="fa-solid fa-leaf text-emerald-600 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">AgroLens AI</h1>
            <p className="text-xs text-emerald-100 font-medium">Digital Plant Health Assistant</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs">Powered by Gemini 3</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
