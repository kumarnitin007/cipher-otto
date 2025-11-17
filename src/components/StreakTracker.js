/**
 * Streak Tracker Component
 * 
 * Displays user's learning streak
 */

import React, { useState, useEffect } from 'react';
import { Flame, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserStreak } from '../services/supabase/streaks';

const StreakTracker = () => {
  const { user, isAuthenticated } = useAuth();
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadStreak();
    }
  }, [user]);

  const loadStreak = async () => {
    setLoading(true);
    try {
      const { streak: userStreak } = await getUserStreak(user.id);
      setStreak(userStreak);
    } catch (error) {
      console.error('Error loading streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-orange-500/30">
        <div className="text-orange-200 text-sm">Loading streak...</div>
      </div>
    );
  }

  const currentStreak = streak?.current_streak || 0;
  const longestStreak = streak?.longest_streak || 0;

  return (
    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full px-4 py-2 border border-orange-500/30 flex items-center gap-2">
      <Flame className="text-orange-400" size={18} />
      <div className="flex items-center gap-1">
        <span className="text-white font-bold text-sm">{currentStreak}</span>
        <span className="text-orange-200 text-xs">{currentStreak === 1 ? 'day' : 'days'}</span>
      </div>
    </div>
  );
};

export default StreakTracker;

