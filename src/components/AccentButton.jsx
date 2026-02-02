import React from 'react';

const AccentButton = ({ children, onClick, type = "button", className = "" }) => (
  <button 
    type={type}
    onClick={onClick}
    className={`w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.4)] ${className}`}
  >
    {children}
  </button>
);

export default AccentButton;
