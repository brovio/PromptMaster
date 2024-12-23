import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui/Button';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus('submitting');
      setError('');

      const { error: submitError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (submitError) throw submitError;
      
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Error joining waitlist:', err);
      setError('Failed to join waitlist. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 p-4 rounded-lg text-center">
        <h3 className="text-green-800 font-medium">You're on the list!</h3>
        <p className="text-green-600 mt-1">
          We'll notify you when registration opens.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Join the Waitlist</h2>
        <p className="text-gray-600 mt-1">
          Registration is currently closed. Join the waitlist to be notified when it opens.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={status === 'submitting' || !email}
          className="w-full"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Joining...
            </>
          ) : (
            'Join Waitlist'
          )}
        </Button>
      </form>
    </div>
  );
}