import { supabase } from '../lib/supabase';

export async function createOrUpdateProfile(userId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }
  } catch (err) {
    console.error('Error in createOrUpdateProfile:', err);
    throw err;
  }
}