/**
 * Reactions Service (Like/Dislike)
 * 
 * Handles cipher reaction operations:
 * - Get reactions for a cipher
 * - Add/update reaction (like/dislike)
 * - Remove reaction
 * - Get user's reaction for a cipher
 */

import { supabase } from './client';

/**
 * Get reactions count for a cipher
 * @param {string} cipherId - Cipher ID
 * @returns {Promise<{likes, dislikes, error}>}
 */
export const getCipherReactions = async (cipherId) => {
  try {
    const { data, error } = await supabase
      .from('cipher_reactions')
      .select('reaction_type')
      .eq('cipher_id', cipherId);

    if (error) throw error;

    const likes = data.filter(r => r.reaction_type === 'like').length;
    const improves = data.filter(r => r.reaction_type === 'improve' || r.reaction_type === 'dislike').length; // Support both for backward compatibility

    return { likes, improves, error: null };
  } catch (error) {
    console.error('Get cipher reactions error:', error);
    return { likes: 0, improves: 0, error };
  }
};

/**
 * Get user's reaction for a cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{reaction, error}>}
 */
export const getUserReaction = async (cipherId, userId) => {
  try {
    const { data, error } = await supabase
      .from('cipher_reactions')
      .select('reaction_type')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { reaction: data?.reaction_type || null, error: null };
  } catch (error) {
    console.error('Get user reaction error:', error);
    return { reaction: null, error };
  }
};

/**
 * Add or update a reaction
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @param {string} reactionType - 'like' or 'improve'
 * @returns {Promise<{reaction, error}>}
 */
export const setReaction = async (cipherId, userId, reactionType) => {
  try {
    // First check if user already has a reaction
    const { data: existing } = await supabase
      .from('cipher_reactions')
      .select('id, reaction_type')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing reaction
      if (existing.reaction_type === reactionType) {
        // Same reaction - remove it (toggle off)
        const { error } = await supabase
          .from('cipher_reactions')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        return { reaction: null, error: null };
      } else {
        // Different reaction - update it
        const { data, error } = await supabase
          .from('cipher_reactions')
          .update({ reaction_type: reactionType })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }
    } else {
      // Insert new reaction
      const { data, error } = await supabase
        .from('cipher_reactions')
        .insert({
          cipher_id: cipherId,
          user_id: userId,
          reaction_type: reactionType
        })
        .select()
        .single();
      if (error) throw error;
      result = data;
    }

    return { reaction: result, error: null };
  } catch (error) {
    console.error('Set reaction error:', error);
    return { reaction: null, error };
  }
};

/**
 * Remove a reaction
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{error}>}
 */
export const removeReaction = async (cipherId, userId) => {
  try {
    const { error } = await supabase
      .from('cipher_reactions')
      .delete()
      .eq('cipher_id', cipherId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Remove reaction error:', error);
    return { error };
  }
};

