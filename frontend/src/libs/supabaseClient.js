import { createClient } from '@supabase/supabase-js';

// Load environment variables (e.g., from a .env file)
const supabaseUrl = process.env.REACT_PUBLIC_SUPABASE_URL; // For client-side safe public URL
const supabaseAnonKey = process.env.REACT_PUBLIC_SUPABASE_ANON_KEY; // For client-side safe public key

// Create a Supabase client instance
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
