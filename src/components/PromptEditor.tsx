import React, { useState } from 'react';
import { Save, Play, Share2 } from 'lucide-react';

interface PromptEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  onTest?: (content: string) => void;
}

export default function PromptEditor({ 
  initialContent = '', 
  onSave, 
  onTest 
}: PromptEditorProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="bg-white rounded-lg shadow-sm border h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Prompt Editor</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTest?.(content)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Test
          </button>
          <button
            onClick={() => onSave?.(content)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[calc(100vh-250px)] p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          placeholder="Enter your prompt here..."
        />
      </div>
    </div>
  );
}