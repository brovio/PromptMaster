export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          is_superadmin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          is_superadmin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          is_superadmin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      model_preferences: {
        Row: {
          id: string;
          user_id: string;
          model_id: string;
          provider: string;
          is_enabled: boolean;
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          model_id: string;
          provider: string;
          is_enabled?: boolean;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          model_id?: string;
          provider?: string;
          is_enabled?: boolean;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      // ... other existing tables
    };
  };
}