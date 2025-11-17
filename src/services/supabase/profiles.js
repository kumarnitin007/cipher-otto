/**
 * User Profiles Service
 * 
 * Handles user profile operations:
 * - Get user profile
 * - Update user profile
 * - Create user profile
 */

import { supabase } from './client';

/**
 * Get user profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise<{profile, error}>}
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { profile: null, error };
  }
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates (username, avatar_url, bio)
 * @returns {Promise<{profile, error}>}
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { profile: null, error };
  }
};

/**
 * Create user profile (usually called after signup)
 * @param {string} userId - User ID
 * @param {string} username - Username
 * @returns {Promise<{profile, error}>}
 */
export const createUserProfile = async (userId, username) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username: username || `user_${userId.substring(0, 8)}`
      })
      .select()
      .single();

    if (error) throw error;
    return { profile: data, error: null };
  } catch (error) {
    console.error('Create user profile error:', error);
    return { profile: null, error };
  }
};

