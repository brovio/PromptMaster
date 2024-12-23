import React from 'react';
import { Container } from '../layout/Container';
import { TemplatesList } from './TemplatesList';
import { useTemplates } from '../../hooks/useTemplates';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

export function TemplatesPage() {
  const { templates, loading, error } = useTemplates();

  if (loading) {
    return (
      <Container className="py-8">
        <LoadingSpinner message="Loading templates..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="bg-red-50 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium">Error Loading Templates</h3>
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
          <h1 className="text-2xl font-bold text-gray-900">Prompt Templates</h1>
          <p className="text-gray-600 mt-1">
            Customize and manage your prompt templates for different use cases
          </p>
        </div>

        <TemplatesList templates={templates} />
      </div>
    </Container>
  );
}