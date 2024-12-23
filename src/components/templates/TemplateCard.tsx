import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Template } from '../../types/templates';
import { useTemplateActions } from '../../hooks/useTemplateActions';

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(template.systemPrompt);
  const { updateTemplate, saving } = useTemplateActions();

  const handleSave = async () => {
    await updateTemplate(template.id, { systemPrompt: content });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContent(template.systemPrompt);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">{template.name}</h3>
          {!isEditing && (
            <Button
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="p-1.5"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 p-3 text-sm font-mono border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-gray-50"
              placeholder="Enter system prompt..."
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || content === template.systemPrompt}
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <pre className="text-sm whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded-lg">
            {template.systemPrompt || 'No system prompt defined'}
          </pre>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
            {template.platform}
          </span>
          <span className="px-2 py-1 bg-gray-200 rounded text-xs">
            {template.category}
          </span>
        </div>
      </div>
    </div>
  );
}