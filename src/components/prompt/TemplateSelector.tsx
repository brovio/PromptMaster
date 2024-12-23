import React from 'react';
import { Select } from '../ui/Select';
import { usePromptTemplates } from '../../hooks/usePromptTemplates';
import { Tooltip } from '../ui/Tooltip';
import { HelpCircle } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export default function TemplateSelector({ selectedTemplateId, onSelect }: TemplateSelectorProps) {
  const { templates } = usePromptTemplates();

  const options = templates.map(template => ({
    value: template.id,
    label: template.name,
    disabled: !template.isEnabled
  }));

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Template
          </label>
          <Tooltip content="Choose how you want to improve your prompt">
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>
        <Select
          value={selectedTemplateId}
          onChange={onSelect}
          options={options}
          placeholder="Choose a template"
        />
      </div>
    </div>
  );
}