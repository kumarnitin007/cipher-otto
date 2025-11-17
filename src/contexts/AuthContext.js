/**
 * Authentication Context
 * 
 * Provides authentication state and functions throughout the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUp as supabaseSignUp, 
  signIn as supabaseSignIn, 
  signOut as supabaseSignOut,
  getCurrentUser,
  onAuthStateChange
} from '../services/supabase/auth';
import { getUserProfile } from '../services/supabase/profiles';
import { isSupabaseConfigured } from '../services/supabase/client';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    // Only try to load user if Supabase is configured
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    loadUser();

    // Listen for auth state changes
    try {
      const { data: { subscription } } = onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { user: currentUser } = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await loadProfile(currentUser.id);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (userId) => {
    try {
      const { profile: userProfile } = await getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email, password, username) => {
    if (!isSupabaseConfigured) {
      return { user: null, error: new Error('Supabase is not configured. Please set up your environment variables.') };
    }

    try {
      const { user: newUser, error } = await supabaseSignUp(email, password, username);
      if (error) throw error;
      
      if (newUser) {
        setUser(newUser);
        // Profile will be created automatically by database trigger
        // Reload profile after a short delay
        setTimeout(() => loadProfile(newUser.id), 1000);
      }
      
      return { user: newUser, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error };
    }
  };

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      return { user: null, error: new Error('Supabase is not configured. Please set up your environment variables.') };
    }

    try {
      const { user: signedInUser, error } = await supabaseSignIn(email, password);
      if (error) throw error;
      
      if (signedInUser) {
        setUser(signedInUser);
        await loadProfile(signedInUser.id);
      }
      
      return { user: signedInUser, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      return { error: null };
    }

    try {
      const { error } = await supabaseSignOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      
      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    refreshProfile: () => user && loadProfile(user.id)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

