/**
 * Learning Streaks Service
 * 
 * Handles user learning streak operations:
 * - Get user streak
 * - Update streak (called when user practices)
 * - Get leaderboard by streaks
 */

import { supabase } from './client';

/**
 * Get user's learning streak
 * @param {string} userId - User ID
 * @returns {Promise<{streak, error}>}
 */
export const getUserStreak = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { streak: data || null, error: null };
  } catch (error) {
    console.error('Get user streak error:', error);
    return { streak: null, error };
  }
};

/**
 * Update user's streak (call this when user practices)
 * @param {string} userId - User ID
 * @returns {Promise<{streak, error}>}
 */
export const updateStreak = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Get current streak
    const { streak: currentStreak, error: getError } = await getUserStreak(userId);
    
    if (getError && getError.code !== 'PGRST116') throw getError;

    let newStreak;
    if (!currentStreak) {
      // First time practicing - create streak
      const { data, error } = await supabase
        .from('user_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_practice_date: today
        })
        .select()
        .single();
      
      if (error) throw error;
      newStreak = data;
    } else {
      const lastDate = currentStreak.last_practice_date 
        ? new Date(currentStreak.last_practice_date).toISOString().split('T')[0]
        : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newCurrentStreak;
      if (lastDate === today) {
        // Already practiced today - no change
        newCurrentStreak = currentStreak.current_streak;
      } else if (lastDate === yesterdayStr) {
        // Practiced yesterday - continue streak
        newCurrentStreak = currentStreak.current_streak + 1;
      } else {
        // Streak broken - start over
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(newCurrentStreak, currentStreak.longest_streak);

      const { data, error } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newCurrentStreak,
          longest_streak: newLongestStreak,
          last_practice_date: today
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      newStreak = data;
    }

    return { streak: newStreak, error: null };
  } catch (error) {
    console.error('Update streak error:', error);
    return { streak: null, error };
  }
};

/**
 * Get top users by current streak
 * @param {number} limit - Number of users to return
 * @returns {Promise<{users, error}>}
 */
export const getStreakLeaderboard = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_streaks')
      .select(`
        *,
        user_profiles!inner (
          id,
          username,
          avatar_url
        )
      `)
      .order('current_streak', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { users: data || [], error: null };
  } catch (error) {
    console.error('Get streak leaderboard error:', error);
    return { users: [], error };
  }
};

