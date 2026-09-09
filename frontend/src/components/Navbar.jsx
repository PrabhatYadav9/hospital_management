import React from 'react';
import { 
  Bell, 
  Menu, 
  Search,
  Building2,
  ChevronDown,
  LogOut
  ,Sun, Moon
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Navbar Component
 * Glassmorphic top bar containing workspace selections, a centered rounded search bar,
 * and user action indicators in desaturated blue.
 */
const Navbar = ({ toggleSidebar, onSearchChange, searchValue }) => {
  const { logout, user } = useAuthContext();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-35 h-16 bg-white/70 backdrop-blur-md border-b border-[#ECECF3]/80 flex items-center justify-between px-6 transition-all duration-200">
      
      {/* Left section: Hamburger (mobile) + Hospital Selector dropdown */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-zinc-50 text-zinc-500 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Hospital Switcher */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#ECECF3] rounded-full hover:border-[#4F7CFF]/30 transition-all cursor-pointer select-none">
          <div className="w-5 h-5 rounded-md bg-[#EDF2FF] flex items-center justify-center text-[#4F7CFF]">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-bold text-zinc-700">
            Hope General Hospital
          </span>
          <ChevronDown className="w-3 h-3 text-zinc-400 ml-1" />
        </div>
      </div>

      {/* Middle section: Centered Pill Search Input */}
      <div className="hidden md:block w-full max-w-sm mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search patients, doctors, records..."
            value={searchValue || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="w-full pl-9.5 pr-12 py-2 text-[11px] text-zinc-800 placeholder-zinc-400 bg-[#FAFAFC] border border-[#ECECF3] rounded-full focus:outline-hidden focus:bg-white focus:border-[#4F7CFF] focus:ring-2 focus:ring-[#4F7CFF]/10 transition-all duration-150"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <kbd className="inline-flex items-center px-1.5 font-mono text-[9px] font-medium text-zinc-400 bg-white border border-[#ECECF3] rounded-md">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Notifications + Avatar + Logout */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-2 text-zinc-500 hover:bg-zinc-50 hover:text-[#4F7CFF] dark:hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-[#ECECF3] dark:hover:border-white/10"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        {/* Bell Alerts Trigger */}
        <button className="relative p-2 text-zinc-500 hover:bg-zinc-50 hover:text-[#4F7CFF] rounded-full transition-colors border border-transparent hover:border-[#ECECF3]">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#4F7CFF] rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150"
            alt={user?.name || 'Admin'}
            className="w-8 h-8 rounded-full object-cover border border-[#ECECF3] ring-2 ring-blue-50/50"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 text-zinc-400 hover:text-[#EF4444] hover:bg-[#FFF0F0] rounded-full transition-colors border border-transparent hover:border-[#EF4444]/15"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
