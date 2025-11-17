/**
 * Comments Service
 * 
 * Handles cipher comment operations:
 * - Get comments for a cipher
 * - Add comment
 * - Update comment
 * - Delete comment
 */

import { supabase } from './client';

/**
 * Get all comments for a cipher
 * @param {string} cipherId - Cipher ID
 * @returns {Promise<{comments, error}>}
 */
export const getCipherComments = async (cipherId) => {
  try {
    const { data, error } = await supabase
      .from('cipher_comments')
      .select(`
        *,
        user_profiles!cipher_comments_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('cipher_id', cipherId)
      .order('created_at', { ascending: false });

    if (error) {
      // If the join fails, try without the join and fetch profiles separately
      console.warn('Join failed, trying alternative query:', error);
      const { data: commentsData, error: commentsError } = await supabase
        .from('cipher_comments')
        .select('*')
        .eq('cipher_id', cipherId)
        .order('created_at', { ascending: false });
      
      if (commentsError) throw commentsError;
      
      // Fetch user profiles separately
      const commentsWithProfiles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, username, avatar_url')
            .eq('id', comment.user_id)
            .single();
          
          return {
            ...comment,
            user_profiles: profile || null
          };
        })
      );
      
      return { comments: commentsWithProfiles, error: null };
    }
    
    return { comments: data || [], error: null };
  } catch (error) {
    console.error('Get cipher comments error:', error);
    return { comments: [], error };
  }
};

/**
 * Add a comment to a cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @param {string} commentText - Comment text
 * @returns {Promise<{comment, error}>}
 */
export const addComment = async (cipherId, userId, commentText) => {
  try {
    // First insert the comment
    const { data: commentData, error: insertError } = await supabase
      .from('cipher_comments')
      .insert({
        cipher_id: cipherId,
        user_id: userId,
        comment_text: commentText
      })
      .select('*')
      .single();

    if (insertError) throw insertError;
    
    // Then fetch the user profile separately
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, username, avatar_url')
      .eq('id', userId)
      .single();
    
    return { 
      comment: {
        ...commentData,
        user_profiles: profile || null
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Add comment error:', error);
    return { comment: null, error };
  }
};

/**
 * Update a comment
 * @param {string} commentId - Comment ID
 * @param {string} commentText - Updated comment text
 * @returns {Promise<{comment, error}>}
 */
export const updateComment = async (commentId, commentText) => {
  try {
    // First update the comment
    const { data: commentData, error: updateError } = await supabase
      .from('cipher_comments')
      .update({ comment_text: commentText })
      .eq('id', commentId)
      .select('*')
      .single();

    if (updateError) throw updateError;
    
    // Then fetch the user profile separately
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, username, avatar_url')
      .eq('id', commentData.user_id)
      .single();
    
    return { 
      comment: {
        ...commentData,
        user_profiles: profile || null
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Update comment error:', error);
    return { comment: null, error };
  }
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise<{error}>}
 */
export const deleteComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from('cipher_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete comment error:', error);
    return { error };
  }
};

