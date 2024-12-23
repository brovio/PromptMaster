import React from 'react';
import { Container } from '../layout/Container';
import { HistoryList } from './HistoryList';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { usePromptHistory } from '../../hooks/usePromptHistory';
import { AlertCircle } from 'lucide-react';

export function HistoryPage() {
  const { history, loading, error } = usePromptHistory();

  if (loading) {
    return (
      <Container className="py-8">
        <LoadingSpinner message="Loading prompt history..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading History</h3>
            <p className="text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompt History</h1>
          <p className="text-gray-600 mt-1">View and manage your previous prompts</p>
        </div>

        <HistoryList items={history} />
      </div>
    </Container>
  );
}