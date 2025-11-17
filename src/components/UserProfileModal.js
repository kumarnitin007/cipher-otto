/**
 * User Profile Modal Component
 * 
 * Allows users to edit their profile: username, avatar, and bio
 */

import React, { useState, useEffect } from 'react';
import { X, User, Save, Edit2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/supabase/profiles';
import { getUserBookmarks } from '../services/supabase/bookmarks';
import { supabase } from '../services/supabase/client';
import AvatarSelector from './AvatarSelector';

const UserProfileModal = ({ show, onClose, guestAvatar, setGuestAvatar, onSignInClick }) => {
  const { user, profile, refreshProfile, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('🦦');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (isAuthenticated && profile) {
      setUsername(profile.username || '');
      setAvatar(profile.avatar_url || '🦦');
      setBio(profile.bio || '');
      setFeedback(profile.feedback || '');
      // Start with avatar selector collapsed if user already has an avatar
      setShowAvatarSelector(false);
    } else if (!isAuthenticated) {
      // Guest mode - use guest avatar
      setAvatar(guestAvatar || '🦦');
      setUsername('');
      setBio('');
      setFeedback('');
      setShowAvatarSelector(false);
    }
  }, [profile, isAuthenticated, guestAvatar]);

  useEffect(() => {
    if (user && show) {
      loadBookmarkCount();
      loadCommentCount();
    }
  }, [user, show]);

  const loadBookmarkCount = async () => {
    try {
      const { bookmarks } = await getUserBookmarks(user.id);
      setBookmarkCount(bookmarks?.length || 0);
    } catch (error) {
      console.error('Error loading bookmark count:', error);
    }
  };

  const loadCommentCount = async () => {
    try {
      const { data, error } = await supabase
        .from('cipher_comments')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      setCommentCount(data?.length || 0);
    } catch (error) {
      console.error('Error loading comment count:', error);
      setCommentCount(0);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      // Guest mode - just save avatar to session
      if (setGuestAvatar) {
        setGuestAvatar(avatar);
      }
      setSuccess('Avatar updated for this session!');
      setTimeout(() => {
        onClose();
      }, 1000);
      return;
    }

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { profile: updatedProfile, error: updateError } = await updateUserProfile(user.id, {
        username: username.trim(),
        avatar_url: avatar,
        bio: bio.trim(),
        feedback: feedback.trim()
      });

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully!');
      refreshProfile();
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (newAvatar) => {
    setAvatar(newAvatar);
    if (!isAuthenticated && setGuestAvatar) {
      // Update guest avatar immediately
      setGuestAvatar(newAvatar);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{avatar}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isAuthenticated ? 'Edit Profile' : 'Guest Profile'}
          </h2>
          <p className="text-purple-200 text-sm">
            {isAuthenticated ? 'Customize your profile settings' : 'Change your avatar for this session'}
          </p>
          {isAuthenticated && (
            <div className="mt-2 flex items-center justify-center gap-4 text-purple-300 text-sm">
              {bookmarkCount > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-lg">🔖</span>
                  <span>{bookmarkCount} Bookmarked {bookmarkCount === 1 ? 'Cipher' : 'Ciphers'}</span>
                </div>
              )}
              {commentCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} className="text-blue-400" />
                  <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Avatar Selector - Collapsible */}
          <div>
            <button
              onClick={() => setShowAvatarSelector(!showAvatarSelector)}
              className="w-full flex items-center justify-between p-3 bg-purple-800/30 rounded-lg border border-purple-600/30 hover:bg-purple-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{avatar}</span>
                <span className="text-purple-200 font-medium">Change Avatar</span>
              </div>
              {showAvatarSelector ? <ChevronUp size={20} className="text-purple-300" /> : <ChevronDown size={20} className="text-purple-300" />}
            </button>
            {showAvatarSelector && (
              <div className="mt-3">
                <AvatarSelector currentAvatar={avatar} onSelect={handleAvatarChange} />
              </div>
            )}
          </div>

          {/* Username - Only for authenticated users */}
          {isAuthenticated && (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Choose a username"
                  maxLength={50}
                />
              </div>
            </div>
          )}

          {/* Bio - Only for authenticated users */}
          {isAuthenticated && (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Tell us about yourself..."
                rows="3"
                maxLength={200}
              />
              <div className="text-xs text-purple-300 mt-1 text-right">
                {bio.length}/200
              </div>
            </div>
          )}

          {/* Feedback/Feature Request - Only for authenticated users */}
          {isAuthenticated && (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Feedback & Feature Requests
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="Share your feedback, suggestions, or request new features..."
                rows="4"
                maxLength={500}
              />
              <div className="text-xs text-purple-300 mt-1 text-right">
                {feedback.length}/500
              </div>
            </div>
          )}

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 text-green-200 text-sm">
              {success}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading || (isAuthenticated && !username.trim())}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : isAuthenticated ? 'Save Profile' : 'Save Avatar'}
          </button>
          
          {/* Sign In Button for Guests */}
          {!isAuthenticated && (
            <>
              <button
                onClick={() => {
                  onClose();
                  if (onSignInClick) {
                    setTimeout(() => onSignInClick(), 100);
                  }
                }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Sign In to Save Permanently
              </button>
              
              {/* Informational Box for Guests - After Save Button */}
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
                <p className="text-yellow-200 text-sm font-semibold mb-2">🔐 Sign in to unlock more features!</p>
                <ul className="text-yellow-100 text-xs text-left space-y-1 list-disc list-inside">
                  <li>Keep your avatar permanently</li>
                  <li>Add comments on ciphers</li>
                  <li>Bookmark your favorite ciphers</li>
                  <li>Like/dislike explanations and notes</li>
                  <li>Track your progress</li>
                  <li>Earn achievements</li>
                  <li>Save personal notes</li>
                  <li>View your bookmarks filter</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;

