import React from 'react';
import { Menu, X } from 'lucide-react';
import MobileNav from './navigation/MobileNav';
import { useAuth } from '../contexts/AuthContext';

interface MobileLayoutProps {
  children: React.ReactNode;
  onNavigate: (route: string) => void;
}

export default function MobileLayout({ children, onNavigate }: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-10">
        <h1 className="text-lg font-semibold">PromptMaster</h1>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <MobileNav 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={onNavigate}
        onSignOut={signOut}
      />
      
      <main className="pt-14 pb-16">
        {children}
      </main>
    </div>
  );
}