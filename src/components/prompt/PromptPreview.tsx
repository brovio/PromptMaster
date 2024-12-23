import React, { memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { PreviewSection } from './PreviewSection';
import { parsePreviewSections } from '../../utils/preview';

interface PromptPreviewProps {
  content?: string;
  loading?: boolean;
  onRefresh?: () => void;
}

export const PromptPreview = memo(function PromptPreview({ 
  content, 
  loading, 
  onRefresh 
}: PromptPreviewProps) {
  const sections = content ? parsePreviewSections(content) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
        <button
          onClick={onRefresh}
          className={`p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors ${
            loading ? 'animate-spin' : ''
          }`}
          disabled={loading}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 bg-gray-50 min-h-[200px] lg:min-h-[calc(100vh-16rem)] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Processing...</div>
          </div>
        ) : sections.length > 0 ? (
          <div className="space-y-6">
            {sections.map((section, index) => (
              <PreviewSection
                key={`${section.title}-${index}`}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Preview will appear here</p>
            <p className="text-sm text-gray-400 mt-2">
              Enter a prompt and click Run to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
});