import React from 'react';
import { Library, History, Users, Settings, LogOut } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onSignOut: () => void;
}

export default function MobileNav({ isOpen, onClose, onNavigate, onSignOut }: MobileNavProps) {
  const navItems = [
    { icon: <Library className="w-5 h-5" />, label: 'Templates', route: '/' },
    { icon: <History className="w-5 h-5" />, label: 'History', route: '/history' },
    { icon: <Users className="w-5 h-5" />, label: 'Team', route: '/team' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', route: '/settings' },
  ];

  if (!isOpen) return null;

  const handleNavigation = (route: string) => {
    onNavigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-20 bg-gray-900/50" onClick={onClose}>
      <nav 
        className="w-64 h-full bg-white shadow-xl animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.route)}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gray-50 mt-auto border-t"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </nav>
    </div>
  );
}