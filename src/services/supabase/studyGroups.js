/**
 * Study Groups Service (Otter Families)
 * 
 * Handles study group operations:
 * - Get study groups
 * - Create study group
 * - Join/leave group
 * - Get group members
 * - Share notes in group
 */

import { supabase } from './client';

// Fun otter-related group name suggestions
export const OTTER_GROUP_NAMES = [
  'The Otter Pod',
  'River Otter Raft',
  'Sea Otter Colony',
  'The Otter Family',
  'Otter Squad',
  'The Otter Clan',
  'Otter Academy',
  'The Otter Den',
  'Otter Scholars',
  'The Otter Crew',
  'Otter Learners',
  'The Otter Pack',
  'Otter Explorers',
  'The Otter Tribe',
  'Otter Masters',
  'The Otter Circle',
  'Otter Students',
  'The Otter Guild',
  'Otter Cryptographers',
  'The Otter League'
];

/**
 * Get all public study groups
 * @param {number} limit - Number of groups to return
 * @returns {Promise<{groups, error}>}
 */
export const getStudyGroups = async (limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('study_groups')
      .select(`
        *,
        created_by_profile:user_profiles!created_by (
          id,
          username,
          avatar_url
        ),
        study_group_members (
          user_id
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Get study groups error:', error);
      // Try a simpler query if the join fails
      const { data: simpleData, error: simpleError } = await supabase
        .from('study_groups')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (simpleError) throw simpleError;

      // Fetch member counts separately
      const groupsWithMembers = await Promise.all(
        (simpleData || []).map(async (group) => {
          const { data: members } = await supabase
            .from('study_group_members')
            .select('user_id')
            .eq('group_id', group.id);

          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id, username, avatar_url')
            .eq('id', group.created_by)
            .single();

          return {
            ...group,
            created_by_profile: profile || null,
            memberCount: members?.length || 0
          };
        })
      );

      return { groups: groupsWithMembers, error: null };
    }

    // Add member count
    const groups = (data || []).map(group => ({
      ...group,
      memberCount: group.study_group_members?.length || 0
    }));

    return { groups, error: null };
  } catch (error) {
    console.error('Get study groups error:', error);
    return { groups: [], error };
  }
};

/**
 * Get user's study groups
 * @param {string} userId - User ID
 * @returns {Promise<{groups, error}>}
 */
export const getUserStudyGroups = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('study_group_members')
      .select(`
        *,
        study_group:study_groups (
          *,
          created_by_profile:user_profiles!created_by (
            id,
            username,
            avatar_url
          )
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Get user study groups error:', error);
      // Try simpler query if join fails
      const { data: simpleData, error: simpleError } = await supabase
        .from('study_group_members')
        .select('*')
        .eq('user_id', userId);

      if (simpleError) throw simpleError;

      // Fetch group details separately
      const groupsWithDetails = await Promise.all(
        (simpleData || []).map(async (member) => {
          const { data: group } = await supabase
            .from('study_groups')
            .select('*')
            .eq('id', member.group_id)
            .single();

          return {
            ...member,
            study_group: group || null
          };
        })
      );

      return { groups: groupsWithDetails, error: null };
    }

    return { groups: data || [], error: null };
  } catch (error) {
    console.error('Get user study groups error:', error);
    return { groups: [], error };
  }
};

/**
 * Create a study group
 * @param {string} userId - User ID (creator)
 * @param {string} name - Group name
 * @param {string} description - Group description
 * @param {boolean} isPublic - Is group public
 * @returns {Promise<{group, error}>}
 */
export const createStudyGroup = async (userId, name, description = '', isPublic = true) => {
  try {
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .insert({
        name,
        description,
        created_by: userId,
        is_public: isPublic
      })
      .select()
      .single();

    if (groupError) throw groupError;

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: group.id,
        user_id: userId,
        role: 'owner'
      });

    if (memberError) throw memberError;

    return { group, error: null };
  } catch (error) {
    console.error('Create study group error:', error);
    return { group: null, error };
  }
};

/**
 * Join a study group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @returns {Promise<{membership, error}>}
 */
export const joinStudyGroup = async (groupId, userId) => {
  try {
    const { data, error } = await supabase
      .from('study_group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: 'member'
      })
      .select()
      .single();

    if (error) throw error;
    return { membership: data, error: null };
  } catch (error) {
    console.error('Join study group error:', error);
    return { membership: null, error };
  }
};

/**
 * Leave a study group
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID
 * @returns {Promise<{error}>}
 */
export const leaveStudyGroup = async (groupId, userId) => {
  try {
    const { error } = await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Leave study group error:', error);
    return { error };
  }
};

/**
 * Get group members
 * @param {string} groupId - Group ID
 * @returns {Promise<{members, error}>}
 */
export const getGroupMembers = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from('study_group_members')
      .select(`
        *,
        user_profile:user_profiles!inner (
          id,
          username,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return { members: data || [], error: null };
  } catch (error) {
    console.error('Get group members error:', error);
    return { members: [], error };
  }
};

/**
 * Share a note in a study group
 * @param {string} groupId - Group ID
 * @param {string} cipherId - Cipher ID
 * @param {string} userId - User ID
 * @param {string} noteText - Note text
 * @returns {Promise<{note, error}>}
 */
export const shareNoteInGroup = async (groupId, cipherId, userId, noteText) => {
  try {
    const { data, error } = await supabase
      .from('group_shared_notes')
      .insert({
        group_id: groupId,
        cipher_id: cipherId,
        user_id: userId,
        note_text: noteText
      })
      .select()
      .single();

    if (error) throw error;
    return { note: data, error: null };
  } catch (error) {
    console.error('Share note in group error:', error);
    return { note: null, error };
  }
};

/**
 * Get shared notes for a cipher in a group
 * @param {string} groupId - Group ID
 * @param {string} cipherId - Cipher ID
 * @returns {Promise<{notes, error}>}
 */
export const getGroupSharedNotes = async (groupId, cipherId) => {
  try {
    const { data, error } = await supabase
      .from('group_shared_notes')
      .select(`
        *,
        user_profile:user_profiles!inner (
          id,
          username,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .eq('cipher_id', cipherId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { notes: data || [], error: null };
  } catch (error) {
    console.error('Get group shared notes error:', error);
    return { notes: [], error };
  }
};

/**
 * Delete a study group (only by creator)
 * @param {string} groupId - Group ID
 * @param {string} userId - User ID (must be the creator)
 * @returns {Promise<{error}>}
 */
export const deleteStudyGroup = async (groupId, userId) => {
  try {
    // First verify the user is the creator
    const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('created_by')
      .eq('id', groupId)
      .single();

    if (fetchError) throw fetchError;
    
    if (group.created_by !== userId) {
      throw new Error('Only the group creator can delete the group');
    }

    // Delete the group (cascade will delete members and shared notes)
    const { error } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Delete study group error:', error);
    return { error };
  }
};

