import React from 'react';
import SignInForm from './SignInForm';
import { WaitlistForm } from './WaitlistForm';

export default function AuthTabs() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to PromptMaster
        </h2>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <SignInForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              New to PromptMaster?
            </span>
          </div>
        </div>
        <WaitlistForm />
      </div>
    </div>
  );
}