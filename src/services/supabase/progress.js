/**
 * Progress Tracking Service
 * 
 * Handles user progress operations:
 * - Get user progress for a cipher
 * - Update progress
 * - Get all user progress
 * - Get completion statistics
 */

import { supabase } from './client';

/**
 * Get user progress for a specific cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{progress, error}>}
 */
export const getCipherProgress = async (cipherId, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { progress: data || null, error: null };
  } catch (error) {
    console.error('Get cipher progress error:', error);
    return { progress: null, error };
  }
};

/**
 * Get all progress for a user
 * @param {string} userId - User ID
 * @returns {Promise<{progress, error}>}
 */
export const getUserProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { progress: data || [], error: null };
  } catch (error) {
    console.error('Get user progress error:', error);
    return { progress: [], error };
  }
};

/**
 * Update or create progress for a cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @param {Object} progressData - Progress data (score, completed, time, etc.)
 * @returns {Promise<{progress, error}>}
 */
export const updateProgress = async (cipherId, userId, progressData) => {
  try {
    // Check if progress exists
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing progress
      const updateData = {
        ...progressData,
        attempts: (progressData.attempts || 0) + 1,
        last_practiced_at: new Date().toISOString()
      };

      // Update best score if new score is higher
      if (progressData.score) {
        const { data: current } = await supabase
          .from('user_progress')
          .select('best_score')
          .eq('id', existing.id)
          .single();
        
        if (current && progressData.score > current.best_score) {
          updateData.best_score = progressData.score;
        }
      }

      const { data, error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          cipher_id: cipherId,
          user_id: userId,
          ...progressData,
          attempts: 1,
          last_practiced_at: new Date().toISOString(),
          best_score: progressData.score || 0
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return { progress: result, error: null };
  } catch (error) {
    console.error('Update progress error:', error);
    return { progress: null, error };
  }
};

/**
 * Mark cipher as completed
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{progress, error}>}
 */
export const markCompleted = async (cipherId, userId) => {
  try {
    return await updateProgress(cipherId, userId, { completed: true });
  } catch (error) {
    console.error('Mark completed error:', error);
    return { progress: null, error };
  }
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<{stats, error}>}
 */
export const getUserStats = async (userId) => {
  try {
    const { progress, error } = await getUserProgress(userId);
    if (error) throw error;

    const stats = {
      totalCiphers: progress.length,
      completedCiphers: progress.filter(p => p.completed).length,
      totalAttempts: progress.reduce((sum, p) => sum + (p.attempts || 0), 0),
      totalTime: progress.reduce((sum, p) => sum + (p.total_time_seconds || 0), 0),
      averageScore: progress.length > 0 
        ? progress.reduce((sum, p) => sum + (p.best_score || 0), 0) / progress.length 
        : 0
    };

    return { stats, error: null };
  } catch (error) {
    console.error('Get user stats error:', error);
    return { stats: null, error };
  }
};

