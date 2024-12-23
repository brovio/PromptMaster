import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useApiKeys } from '../../hooks/useApiKeys';
import { Button } from '../ui/Button';
import { AppError } from '../../lib/error';

export default function ApiKeyForm() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const { saveApiKey } = useApiKeys();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    
    try {
      await saveApiKey('openrouter', apiKey);
      setSuccess('API key saved successfully');
      setApiKey('');
    } catch (err) {
      setError(err instanceof AppError ? err.message : 'Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <KeyRound className="w-5 h-5" />
        <h3 className="font-medium">OpenRouter API Key</h3>
      </div>
      
      <div className="space-y-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-or-v1-..."
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          disabled={saving}
        />
        <p className="text-sm text-gray-500">
          Get your API key from{' '}
          <a 
            href="https://openrouter.ai/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenRouter
          </a>
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <Button 
        type="submit"
        disabled={!apiKey.trim() || saving}
      >
        {saving ? 'Saving...' : 'Save API Key'}
      </Button>
    </form>
  );
}