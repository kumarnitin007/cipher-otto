/**
 * Notes Like/Dislike Button Component
 * 
 * Handles like/dislike reactions for Expert's or Otto's Notes
 */

import React, { useState, useEffect } from 'react';
import { ThumbsUp, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCipherReactions, getUserReaction, setReaction } from '../services/supabase/reactions';

const NotesLikeDislike = ({ cipherId, noteType }) => {
  // noteType: 'expert' or 'otto'
  const { user, isAuthenticated } = useAuth();
  const [likes, setLikes] = useState(0);
  const [improves, setImproves] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use a unique identifier for each note type
  const reactionCipherId = `${cipherId}_${noteType}_notes`;

  useEffect(() => {
    loadReactions();
  }, [cipherId, noteType, user]);

  const loadReactions = async () => {
    try {
      const { likes: likesCount, improves: improvesCount } = await getCipherReactions(reactionCipherId);
      setLikes(likesCount);
      setImproves(improvesCount);

      if (user) {
        const { reaction } = await getUserReaction(reactionCipherId, user.id);
        setUserReaction(reaction);
      }
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const handleReaction = async (reactionType) => {
    if (!isAuthenticated) {
      alert('Please sign in to like or suggest improvements');
      return;
    }

    setLoading(true);
    try {
      const { reaction, error } = await setReaction(reactionCipherId, user.id, reactionType);
      if (error) throw error;

      // Reload reactions to get updated counts
      await loadReactions();
    } catch (error) {
      console.error('Error setting reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleReaction('like')}
        disabled={loading || !isAuthenticated}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs ${
          userReaction === 'like'
            ? 'bg-green-500 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <ThumbsUp size={14} />
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleReaction('improve')}
        disabled={loading || !isAuthenticated}
        className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all text-xs ${
          userReaction === 'improve'
            ? 'bg-blue-500 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title="Suggest improvements"
      >
        <Lightbulb size={14} />
        <span>Improve ({improves})</span>
      </button>
    </div>
  );
};

export default NotesLikeDislike;

