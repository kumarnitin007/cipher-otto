/**
 * Comments Section Component
 * 
 * Displays and manages comments for a cipher
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Edit2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCipherComments, addComment, updateComment, deleteComment } from '../services/supabase/comments';

const CommentsSection = ({ cipherId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
  }, [cipherId]);

  const loadComments = async () => {
    try {
      const { comments: cipherComments } = await getCipherComments(cipherId);
      setComments(cipherComments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setLoading(true);
    try {
      const { comment, error } = await addComment(cipherId, user.id, newComment.trim());
      if (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment: ' + (error.message || 'Unknown error'));
        return;
      }
      
      if (comment) {
        // Reload comments to get the full data with user profile
        await loadComments();
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    setLoading(true);
    try {
      const { comment, error } = await updateComment(commentId, editText.trim());
      if (error) throw error;
      
      if (comment) {
        setComments(comments.map(c => c.id === commentId ? comment : c));
        setEditingId(null);
        setEditText('');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setLoading(true);
    try {
      const { error } = await deleteComment(commentId);
      if (error) throw error;
      
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="text-purple-300" size={20} />
        <h3 className="text-lg font-semibold text-white">Comments ({comments.length})</h3>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleAddComment} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-4 p-3 bg-purple-800/30 rounded-lg text-purple-200 text-sm text-center">
          Sign in to add comments
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center text-purple-300 py-8">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => {
            const isOwner = user && comment.user_id === user.id;
            const isEditing = editingId === comment.id;

            return (
              <div key={comment.id} className="bg-purple-800/30 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-lg">
                      {comment.user_profiles?.avatar_url ? (
                        comment.user_profiles.avatar_url.startsWith('http') ? (
                          <img src={comment.user_profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{comment.user_profiles.avatar_url}</span>
                        )
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {comment.user_profiles?.username || 'Anonymous'}
                      </div>
                      <div className="text-purple-300 text-xs">
                        {formatDate(comment.created_at)}
                      </div>
                    </div>
                  </div>
                  {isOwner && !isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.comment_text);
                        }}
                        className="text-purple-300 hover:text-white transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full px-3 py-2 bg-purple-900/50 border border-purple-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditText('');
                        }}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-purple-100 text-sm">{comment.comment_text}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentsSection;

