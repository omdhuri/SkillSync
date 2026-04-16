import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          phone: string | null;
          location: string | null;
          linkedin: string | null;
          portfolio: string | null;
          bio: string | null;
          target_role: string | null;
          skills: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          linkedin?: string | null;
          portfolio?: string | null;
          bio?: string | null;
          target_role?: string | null;
          skills?: string[];
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          phone?: string | null;
          location?: string | null;
          linkedin?: string | null;
          portfolio?: string | null;
          bio?: string | null;
          target_role?: string | null;
          skills?: string[];
        };
      };
    };
  };
};
