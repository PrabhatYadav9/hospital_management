import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarDays,
  Stethoscope,
  Settings, 
  X,
  Activity
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';

/**
 * Sidebar Component
 * Apple HIG layout. White background, rounded-r-[24px] corners, soft shadow,
 * large spacing, and Framer Motion active navigation pills styled in desaturated blue.
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthContext();
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Add Patient', path: '/add-patient', icon: UserPlus },
    { name: 'Appointments', path: '/appointments', icon: CalendarDays },
    { name: 'Doctors', path: '/doctors', icon: Stethoscope },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/5 backdrop-blur-xs lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar aside */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-45 w-66 bg-white border-r border-[#ECECF3] rounded-r-[24px] shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Logo & Nav links */}
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 flex items-center justify-between px-7 border-b border-[#ECECF3]/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#4F7CFF] flex items-center justify-center text-white shadow-md shadow-blue-100/50">
                <Activity className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h1 className="text-sm font-bold tracking-tight text-zinc-800">
                  MedFlow OS
                </h1>
                <p className="text-[9px] text-[#4F7CFF] font-semibold tracking-wider uppercase">
                  Hope Hospital
                </p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-50 hover:text-zinc-650"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-5 space-y-2.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => { if (isOpen) toggleSidebar(); }}
                className="relative flex items-center group"
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <div className="w-full relative py-1">
                      {/* Spring animated active menu indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeSidebarItem"
                          className="absolute inset-0 bg-[#EDF2FF]/85 rounded-full border border-[#4F7CFF]/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      
                      <div className={`relative z-10 flex items-center gap-3.5 px-5 py-3 rounded-full text-xs font-semibold tracking-wide transition-colors duration-200 ${
                        isActive 
                          ? 'text-[#4F7CFF]' 
                          : 'text-zinc-500 hover:text-zinc-800'
                      }`}>
                        <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-[#4F7CFF]' : 'text-zinc-400'}`} />
                        {item.name}
                      </div>
                    </div>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Admin info */}
        <div className="p-5 border-t border-[#ECECF3]/60">
          <div className="flex items-center gap-3.5 px-3 py-2 bg-[#FAFAFC] rounded-2xl border border-[#ECECF3]/50">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150" 
                alt={user?.name || 'Administrator'} 
                className="w-8 h-8 rounded-xl object-cover border border-[#ECECF3]"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#22C55E] border border-white rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-bold text-zinc-800 truncate">
                {user?.name || 'Administrator'}
              </h4>
              <p className="text-[9px] text-zinc-400 truncate">
                {user?.role || 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
