import { supabase, enhancedQuery } from './supabase';
import type { Profile } from '../types';
import { AppError } from './error';

export class ProfileService {
  static async createProfile(userId: string): Promise<Profile> {
    try {
      const { data, error } = await enhancedQuery
        .from('profiles')
        .insert([{ 
          id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      if (!data?.[0]) throw new AppError('Failed to create profile');
      
      return data[0];
    } catch (error) {
      console.error('Error creating profile:', error);
      throw new AppError('Failed to create profile', 'PROFILE_CREATE_ERROR', error);
    }
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await enhancedQuery
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error getting profile:', error);
      throw new AppError('Failed to get profile', 'PROFILE_GET_ERROR', error);
    }
  }

  static async ensureProfileExists(userId: string): Promise<Profile> {
    try {
      const profile = await this.getProfile(userId);
      if (profile) return profile;
      return await this.createProfile(userId);
    } catch (error) {
      console.error('Error ensuring profile exists:', error);
      throw new AppError('Failed to ensure profile exists', 'PROFILE_ENSURE_ERROR', error);
    }
  }
}