import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { PromptLayout } from './components/layout/PromptLayout';
import { HistoryPage } from './components/history/HistoryPage';
import AuthTabs from './components/auth/AuthTabs';
import SettingsPanel from './components/settings/SettingsPanel';

function AppContent() {
  const { user, loading, error } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('/');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <AuthTabs />
      </div>
    );
  }

  return (
    <AppLayout onNavigate={setCurrentRoute}>
      {currentRoute === '/settings' ? (
        <SettingsPanel />
      ) : currentRoute === '/history' ? (
        <HistoryPage />
      ) : (
        <PromptLayout />
      )}
    </AppLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;