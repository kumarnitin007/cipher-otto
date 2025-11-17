/**
 * Bookmarks Service
 * 
 * Handles user bookmark operations:
 * - Get user bookmarks
 * - Add bookmark
 * - Remove bookmark
 * - Check if cipher is bookmarked
 */

import { supabase } from './client';

/**
 * Get all bookmarks for a user
 * @param {string} userId - User ID
 * @returns {Promise<{bookmarks, error}>}
 */
export const getUserBookmarks = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('cipher_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { bookmarks: data || [], error: null };
  } catch (error) {
    console.error('Get user bookmarks error:', error);
    return { bookmarks: [], error };
  }
};

/**
 * Check if a cipher is bookmarked by user
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{isBookmarked, error}>}
 */
export const isBookmarked = async (cipherId, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .select('id')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { isBookmarked: !!data, error: null };
  } catch (error) {
    console.error('Check bookmark error:', error);
    return { isBookmarked: false, error };
  }
};

/**
 * Add a bookmark
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{bookmark, error}>}
 */
export const addBookmark = async (cipherId, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_bookmarks')
      .insert({
        cipher_id: cipherId,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return { bookmark: data, error: null };
  } catch (error) {
    console.error('Add bookmark error:', error);
    return { bookmark: null, error };
  }
};

/**
 * Remove a bookmark
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{error}>}
 */
export const removeBookmark = async (cipherId, userId) => {
  try {
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('cipher_id', cipherId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Remove bookmark error:', error);
    return { error };
  }
};

/**
 * Toggle bookmark (add if not exists, remove if exists)
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{isBookmarked, error}>}
 */
export const toggleBookmark = async (cipherId, userId) => {
  try {
    const { isBookmarked: currentStatus, error: checkError } = await isBookmarked(cipherId, userId);
    if (checkError) throw checkError;
    
    if (currentStatus) {
      const { error } = await removeBookmark(cipherId, userId);
      if (error) throw error;
      return { isBookmarked: false, error: null };
    } else {
      const { error } = await addBookmark(cipherId, userId);
      if (error) throw error;
      return { isBookmarked: true, error: null };
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    return { isBookmarked: false, error };
  }
};

