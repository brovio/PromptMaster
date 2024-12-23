import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import ModelSettings from './ModelSettings';
import { Container } from '../layout/Container';

export default function SettingsPanel() {
  return (
    <Container className="py-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <ModelSettings />
          </div>
        </div>
      </div>
    </Container>
  );
}