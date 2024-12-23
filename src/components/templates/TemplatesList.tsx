import React from 'react';
import { TemplateCard } from './TemplateCard';
import type { Template } from '../../types/templates';

interface TemplatesListProps {
  templates: Template[];
}

export function TemplatesList({ templates }: TemplatesListProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No templates available</p>
        <p className="text-gray-500 text-sm mt-1">
          Create your first template to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}