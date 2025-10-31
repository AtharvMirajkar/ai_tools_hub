import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  logo_url: string | null;
  category: string;
  features: string[];
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    user_id: string;
    created_at: string;
    user?: {
      id: string;
      full_name: string;
    };
  }
