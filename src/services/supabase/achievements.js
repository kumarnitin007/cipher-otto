/**
 * Achievements Service
 * 
 * Handles achievement operations:
 * - Get all achievements
 * - Get user achievements
 * - Unlock achievement
 * - Check achievement eligibility
 */

import { supabase } from './client';
import { getUserStats } from './progress';
import { getUserBookmarks } from './bookmarks';
import { getUserNotes } from './notes';

/**
 * Get all available achievements
 * @returns {Promise<{achievements, error}>}
 */
export const getAllAchievements = async () => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return { achievements: data || [], error: null };
  } catch (error) {
    console.error('Get all achievements error:', error);
    return { achievements: [], error };
  }
};

/**
 * Get user's unlocked achievements
 * @param {string} userId - User ID
 * @returns {Promise<{achievements, error}>}
 */
export const getUserAchievements = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          id,
          name,
          description,
          icon,
          category
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return { achievements: data || [], error: null };
  } catch (error) {
    console.error('Get user achievements error:', error);
    return { achievements: [], error };
  }
};

/**
 * Check if user has unlocked an achievement
 * @param {string} achievementId - Achievement ID
 * @param {string} userId - User ID
 * @returns {Promise<{unlocked, error}>}
 */
export const hasAchievement = async (achievementId, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('id')
      .eq('achievement_id', achievementId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { unlocked: !!data, error: null };
  } catch (error) {
    console.error('Check achievement error:', error);
    return { unlocked: false, error };
  }
};

/**
 * Unlock an achievement for a user
 * @param {string} achievementId - Achievement ID
 * @param {string} userId - User ID
 * @returns {Promise<{achievement, error}>}
 */
export const unlockAchievement = async (achievementId, userId) => {
  try {
    // Check if already unlocked
    const { unlocked } = await hasAchievement(achievementId, userId);
    if (unlocked) {
      return { achievement: null, error: null }; // Already unlocked
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        achievement_id: achievementId,
        user_id: userId
      })
      .select(`
        *,
        achievements (
          id,
          name,
          description,
          icon,
          category
        )
      `)
      .single();

    if (error) throw error;
    return { achievement: data, error: null };
  } catch (error) {
    console.error('Unlock achievement error:', error);
    return { achievement: null, error };
  }
};

/**
 * Check and unlock achievements based on user activity
 * This should be called after significant user actions
 * @param {string} userId - User ID
 * @returns {Promise<{newAchievements, error}>}
 */
export const checkAndUnlockAchievements = async (userId) => {
  try {
    const newAchievements = [];

    // Get user stats
    const { stats } = await getUserStats(userId);
    
    // Get user's comments count
    const { data: userComments } = await supabase
      .from('cipher_comments')
      .select('id')
      .eq('user_id', userId);
    const commentsCount = userComments?.length || 0;
    
    const { bookmarks } = await getUserBookmarks(userId);
    const { notes } = await getUserNotes(userId);

    // Check various achievement conditions
    const checks = [
      { id: 'first_cipher', condition: stats && stats.completedCiphers >= 1 },
      { id: 'five_ciphers', condition: stats && stats.completedCiphers >= 5 },
      { id: 'ten_ciphers', condition: stats && stats.completedCiphers >= 10 },
      { id: 'perfect_score', condition: stats && stats.averageScore >= 100 },
      { id: 'first_comment', condition: commentsCount >= 1 },
      { id: 'five_comments', condition: commentsCount >= 5 },
      { id: 'bookmark_master', condition: bookmarks && bookmarks.length >= 10 },
      { id: 'note_taker', condition: notes && notes.length >= 1 }
    ];

    for (const check of checks) {
      if (check.condition) {
        const { achievement, error } = await unlockAchievement(check.id, userId);
        if (!error && achievement) {
          newAchievements.push(achievement);
        }
      }
    }

    return { newAchievements, error: null };
  } catch (error) {
    console.error('Check and unlock achievements error:', error);
    return { newAchievements: [], error };
  }
};

