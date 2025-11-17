/**
 * Bookmark Button Component
 * 
 * Handles bookmarking/favoriting ciphers
 */

import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isBookmarked, toggleBookmark } from '../services/supabase/bookmarks';

const BookmarkButton = ({ cipherId, onBookmarkChange }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadBookmarkStatus();
    }
  }, [cipherId, user]);

  const loadBookmarkStatus = async () => {
    try {
      const { isBookmarked: status } = await isBookmarked(cipherId, user.id);
      setBookmarked(status);
    } catch (error) {
      console.error('Error loading bookmark status:', error);
    }
  };

  const handleToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to bookmark ciphers');
      return;
    }

    setLoading(true);
    try {
      const { isBookmarked: newStatus, error } = await toggleBookmark(cipherId, user.id);
      if (error) {
        console.error('Error toggling bookmark:', error);
        alert('Failed to bookmark: ' + (error.message || 'Unknown error'));
        return;
      }
      
      setBookmarked(newStatus);
      // Notify parent component to refresh bookmarks list
      if (onBookmarkChange) {
        onBookmarkChange();
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to bookmark: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading || !isAuthenticated}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        bookmarked
          ? 'bg-yellow-500 text-gray-900'
          : 'bg-white/10 hover:bg-white/20 text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this cipher'}
    >
      <span className="text-lg">{bookmarked ? '🔖' : '📑'}</span>
      <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </button>
  );
};

export default BookmarkButton;

