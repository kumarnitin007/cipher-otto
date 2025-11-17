/**
 * Authentication Service
 * 
 * Handles user authentication operations:
 * - Sign up
 * - Sign in
 * - Sign out
 * - Get current user
 * - Password reset
 */

import { supabase, isSupabaseConfigured } from './client';

/**
 * Sign up a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - Username (optional)
 * @returns {Promise<{user, error}>}
 */
export const signUp = async (email, password, username = null) => {
  if (!isSupabaseConfigured) {
    return { user: null, error: new Error('Supabase is not configured') };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0]
        }
      }
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error };
  }
};

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user, error}>}
 */
export const signIn = async (email, password) => {
  if (!isSupabaseConfigured) {
    return { user: null, error: new Error('Supabase is not configured') };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<{error}>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

/**
 * Get the current authenticated user
 * @returns {Promise<{user, error}>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
};

/**
 * Get the current session
 * @returns {Promise<{session, error}>}
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error };
  }
};

/**
 * Reset password via email
 * @param {string} email - User email
 * @returns {Promise<{error}>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error };
  }
};

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to handle auth changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  if (!isSupabaseConfigured) {
    // Return a mock subscription if Supabase is not configured
    callback('SIGNED_OUT', null);
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};

