/**
 * Progress Tracker Component
 * 
 * Displays user progress for the current cipher
 */

import React, { useState, useEffect } from 'react';
import { Target, Trophy, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCipherProgress, getUserStats } from '../services/supabase/progress';

const ProgressTracker = ({ cipherId }) => {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadProgress();
      loadStats();
    }
  }, [cipherId, user]);

  const loadProgress = async () => {
    try {
      const { progress: cipherProgress } = await getCipherProgress(cipherId, user.id);
      setProgress(cipherProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { stats: userStats } = await getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="text-purple-200 text-sm text-center py-2">
        📊 Sign in to track your learning progress
      </p>
    );
  }

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-purple-300" size={20} />
        <h3 className="text-lg font-semibold text-white">Your Progress</h3>
      </div>

      {progress ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="text-yellow-400" size={16} />
                <span className="text-purple-200 text-xs">Best Score</span>
              </div>
              <div className="text-white font-bold text-lg">{progress.best_score || 0}</div>
            </div>
            <div className="bg-purple-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-green-400" size={16} />
                <span className="text-purple-200 text-xs">Attempts</span>
              </div>
              <div className="text-white font-bold text-lg">{progress.attempts || 0}</div>
            </div>
          </div>

          {progress.total_time_seconds > 0 && (
            <div className="bg-purple-800/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-blue-400" size={16} />
                <span className="text-purple-200 text-xs">Time Spent</span>
              </div>
              <div className="text-white font-bold">{formatTime(progress.total_time_seconds)}</div>
            </div>
          )}

          {progress.completed && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
              <Trophy className="text-yellow-400 mx-auto mb-1" size={24} />
              <div className="text-green-300 font-semibold">Completed!</div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-purple-200 text-sm text-center py-4">
          No progress yet. Start practicing to track your progress!
        </div>
      )}

      {stats && (
        <div className="mt-4 pt-4 border-t border-purple-500/30">
          <div className="text-purple-200 text-xs mb-2">Overall Stats</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-purple-300">Completed:</span>
              <span className="text-white font-semibold ml-2">{stats.completedCiphers}/{stats.totalCiphers}</span>
            </div>
            <div>
              <span className="text-purple-300">Total Time:</span>
              <span className="text-white font-semibold ml-2">{formatTime(stats.totalTime)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

