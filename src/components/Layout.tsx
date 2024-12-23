import React from 'react';
import { Menu, Settings, Users, History, Library, BookOpen } from 'lucide-react';

const Sidebar = () => (
  <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
    <div className="p-4 border-b border-gray-800">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        PromptLab
      </h1>
    </div>
    <nav className="p-4">
      {[
        { icon: <Library className="w-5 h-5" />, label: 'Templates' },
        { icon: <History className="w-5 h-5" />, label: 'History' },
        { icon: <Users className="w-5 h-5" />, label: 'Team' },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
      ].map((item) => (
        <button
          key={item.label}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg mb-1"
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  </div>
);

const Header = () => (
  <header className="h-16 bg-white border-b flex items-center justify-between px-4 fixed top-0 left-64 right-0">
    <button className="p-2 hover:bg-gray-100 rounded-lg">
      <Menu className="w-6 h-6" />
    </button>
    <div className="flex items-center gap-4">
      <button className="text-sm text-gray-600 hover:text-gray-900">Sign In</button>
    </div>
  </header>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="pt-16 p-6">{children}</main>
      </div>
    </div>
  );
}