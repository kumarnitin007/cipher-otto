/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for the application.
 * Make sure to set up your environment variables in .env file:
 * 
 * REACT_APP_SUPABASE_URL=your-project-url
 * REACT_APP_SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Validate environment variables
if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not set. The app will work without authentication features. Please configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file to enable user features.');
}

// Create and export Supabase client (use placeholder values if not configured)
// This prevents errors when Supabase isn't set up yet
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    });

