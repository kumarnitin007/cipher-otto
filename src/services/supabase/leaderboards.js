/**
 * Leaderboards Service
 * 
 * Handles leaderboard operations:
 * - Get overall leaderboard
 * - Get leaderboard by category (score, streaks, completed, etc.)
 */

import { supabase } from './client';

/**
 * Get overall leaderboard
 * @param {string} sortBy - Sort by: 'score', 'completed', 'streak', 'bookmarks', 'comments'
 * @param {number} limit - Number of users to return
 * @returns {Promise<{leaderboard, error}>}
 */
export const getLeaderboard = async (sortBy = 'score', limit = 10) => {
  try {
    // Build query based on sortBy
    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        username,
        avatar_url,
        user_progress!left (
          completed,
          best_score
        ),
        user_streaks!left (
          current_streak,
          longest_streak
        ),
        user_bookmarks!left (
          cipher_id
        ),
        cipher_comments!left (
          id
        )
      `);

    // Execute query
    const { data, error } = await query;

    if (error) throw error;

    // Process and sort data
    const leaderboard = (data || []).map(profile => {
      const completedCiphers = profile.user_progress?.filter(p => p.completed)?.length || 0;
      const totalScore = profile.user_progress?.reduce((sum, p) => sum + (p.best_score || 0), 0) || 0;
      const currentStreak = profile.user_streaks?.[0]?.current_streak || 0;
      const longestStreak = profile.user_streaks?.[0]?.longest_streak || 0;
      const bookmarksCount = profile.user_bookmarks?.length || 0;
      const commentsCount = profile.cipher_comments?.length || 0;

      return {
        id: profile.id,
        username: profile.username,
        avatar_url: profile.avatar_url,
        completedCiphers,
        totalScore,
        currentStreak,
        longestStreak,
        bookmarksCount,
        commentsCount
      };
    });

    // Sort based on sortBy
    leaderboard.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.totalScore - a.totalScore;
        case 'completed':
          return b.completedCiphers - a.completedCiphers;
        case 'streak':
          return b.currentStreak - a.currentStreak;
        case 'bookmarks':
          return b.bookmarksCount - a.bookmarksCount;
        case 'comments':
          return b.commentsCount - a.commentsCount;
        default:
          return b.totalScore - a.totalScore;
      }
    });

    return { leaderboard: leaderboard.slice(0, limit), error: null };
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return { leaderboard: [], error };
  }
};

/**
 * Get user's rank in leaderboard
 * @param {string} userId - User ID
 * @param {string} sortBy - Sort by: 'score', 'completed', 'streak', 'bookmarks', 'comments'
 * @returns {Promise<{rank, error}>}
 */
export const getUserRank = async (userId, sortBy = 'score') => {
  try {
    const { leaderboard, error } = await getLeaderboard(sortBy, 1000); // Get large list to find rank
    if (error) throw error;

    const rank = leaderboard.findIndex(user => user.id === userId) + 1;
    return { rank: rank > 0 ? rank : null, error: null };
  } catch (error) {
    console.error('Get user rank error:', error);
    return { rank: null, error };
  }
};

