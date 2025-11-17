/**
 * Achievements Badge Component
 * 
 * Displays user achievements
 */

import React, { useState, useEffect } from 'react';
import { Award, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserAchievements } from '../services/supabase/achievements';

const AchievementsBadge = ({ showFull = false }) => {
  const { user, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const { achievements: userAchievements } = await getUserAchievements(user.id);
      setAchievements(userAchievements || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  if (!isAuthenticated) return null;

  if (showFull) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-yellow-400" size={20} />
          <h3 className="text-lg font-semibold text-white">Achievements ({achievements.length})</h3>
        </div>

        {achievements.length === 0 ? (
          <div className="text-purple-200 text-sm text-center py-4">
            No achievements yet. Keep learning to unlock achievements!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-purple-800/30 rounded-lg p-3 flex items-center gap-3"
              >
                <div className="text-2xl">{achievement.achievements?.icon || '🏆'}</div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">
                    {achievement.achievements?.name || 'Achievement'}
                  </div>
                  <div className="text-purple-300 text-xs">
                    {achievement.achievements?.description || ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Compact view - just show count and icon
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-purple-800/30 rounded-lg">
      <Award className="text-yellow-400" size={18} />
      <span className="text-white font-semibold">{achievements.length}</span>
    </div>
  );
};

export default AchievementsBadge;

