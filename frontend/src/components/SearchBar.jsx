import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar Component
 * Redesigned Search input. Features rounded-[16px] curves, 
 * thin light-gray border outlines, and purple focus rings.
 */
const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search by patient ID, name, disease, doctor...',
  className = ''
}) => {
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.8 text-xs text-zinc-800 placeholder-zinc-400 bg-white border border-[#ECECF3] rounded-[16px] focus:outline-hidden focus:border-[#4F7CFF] focus:ring-4 focus:ring-[#4F7CFF]/10 transition-all duration-150"
      />
    </div>
  );
};

export default SearchBar;
