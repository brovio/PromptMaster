import { ModelPreference } from '../types/openrouter';

const STORAGE_KEYS = {
  MODEL_PREFERENCES: 'promptmaster:model_preferences',
} as const;

export const storage = {
  getModelPreferences: (): ModelPreference[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MODEL_PREFERENCES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading model preferences from storage:', error);
      return [];
    }
  },

  setModelPreferences: (preferences: ModelPreference[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODEL_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving model preferences to storage:', error);
    }
  }
};