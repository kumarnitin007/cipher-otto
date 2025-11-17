/**
 * Notes Editor Component
 * 
 * Allows users to add/edit personal notes for ciphers
 */

import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCipherNote, saveNote, deleteNote } from '../services/supabase/notes';

const NotesEditor = ({ cipherId }) => {
  const { user, isAuthenticated, profile } = useAuth();
  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadNote();
    }
  }, [cipherId, user]);

  const loadNote = async () => {
    try {
      const { note: cipherNote } = await getCipherNote(cipherId, user.id);
      if (cipherNote) {
        setNote(cipherNote.note_text);
        setSavedNote(cipherNote);
      } else {
        setNote('');
        setSavedNote(null);
      }
    } catch (error) {
      console.error('Error loading note:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save notes');
      return;
    }

    if (!note.trim()) {
      alert('Note cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const { note: saved, error } = await saveNote(cipherId, user.id, note.trim());
      if (error) throw error;
      
      setSavedNote(saved);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    setLoading(true);
    try {
      const { error } = await deleteNote(cipherId, user.id);
      if (error) throw error;
      
      setNote('');
      setSavedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="text-purple-200 text-sm text-center py-2">
        📝 Sign in to save personal notes for this cipher
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{profile?.avatar_url || '📝'}</span>
          <h3 className="text-lg font-semibold text-white">Personal Notes</h3>
        </div>
        {savedNote && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add your personal notes about this cipher..."
        className="w-full px-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        rows="6"
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={handleSave}
          disabled={saving || !note.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Note'}</span>
        </button>
      </div>

      {savedNote && (
        <div className="mt-2 text-xs text-purple-300">
          Last saved: {new Date(savedNote.updated_at).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default NotesEditor;

