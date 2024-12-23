import React from 'react';
import { Lightbulb, X } from 'lucide-react';

interface SuggestionDropdownProps {
  content: string;
  onClose: () => void;
}

export function SuggestionDropdown({ content, onClose }: SuggestionDropdownProps) {
  const suggestions = [
    'Add specific requirements or constraints',
    'Include expected format or structure',
    'Specify the target audience or context',
    'Define the tone or style',
    'Add examples if applicable'
  ].filter(s => !content.toLowerCase().includes(s.toLowerCase()));

  if (suggestions.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2 text-yellow-600">
          <Lightbulb className="w-4 h-4" />
          <span className="font-medium">Suggestions for Improvement</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <ul className="p-2 space-y-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer"
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}