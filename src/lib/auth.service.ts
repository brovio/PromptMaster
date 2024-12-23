import { AuthError, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export class AuthService {
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static async signIn(email: string, password: string) {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return session;
  }

  static async signUp(email: string, password: string) {
    const { data: { user, session }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    if (!user) throw new Error('User creation failed');

    return { user, session };
  }

  static async signOut() {
    // Clear any local session data first
    localStorage.removeItem('supabase.auth.token');
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, we want to clear the local state
      await supabase.auth.clearSession();
    }
  }

  static async refreshSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      await this.signOut();
      return null;
    }
    return session;
  }
}