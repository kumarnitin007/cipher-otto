/**
 * Study Groups Component (Otter Families)
 * 
 * Displays and manages study groups
 */

import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, UserMinus, FileText, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getStudyGroups, getUserStudyGroups, createStudyGroup, joinStudyGroup, leaveStudyGroup, deleteStudyGroup, OTTER_GROUP_NAMES } from '../services/supabase/studyGroups';

const StudyGroups = () => {
  const { user, isAuthenticated } = useAuth();
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadGroups();
      loadUserGroups();
    }
  }, [isAuthenticated, user]);

  const loadGroups = async () => {
    try {
      const { groups: publicGroups, error } = await getStudyGroups(20);
      if (error) {
        console.error('Error loading groups:', error);
        alert('Failed to load study groups: ' + (error.message || 'Unknown error'));
      } else {
        setGroups(publicGroups || []);
        console.log('Loaded groups:', publicGroups); // Debug log
      }
    } catch (error) {
      console.error('Error loading groups:', error);
      alert('Failed to load study groups: ' + (error.message || 'Unknown error'));
    }
  };

  const loadUserGroups = async () => {
    if (!user) return;
    try {
      const { groups: myGroups, error } = await getUserStudyGroups(user.id);
      if (error) {
        console.error('Error loading user groups:', error);
      } else {
        setUserGroups(myGroups || []);
        console.log('Loaded user groups:', myGroups); // Debug log
      }
    } catch (error) {
      console.error('Error loading user groups:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    setLoading(true);
    try {
      const { group, error } = await createStudyGroup(user.id, newGroupName.trim(), newGroupDescription.trim(), true);
      if (error) throw error;

      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateModal(false);
      loadGroups();
      loadUserGroups();
      alert('Study group created successfully!');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    // Double-check user is not already a member
    if (isUserInGroup(groupId)) {
      alert('You are already a member of this group!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await joinStudyGroup(groupId, user.id);
      if (error) {
        // Check if it's a duplicate key error
        if (error.message && error.message.includes('duplicate key')) {
          // User is already a member, refresh the list
          await loadUserGroups();
          alert('You are already a member of this group!');
        } else {
          throw error;
        }
      } else {
        await loadGroups();
        await loadUserGroups();
        alert('Joined study group!');
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to leave this study group?')) return;

    setLoading(true);
    try {
      const { error } = await leaveStudyGroup(groupId, user.id);
      if (error) throw error;

      loadGroups();
      loadUserGroups();
      alert('Left study group');
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave group: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this study group? This action cannot be undone and will remove all members and shared notes.')) return;

    setLoading(true);
    try {
      const { error } = await deleteStudyGroup(groupId, user.id);
      if (error) throw error;

      loadGroups();
      loadUserGroups();
      alert('Study group deleted successfully');
    } catch (error) {
      console.error('Error deleting group:', error);
      alert('Failed to delete group: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const isUserInGroup = (groupId) => {
    // Check if user is in the group by checking userGroups array
    const isMember = userGroups.some(ug => {
      // Handle both nested structure (from getUserStudyGroups) and flat structure
      const groupIdToCheck = ug.study_group?.id || ug.group_id || ug.id;
      return groupIdToCheck === groupId;
    });
    console.log('Checking membership for group', groupId, 'isMember:', isMember, 'userGroups:', userGroups); // Debug log
    return isMember;
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
        <div className="text-blue-200 text-sm text-center py-4">
          Sign in to join or create study groups (Otter Families)!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="text-blue-300" size={24} />
          <h3 className="text-lg font-bold text-white">Study Groups (Otter Families)</h3>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-all"
        >
          <Plus size={18} />
          Create
        </button>
      </div>

      {showCreateModal && (
        <div className="mb-4 p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <h4 className="text-white font-semibold mb-3">Create New Study Group</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-blue-200 mb-1">Group Name</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="e.g., The Otter Pod"
                className="w-full px-3 py-2 bg-blue-800/50 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
              <div className="text-xs text-blue-300 mt-1">
                Suggestions: {OTTER_GROUP_NAMES.slice(0, 5).join(', ')}...
              </div>
            </div>
            <div>
              <label className="block text-sm text-blue-200 mb-1">Description (Optional)</label>
              <textarea
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Describe your study group..."
                className="w-full px-3 py-2 bg-blue-800/50 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
                maxLength={200}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateGroup}
                disabled={loading || !newGroupName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewGroupName('');
                  setNewGroupDescription('');
                }}
                className="px-4 py-2 bg-blue-800/50 hover:bg-blue-800/70 rounded-lg text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-blue-200 text-sm text-center py-4">
          No study groups yet. Create the first one!
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => {
            const isMember = isUserInGroup(group.id);
            return (
              <div key={group.id} className="bg-blue-900/20 rounded-lg border border-blue-500/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🦦</span>
                      <h4 className="text-white font-semibold">{group.name}</h4>
                      {group.created_by === user?.id && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Owner</span>
                      )}
                    </div>
                    {group.description && (
                      <p className="text-blue-200 text-xs mb-2">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-blue-300 text-xs">
                      <span>{group.memberCount || 0} members</span>
                      <span>Created by {group.created_by_profile?.username || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                      className="p-2 hover:bg-blue-800/50 rounded-lg transition-colors"
                      title="Expand/Collapse group details"
                    >
                      {expandedGroup === group.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {group.created_by === user?.id ? (
                      <>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          disabled={loading}
                          className="p-2 hover:bg-red-500/50 rounded-lg text-red-300 hover:text-red-200 transition-all disabled:opacity-50"
                          title="Delete this study group (only group creator can delete)"
                        >
                          <Trash2 size={18} />
                        </button>
                        <span className="text-xs bg-blue-500 text-white px-3 py-2 rounded-lg">
                          Owner
                        </span>
                      </>
                    ) : isMember ? (
                      <button
                        onClick={() => handleLeaveGroup(group.id)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-white text-sm transition-all disabled:opacity-50"
                      >
                        <UserMinus size={16} />
                        Leave
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={loading}
                        className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm transition-all disabled:opacity-50"
                      >
                        <UserPlus size={16} />
                        Join
                      </button>
                    )}
                  </div>
                </div>
                {expandedGroup === group.id && (
                  <div className="mt-3 pt-3 border-t border-blue-500/30">
                    <div className="text-blue-200 text-xs">
                      <FileText className="inline mr-1" size={14} />
                      Shared notes feature coming soon!
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyGroups;

