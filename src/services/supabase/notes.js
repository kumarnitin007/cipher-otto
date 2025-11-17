/**
 * User Notes Service
 * 
 * Handles personal notes operations:
 * - Get note for a cipher
 * - Save/update note
 * - Delete note
 * - Get all user notes
 */

import { supabase } from './client';

/**
 * Get user's note for a specific cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{note, error}>}
 */
export const getCipherNote = async (cipherId, userId) => {
  try {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return { note: data || null, error: null };
  } catch (error) {
    console.error('Get cipher note error:', error);
    return { note: null, error };
  }
};

/**
 * Get all notes for a user
 * @param {string} userId - User ID
 * @returns {Promise<{notes, error}>}
 */
export const getUserNotes = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { notes: data || [], error: null };
  } catch (error) {
    console.error('Get user notes error:', error);
    return { notes: [], error };
  }
};

/**
 * Save or update a note for a cipher
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @param {string} noteText - Note text
 * @returns {Promise<{note, error}>}
 */
export const saveNote = async (cipherId, userId, noteText) => {
  try {
    // Check if note exists
    const { data: existing } = await supabase
      .from('user_notes')
      .select('id')
      .eq('cipher_id', cipherId)
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      // Update existing note
      const { data, error } = await supabase
        .from('user_notes')
        .update({ note_text: noteText })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new note
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          cipher_id: cipherId,
          user_id: userId,
          note_text: noteText
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return { note: result, error: null };
  } catch (error) {
    console.error('Save note error:', error);
    return { note: null, error };
  }
};

/**
 * Delete a note
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @returns {Promise<{error}>}
 */
export const deleteNote = async (cipherId, userId) => {
  try {
    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('cipher_id', cipherId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete note error:', error);
    return { error };
  }
};

