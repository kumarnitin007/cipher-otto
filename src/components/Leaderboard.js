/**
 * Leaderboard Component
 * 
 * Displays top users in various categories
 */

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard, getUserRank } from '../services/supabase/leaderboards';

const Leaderboard = ({ sortBy = 'score', limit = 10 }) => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy, currentUser]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const { leaderboard: board } = await getLeaderboard(sortBy, limit);
      setLeaderboard(board || []);

      if (isAuthenticated && currentUser) {
        const { rank } = await getUserRank(currentUser.id, sortBy);
        setUserRank(rank);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position) => {
    if (position === 1) return <Crown className="text-yellow-400" size={20} />;
    if (position === 2) return <Medal className="text-gray-300" size={20} />;
    if (position === 3) return <Award className="text-orange-400" size={20} />;
    return <Star className="text-purple-300" size={16} />;
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case 'score': return 'Total Score';
      case 'completed': return 'Completed Ciphers';
      case 'streak': return 'Current Streak';
      case 'bookmarks': return 'Bookmarks';
      case 'comments': return 'Comments';
      default: return 'Total Score';
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
        <div className="text-yellow-200 text-sm text-center">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-yellow-400" size={24} />
        <h3 className="text-lg font-bold text-white">Leaderboard</h3>
        <span className="text-yellow-200 text-xs">({getSortLabel()})</span>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-yellow-200 text-sm text-center py-4">
          No users yet. Be the first to practice!
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((leaderboardUser, index) => (
            <div
              key={leaderboardUser.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                leaderboardUser.id === currentUser?.id
                  ? 'bg-yellow-500/30 border-2 border-yellow-400'
                  : 'bg-yellow-900/20 border border-yellow-500/20'
              }`}
            >
              <div className="flex items-center gap-2 min-w-[60px]">
                {getRankIcon(index + 1)}
                <span className="text-yellow-200 font-bold text-sm">#{index + 1}</span>
              </div>
              <div className="text-2xl">{leaderboardUser.avatar_url || '🦦'}</div>
              <div className="flex-1">
                <div className="text-white font-semibold">{leaderboardUser.username}</div>
                <div className="text-yellow-200 text-xs">
                  {sortBy === 'score' && `${leaderboardUser.totalScore} points`}
                  {sortBy === 'completed' && `${leaderboardUser.completedCiphers} ciphers`}
                  {sortBy === 'streak' && `${leaderboardUser.currentStreak} day streak`}
                  {sortBy === 'bookmarks' && `${leaderboardUser.bookmarksCount} bookmarks`}
                  {sortBy === 'comments' && `${leaderboardUser.commentsCount} comments`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAuthenticated && currentUser && userRank && userRank > limit && (
        <div className="mt-4 pt-4 border-t border-yellow-500/30">
          <div className="text-yellow-200 text-xs text-center">
            Your rank: #{userRank}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

