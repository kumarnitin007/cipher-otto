/**
 * ============================================================================
 * Cipher Otto - Main Application Component
 * ============================================================================
 * 
 * This is the main entry point for the Cipher Otto application, an educational
 * cryptography learning platform featuring Otto the Otter as a friendly guide.
 * 
 * Features:
 * - Learn Mode: Interactive cipher experimentation with encryption/decryption
 * - Practice Mode: Challenge-based learning with scoring and achievements
 * - Multiple Ciphers: Support for 20+ cipher types (Caesar, Vigenere, RSA, etc.)
 * - User Authentication: Sign in to track progress, earn achievements, and join study groups
 * - Community Features: Comments, leaderboards, bookmarks, and collaborative learning
 * - Filtering System: Filter ciphers by difficulty, competition level, historical period, or bookmarks
 * 
 * Architecture:
 * - State Management: Uses React hooks for local state management
 * - Authentication: Integrated with Supabase for user management
 * - Components: Modular component structure for maintainability
 * - Cipher Processing: Routes to appropriate cipher algorithms based on selection
 * 
 * @component
 * @fileoverview Main application orchestrator that manages all app state and UI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, BookOpen, Trophy, Heart, Coffee, DollarSign, ChevronDown, ChevronUp, Info, Copy, Check, Sparkles, Star, History, BarChart3, Search, Share2, Bookmark, X, Zap, RotateCcw, Users, MessageSquare } from 'lucide-react';

// Import modular components and utilities
import AnimatedOtter from './components/AnimatedOtter';
import AboutOttoModal from './components/AboutOttoModal';
import CipherSelector from './components/CipherSelector';
import { cipherAlgorithms } from './ciphers';
import { categories, getDifficultyColor, getDifficultyBadge, competitionLevels, getCompetitionColor, getCompetitionBadge, difficultyLevels, historicalPeriods, getHistoricalPeriodColor } from './utils/helpers';
import { getOttosNotes } from './utils/ottosNotes';

// Import Supabase features
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import CommentsSection from './components/CommentsSection';
import LikeDislikeButton from './components/LikeDislikeButton';
import BookmarkButton from './components/BookmarkButton';
import NotesLikeDislike from './components/NotesLikeDislike';
import NotesEditor from './components/NotesEditor';
import ProgressTracker from './components/ProgressTracker';
import AchievementsBadge from './components/AchievementsBadge';
import UserProfileModal from './components/UserProfileModal';
import StreakTracker from './components/StreakTracker';
import Leaderboard from './components/Leaderboard';
import StudyGroups from './components/StudyGroups';
import CipherInputs from './components/CipherInputs';
import PracticeTab from './components/PracticeTab';
import OttosNotesRenderer from './components/OttosNotesRenderer';
import { updateProgress, markCompleted } from './services/supabase/progress';
import { checkAndUnlockAchievements } from './services/supabase/achievements';
import { updateStreak } from './services/supabase/streaks';

// ============================================================================
// Main App Component
// ============================================================================
/**
 * Main Cipher Otto Application Component
 * 
 * Manages all application state and UI logic:
 * - Tab navigation (Learn vs Practice)
 * - Cipher selection and processing
 * - Cipher-specific parameters (keywords, shifts, etc.)
 * - Practice mode challenges and scoring
 * - UI state (modals, info panels, etc.)
 */
const CipherOtto = () => {
  // ========================================================================
  // Authentication
  // ========================================================================
  const { user, isAuthenticated, signOut, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [guestAvatar, setGuestAvatar] = useState('🦦'); // Guest avatar (session-only)
  
  // ========================================================================
  // Core Application State
  // ========================================================================
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' or 'practice'
  const [selectedCipher, setSelectedCipher] = useState('caesar'); // Currently selected cipher key
  const [inputText, setInputText] = useState(''); // User input text
  const [outputText, setOutputText] = useState(''); // Encrypted/decrypted result
  const [mode, setMode] = useState('encrypt'); // 'encrypt' or 'decrypt'
  const [copied, setCopied] = useState(false); // Clipboard copy feedback state
  
  // ========================================================================
  // Cipher-Specific Parameters State
  // ========================================================================
  // Caesar Cipher
  const [caesarShift, setCaesarShift] = useState(3); // Shift amount (0-25)
  
  // Affine Cipher
  const [affineA, setAffineA] = useState(5); // Multiplier (must be coprime with 26)
  const [affineB, setAffineB] = useState(8); // Shift amount (0-25)
  
  // Keyword-based ciphers
  const [columnarKeyword, setColumnarKeyword] = useState('CRYPTO');
  const [checkerboardKey, setCheckerboardKey] = useState('CRYPTO');
  const [checkerboardBlanks, setCheckerboardBlanks] = useState('2,6'); // Blank positions
  const [nihilistKeyword, setNihilistKeyword] = useState('CRYPTO');
  const [nihilistPolybiusKey, setNihilistPolybiusKey] = useState('CRYPTO');
  const [portaKeyword, setPortaKeyword] = useState('CRYPTO');
  const [fractionatedMorseKeyword, setFractionatedMorseKeyword] = useState('CRYPTO');
  const [xenocryptKeyword, setXenocryptKeyword] = useState('CRYPTO');
  const [vigenereKeyword, setVigenereKeyword] = useState('KEY');
  
  // Cryptarithm Cipher
  const [cryptarithmEquation, setCryptarithmEquation] = useState('SEND + MORE = MONEY');
  const [cryptarithmMapping, setCryptarithmMapping] = useState('S=9,E=5,N=6,D=7,M=1,O=0,R=8,Y=2');
  const [cryptarithmValidation, setCryptarithmValidation] = useState(null); // Validation result object
  
  // Rail Fence Cipher
  const [railfenceRails, setRailfenceRails] = useState(3); // Number of rails (2-10)
  
  // RSA Cipher (simplified)
  const [rsaPublicKey, setRsaPublicKey] = useState({ n: 33, e: 3 }); // Public key (n, e)
  const [rsaPrivateKey, setRsaPrivateKey] = useState({ n: 33, d: 7 }); // Private key (n, d)
  
  // ========================================================================
  // Practice Mode State
  // ========================================================================
  const [practiceChallenge, setPracticeChallenge] = useState(null); // Current challenge object
  const [userAnswer, setUserAnswer] = useState(''); // User's answer input
  const [score, setScore] = useState(0); // Total points earned
  
  // ========================================================================
  // UI State
  // ========================================================================
  const [showAboutModal, setShowAboutModal] = useState(false); // About Otto modal visibility
  const [showCipherInfo, setShowCipherInfo] = useState(false); // Cipher info panel expanded state
  const [showTutorial, setShowTutorial] = useState(false); // Tutorial panel expanded state
  const [showNotes, setShowNotes] = useState(false); // Expert & Otto's Notes panel expanded state
  const [showCommunity, setShowCommunity] = useState(false); // Community section (Comments, Leaderboard, Groups)
  const [activeFilterType, setActiveFilterType] = useState('competition'); // Active filter type: 'competition', 'difficulty', 'historical', 'bookmarks'
  const [competitionLevelFilter, setCompetitionLevelFilter] = useState('divisionB'); // Competition level filter: 'all', 'divisionA', 'divisionB', 'divisionC', 'open'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // Difficulty level filter: 'all', 'beginner', 'intermediate', 'advanced'
  const [historicalPeriodFilter, setHistoricalPeriodFilter] = useState('all'); // Historical period filter: 'all', 'ancient', 'medieval', 'renaissance', 'modern', 'contemporary'
  const [bookmarkedCiphers, setBookmarkedCiphers] = useState([]); // List of bookmarked cipher IDs
  
  // Load bookmarked ciphers when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadBookmarkedCiphers();
    } else {
      setBookmarkedCiphers([]);
    }
  }, [isAuthenticated, user]);
  
  const loadBookmarkedCiphers = async () => {
    try {
      const { getUserBookmarks } = await import('./services/supabase/bookmarks');
      const { bookmarks } = await getUserBookmarks(user.id);
      setBookmarkedCiphers(bookmarks.map(b => b.cipher_id));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };
  
  // When switching filter types, reset other filters to 'all'
  const handleFilterTypeChange = (newFilterType) => {
    if (newFilterType === 'bookmarks' && !isAuthenticated) {
      return; // Don't allow bookmarks filter for guests
    }
    setActiveFilterType(newFilterType);
    if (newFilterType !== 'competition') {
      setCompetitionLevelFilter('all');
    }
    if (newFilterType !== 'difficulty') {
      setDifficultyFilter('all');
    }
    if (newFilterType !== 'historical') {
      setHistoricalPeriodFilter('all');
    }
    if (newFilterType === 'bookmarks' && isAuthenticated) {
      loadBookmarkedCiphers(); // Refresh bookmarks when switching to bookmarks filter
    }
  };
  
  // If selected cipher doesn't match the active filter, reset to default
  useEffect(() => {
    const currentCipher = cipherAlgorithms[selectedCipher];
    if (!currentCipher) return;
    
    // Check if current cipher matches the active filter
    let matchesFilter = true;
    if (activeFilterType === 'competition') {
      matchesFilter = competitionLevelFilter === 'all' || currentCipher.competitionLevel === competitionLevelFilter;
    } else if (activeFilterType === 'difficulty') {
      matchesFilter = difficultyFilter === 'all' || currentCipher.difficulty === difficultyFilter;
    } else if (activeFilterType === 'historical') {
      matchesFilter = historicalPeriodFilter === 'all' || currentCipher.historicalPeriod === historicalPeriodFilter;
    } else if (activeFilterType === 'bookmarks') {
      matchesFilter = bookmarkedCiphers.includes(selectedCipher);
    }
    
    if (!matchesFilter) {
      // Find first cipher that matches the active filter
      const matchingCipher = Object.keys(cipherAlgorithms).find(key => {
        const cipher = cipherAlgorithms[key];
        if (activeFilterType === 'competition') {
          return competitionLevelFilter === 'all' || cipher.competitionLevel === competitionLevelFilter;
        } else if (activeFilterType === 'difficulty') {
          return difficultyFilter === 'all' || cipher.difficulty === difficultyFilter;
        } else if (activeFilterType === 'historical') {
          return historicalPeriodFilter === 'all' || cipher.historicalPeriod === historicalPeriodFilter;
        } else if (activeFilterType === 'bookmarks') {
          return bookmarkedCiphers.includes(key);
        }
        return true;
      });
      if (matchingCipher) {
        setSelectedCipher(matchingCipher);
      } else {
        setSelectedCipher('caesar');
      }
    }
  }, [activeFilterType, competitionLevelFilter, difficultyFilter, historicalPeriodFilter, selectedCipher]);
  
  
  /**
   * Main cipher processing function
   * Handles encryption/decryption based on selected cipher and mode
   * Routes to appropriate cipher implementation with required parameters
   */
  const processCipher = () => {
    const cipher = cipherAlgorithms[selectedCipher];
    if (!cipher) return; // Safety check: cipher must exist
    
    let result;
    // Route to appropriate cipher handler based on selected cipher
    // Each cipher may require different parameters (shift, keyword, matrix, etc.)
    if (selectedCipher === 'caesar') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, caesarShift) : cipher.decrypt(inputText, caesarShift);
    } else if (selectedCipher === 'affine') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, affineA, affineB) : cipher.decrypt(inputText, affineA, affineB);
    } else if (selectedCipher === 'nihilist') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, nihilistKeyword, nihilistPolybiusKey) : cipher.decrypt(inputText, nihilistKeyword, nihilistPolybiusKey);
    } else if (selectedCipher === 'columnar') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, columnarKeyword) : cipher.decrypt(inputText, columnarKeyword);
    } else if (selectedCipher === 'checkerboard') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, checkerboardKey, checkerboardBlanks) : cipher.decrypt(inputText);
    } else if (selectedCipher === 'porta') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, portaKeyword) : cipher.decrypt(inputText, portaKeyword);
    } else if (selectedCipher === 'fractionatedMorse') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, fractionatedMorseKeyword) : cipher.decrypt(inputText, fractionatedMorseKeyword);
    } else if (selectedCipher === 'xenocrypt') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, xenocryptKeyword) : cipher.decrypt(inputText, xenocryptKeyword);
    } else if (selectedCipher === 'railfence') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, railfenceRails) : cipher.decrypt(inputText, railfenceRails);
    } else if (selectedCipher === 'vigenere') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, vigenereKeyword) : cipher.decrypt(inputText, vigenereKeyword);
    } else if (selectedCipher === 'rsa') {
      result = mode === 'encrypt' ? cipher.encrypt(inputText, rsaPublicKey) : cipher.decrypt(inputText, rsaPrivateKey);
    } else if (selectedCipher === 'cryptarithm') {
      // Parse mapping string to object
      const mappingObj = {};
      cryptarithmMapping.split(',').forEach(pair => {
        const [letter, digit] = pair.split('=').map(s => s.trim());
        if (letter && digit) {
          mappingObj[letter.toUpperCase()] = digit;
        }
      });
      
      if (mode === 'encrypt') {
        // Use inputText if provided, otherwise use the equation
        const textToConvert = inputText.trim() || cryptarithmEquation;
        result = cipher.encrypt(textToConvert, mappingObj);
        
        // If it's an equation format, validate it
        if (textToConvert.includes('+') || textToConvert.includes('-') || textToConvert.includes('*') || textToConvert.includes('/') || textToConvert.includes('=')) {
          const validation = cipher.validateEquation(textToConvert, mappingObj);
          setCryptarithmValidation(validation);
        } else {
          setCryptarithmValidation(null);
        }
      } else {
        // Convert digits back to letters
        result = cipher.decrypt(inputText, mappingObj);
        setCryptarithmValidation(null);
      }
    } else {
      result = mode === 'encrypt' ? cipher.encrypt(inputText) : cipher.decrypt(inputText);
    }
    setOutputText(result);
  };
  
  /**
   * Copies the output text to clipboard
   * Shows a temporary "Copied!" feedback message
   */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };
  
  /**
   * Generates a practice challenge for the selected cipher
   * Creates an encrypted message with hints (keyword, shift, etc.)
   * User must decrypt the message to earn points
   */
  const generateChallenge = () => {
    // Predefined messages for practice challenges
    const messages = [
      'HELLO WORLD', 'CRYPTOGRAPHY IS FUN', 'BREAK THE CODE', 'SECRET MESSAGE',
      'OTTO THE OTTER', 'CIPHER CHALLENGE', 'LEARN TO ENCRYPT', 'HIDDEN TREASURE',
      'SPY ACADEMY', 'CODE BREAKER', 'MATH IS COOL', 'SECURITY FIRST',
      'PUZZLE MASTER', 'CRYPTO WIZARD', 'SECRET AGENT', 'DECODE THIS NOW'
    ];
    // Select a random message from the pool
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    const cipher = cipherAlgorithms[selectedCipher];
    
    // Variables to store challenge parameters (hints for the user)
    let encrypted, challengeKeyword, challengeShift, challengePolybiusKey;
    
    // Special handling for Cryptarithm
    if (selectedCipher === 'cryptarithm') {
      // For cryptarithm, show the equation with numbers and ask user to provide words
      const cryptarithmPuzzles = [
        { equation: 'SEND + MORE = MONEY', hint: '9567 + 1085 = ?', answer: 'MONEY', fullAnswer: '10652' },
        { equation: 'SEND + MORE = MONEY', hint: '???? + 1085 = 10652', answer: 'SEND', fullAnswer: '9567' },
        { equation: 'SEND + MORE = MONEY', hint: '9567 + ???? = 10652', answer: 'MORE', fullAnswer: '1085' },
        { equation: 'BASE + BALL = GAMES', hint: '7483 + 7455 = ?', answer: 'GAMES', fullAnswer: '14938', 
          mapping: { 'B':'7', 'A':'4', 'S':'8', 'E':'3', 'L':'5', 'G':'1', 'M':'9' } },
        { equation: 'CROSS + ROADS = DANGER', hint: '96255 + 62375 = ?', answer: 'DANGER', fullAnswer: '158630',
          mapping: { 'C':'9', 'R':'6', 'O':'2', 'S':'5', 'A':'7', 'D':'1', 'N':'8', 'G':'3', 'E':'0' } },
      ];
      
      const puzzle = cryptarithmPuzzles[Math.floor(Math.random() * cryptarithmPuzzles.length)];
      
      // Default mapping for SEND + MORE = MONEY if puzzle doesn't have one
      const defaultMapping = { 'S': '9', 'E': '5', 'N': '6', 'D': '7', 'M': '1', 'O': '0', 'R': '8', 'Y': '2' };
      
      setPracticeChallenge({
        original: puzzle.answer,
        encrypted: puzzle.hint,
        cipher: selectedCipher,
        equation: puzzle.equation,
        fullAnswer: puzzle.fullAnswer,
        mapping: puzzle.mapping || defaultMapping
      });
      setUserAnswer('');
      return;
    }
    
    if (selectedCipher === 'caesar') {
      challengeShift = Math.floor(Math.random() * 25) + 1;
      encrypted = cipher.encrypt(randomMsg, challengeShift);
    } else if (selectedCipher === 'affine') {
      const validA = [5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
      const challengeA = validA[Math.floor(Math.random() * validA.length)];
      const challengeB = Math.floor(Math.random() * 26);
      encrypted = cipher.encrypt(randomMsg, challengeA, challengeB);
      challengeKeyword = `a=${challengeA}, b=${challengeB}`;
    } else if (selectedCipher === 'columnar') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword);
    } else if (selectedCipher === 'porta') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword);
    } else if (selectedCipher === 'nihilist') {
      challengeKeyword = 'SECRET';
      challengePolybiusKey = 'CRYPTO';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword, challengePolybiusKey);
    } else if (selectedCipher === 'checkerboard') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword, '2,6');
    } else if (selectedCipher === 'fractionatedMorse') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword);
    } else if (selectedCipher === 'xenocrypt') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword);
    } else if (selectedCipher === 'railfence') {
      const challengeRails = Math.floor(Math.random() * 5) + 2; // 2-6 rails
      encrypted = cipher.encrypt(randomMsg, challengeRails);
      challengeKeyword = `Rails: ${challengeRails}`;
    } else if (selectedCipher === 'vigenere') {
      challengeKeyword = 'SECRET';
      encrypted = cipher.encrypt(randomMsg, challengeKeyword);
    } else if (selectedCipher === 'rsa') {
      encrypted = cipher.encrypt(randomMsg, rsaPublicKey);
      challengeKeyword = `RSA (n=${rsaPublicKey.n}, e=${rsaPublicKey.e})`;
    } else {
      encrypted = cipher.encrypt(randomMsg);
    }
    
    setPracticeChallenge({
      original: randomMsg,
      encrypted: encrypted,
      cipher: selectedCipher,
      keyword: challengeKeyword,
      polybiusKey: challengePolybiusKey,
      shift: challengeShift
    });
    setUserAnswer('');
  };
  
  /**
   * Validates user's answer in practice mode
   * Compares user input with correct answer and awards points
   * Special handling for cryptarithm puzzles (accepts both word and number)
   */
  const checkAnswer = () => {
    if (selectedCipher === 'cryptarithm') {
      // Cryptarithm accepts either the word (e.g., "MONEY") or the number (e.g., "10652")
      const userAnswerClean = userAnswer.toUpperCase().replace(/\s/g, '');
      const correctAnswer = practiceChallenge.original.toUpperCase().replace(/\s/g, '');
      const correctNumber = practiceChallenge.fullAnswer;
      
      if (userAnswerClean === correctAnswer || userAnswerClean === correctNumber) {
        const cipher = cipherAlgorithms[practiceChallenge.cipher];
        const points = cipher.difficulty === 'beginner' ? 5 : cipher.difficulty === 'intermediate' ? 10 : 15;
        setScore(score + points);
        alert(`🎉 Correct! The answer is ${practiceChallenge.original} = ${practiceChallenge.fullAnswer}. +${points} points`);
        
        // Track progress if user is authenticated
        if (isAuthenticated && user) {
          const practiceScore = Math.round((points / 15) * 100); // Convert to percentage
          updateProgress(practiceChallenge.cipher, user.id, {
            score: practiceScore,
            completed: practiceScore >= 100
          }).then(() => {
            // Check for achievements after progress update
            checkAndUnlockAchievements(user.id);
            // Update learning streak
            updateStreak(user.id);
          });
        }
        
        generateChallenge();
      } else {
        alert('❌ Not quite right. Try again!');
      }
    } else {
      if (userAnswer.toUpperCase().replace(/\s/g, '') === practiceChallenge.original.replace(/\s/g, '')) {
        const cipher = cipherAlgorithms[practiceChallenge.cipher];
        const points = cipher.difficulty === 'beginner' ? 5 : cipher.difficulty === 'intermediate' ? 10 : 15;
        setScore(score + points);
        alert(`🎉 Correct! +${points} points`);
        
        // Track progress if user is authenticated
        if (isAuthenticated && user) {
          const practiceScore = Math.round((points / 15) * 100); // Convert to percentage
          updateProgress(practiceChallenge.cipher, user.id, {
            score: practiceScore,
            completed: practiceScore >= 100
          }).then(() => {
            // Check for achievements after progress update
            checkAndUnlockAchievements(user.id);
            // Update learning streak
            updateStreak(user.id);
          });
        }
        
        generateChallenge();
      } else {
        alert('❌ Not quite right. Try again!');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <AnimatedOtter />
          <h1 className="text-5xl font-bold mb-2 mt-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Cipher Otto
          </h1>
          <p className="text-purple-200 text-lg">Master Cryptography with Otto!</p>
          <div className="text-center mt-2 mb-2">
            <button
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
              title={isAuthenticated ? "👤 View your profile! See your achievements, streaks, progress, and customize your avatar!" : "🦦 Click to sign in or customize your guest avatar! Otto wants to get to know you better!"}
            >
              <span className="text-3xl">{isAuthenticated && profile?.avatar_url ? profile.avatar_url : guestAvatar}</span>
              <p className="text-purple-300 text-sm font-semibold">
                {isAuthenticated && profile ? `Welcome ${profile.username || user?.email?.split('@')[0] || 'User'}!` : "Welcome Otto's Guest!"}
              </p>
            </button>
          </div>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 flex items-center gap-2 border border-white/20 shadow-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-lg">{score}</span>
              <span className="text-sm text-purple-200">points</span>
            </div>
            {isAuthenticated && <AchievementsBadge />}
            {isAuthenticated && <StreakTracker />}
            {isAuthenticated ? (
              <button 
                onClick={signOut} 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full px-5 py-2 flex items-center gap-2 font-semibold transition-all shadow-lg transform hover:scale-105"
                title="👋 Sign out and come back soon! Otto will miss you, but your progress is saved!"
              >
                <span>Sign Out</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-full px-5 py-2 flex items-center gap-2 font-semibold transition-all shadow-lg transform hover:scale-105"
                title="🦦 Sign in to unlock all of Otto's features! Track progress, earn achievements, join study groups, and more!"
              >
                <span>Sign In</span>
              </button>
            )}
            <button 
              onClick={() => setShowAboutModal(true)} 
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full px-5 py-2 flex items-center gap-2 font-semibold transition-all shadow-lg transform hover:scale-105"
              title="🦦 Learn about Otto and discover other apps in the family!"
            >
              <Heart className="w-5 h-5" />
              About Otto
            </button>
          </div>
        </div>

        <AboutOttoModal show={showAboutModal} onClose={() => setShowAboutModal(false)} />
        <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
        <UserProfileModal 
          show={showProfileModal} 
          onClose={() => setShowProfileModal(false)}
          guestAvatar={guestAvatar}
          setGuestAvatar={setGuestAvatar}
          onSignInClick={() => setShowAuthModal(true)}
        />

        {/* Combined Filter Box */}
        <div className="mb-4 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-500/30">
          {/* Filter Type Selector Row */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xl">
                {activeFilterType === 'competition' && '🏅'}
                {activeFilterType === 'difficulty' && '⭐'}
                {activeFilterType === 'historical' && '📜'}
                {activeFilterType === 'bookmarks' && '🔖'}
              </div>
              <div className="font-bold text-sm text-indigo-100">
                Filter By: {activeFilterType === 'competition' && 'Competition Level Filter'}
                {activeFilterType === 'difficulty' && 'Difficulty Level Filter'}
                {activeFilterType === 'historical' && 'Historical Period Filter'}
                {activeFilterType === 'bookmarks' && 'My Bookmarks'}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterTypeChange('competition')}
                className={`px-3 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  activeFilterType === 'competition'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="🏅 Filter by competition level! Perfect for students preparing for crypto competitions. Otto helps you find Division A, B, or C ciphers!"
              >
                <span className="text-sm sm:text-base">🏅</span>
                <span className="truncate max-w-[70px] sm:max-w-none">Competition</span>
              </button>
              <button
                onClick={() => handleFilterTypeChange('difficulty')}
                className={`px-3 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  activeFilterType === 'difficulty'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="⭐ Filter by difficulty! Start with Beginner ciphers and work your way up to Advanced. Otto believes in you! 🌱→🏆"
              >
                <span className="text-sm sm:text-base">⭐</span>
                <span className="truncate max-w-[70px] sm:max-w-none">Difficulty</span>
              </button>
              <button
                onClick={() => handleFilterTypeChange('historical')}
                className={`px-3 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  activeFilterType === 'historical'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="📜 Filter by historical period! Travel through time with Otto and discover how ciphers evolved from ancient times to modern day!"
              >
                <span className="text-sm sm:text-base">📜</span>
                <span className="truncate max-w-[70px] sm:max-w-none">Historical</span>
              </button>
              <button
                onClick={() => handleFilterTypeChange('bookmarks')}
                disabled={!isAuthenticated}
                className={`px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                  !isAuthenticated
                    ? 'bg-white/5 text-white/50 cursor-not-allowed opacity-50'
                    : activeFilterType === 'bookmarks'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg transform hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white transform hover:scale-105'
                }`}
                title={
                  !isAuthenticated
                    ? "🦦 If you're logged in, Otto can help you define and use bookmarks! Sign in to save your favorite ciphers!"
                    : `My Bookmarks (${bookmarkedCiphers.length})`
                }
              >
                <span className="text-sm sm:text-base">🔖</span>
                <span className="truncate max-w-[70px] sm:max-w-none">My Bookmarks</span>
              </button>
            </div>
          </div>

          {/* Competition Level Filter Row */}
          {activeFilterType === 'competition' && (
            <div className="border-t border-indigo-500/30 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCompetitionLevelFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    competitionLevelFilter === 'all'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="🌐 Show all competition ciphers! Otto wants you to explore everything!"
                >
                  All Ciphers
                </button>
                {Object.entries(competitionLevels).map(([key, level]) => (
                  <button
                    key={key}
                    onClick={() => setCompetitionLevelFilter(key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                      competitionLevelFilter === key
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                        : `bg-white/10 hover:bg-white/20 ${getCompetitionColor(key)}`
                    }`}
                  >
                    <span>{level.icon}</span>
                    <span>{level.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-blue-200/80 mt-2">
                Filter ciphers by competition difficulty level. Perfect for students preparing for cryptography competitions!
              </div>
            </div>
          )}

          {/* Difficulty Level Filter Row */}
          {activeFilterType === 'difficulty' && (
            <div className="border-t border-indigo-500/30 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setDifficultyFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    difficultyFilter === 'all'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="🌐 Show all difficulty levels! From beginner to advanced, Otto has something for everyone!"
                >
                  All Levels
                </button>
                {Object.entries(difficultyLevels).map(([key, level]) => (
                  <button
                    key={key}
                    onClick={() => setDifficultyFilter(key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                      difficultyFilter === key
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                        : `bg-white/10 hover:bg-white/20 ${getDifficultyColor(key)}`
                    }`}
                  >
                    <span>{level.icon}</span>
                    <span>{level.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-green-200/80 mt-2">
                Filter ciphers by difficulty level. Start with Beginner and work your way up!
              </div>
            </div>
          )}

          {/* Historical Period Filter Row */}
          {activeFilterType === 'historical' && (
            <div className="border-t border-indigo-500/30 pt-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setHistoricalPeriodFilter('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    historicalPeriodFilter === 'all'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                  title="🌐 Show all historical periods! Travel through time with Otto from ancient to modern ciphers!"
                >
                  All Periods
                </button>
                {Object.entries(historicalPeriods).map(([key, period]) => (
                  <button
                    key={key}
                    onClick={() => setHistoricalPeriodFilter(key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 ${
                      historicalPeriodFilter === key
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 shadow-lg'
                        : `bg-white/10 hover:bg-white/20 ${getHistoricalPeriodColor(key)}`
                    }`}
                  >
                    <span>{period.icon}</span>
                    <span>{period.name}</span>
                  </button>
                ))}
              </div>
              <div className="text-xs text-amber-200/80 mt-2">
                Filter ciphers by historical period. Learn about the evolution of cryptography through the ages!
              </div>
            </div>
          )}

          {/* My Bookmarks Filter Row */}
          {activeFilterType === 'bookmarks' && isAuthenticated && (
            <div className="border-t border-indigo-500/30 pt-4">
              <div className="text-xs text-yellow-200/80 mb-2">
                Showing your bookmarked ciphers ({bookmarkedCiphers.length} total)
              </div>
              {bookmarkedCiphers.length === 0 ? (
                <div className="text-center text-purple-300 py-4">
                  You haven't bookmarked any ciphers yet. Click the bookmark button on any cipher to save it here!
                </div>
              ) : (
                <div className="text-xs text-purple-200/80">
                  Click on any cipher below to view it. Bookmark more ciphers to build your collection!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6 bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/10">
          <button 
            onClick={() => setActiveTab('learn')} 
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${activeTab === 'learn' ? 'bg-white text-purple-900 shadow-lg' : 'text-white hover:bg-white/20'}`}
            title="🦦 Learn mode! Otto will teach you all about ciphers. Experiment, explore, and discover how encryption works!"
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Learn
          </button>
          <button 
            onClick={() => setActiveTab('practice')} 
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${activeTab === 'practice' ? 'bg-white text-purple-900 shadow-lg' : 'text-white hover:bg-white/20'}`}
            title="🏆 Practice mode! Test your skills with Otto's challenges. Decrypt messages and earn points to climb the leaderboard!"
          >
            <Trophy className="w-5 h-5 inline mr-2" />
            Practice
          </button>
        </div>

        {activeTab === 'learn' && (
          <div className="space-y-6">
            <CipherSelector 
              selectedCipher={selectedCipher} 
              onSelect={setSelectedCipher} 
              activeFilterType={activeFilterType}
              competitionLevelFilter={competitionLevelFilter}
              difficultyFilter={difficultyFilter}
              historicalPeriodFilter={historicalPeriodFilter}
              bookmarkedCiphers={bookmarkedCiphers}
            />

            <div className="bg-blue-900/30 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-blue-500/30">
              <button 
                onClick={() => setShowCipherInfo(!showCipherInfo)} 
                className="w-full flex items-center justify-between text-left"
                title={showCipherInfo ? "📚 Click to hide cipher information. Otto has more secrets to share!" : "📚 Click to learn all about this cipher! Otto will explain how it works, its history, and related ciphers!"}
              >
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-300" />
                  <h3 className="text-lg font-bold">About {cipherAlgorithms[selectedCipher].name}</h3>
                </div>
                {showCipherInfo ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showCipherInfo && (
                <div className="mt-4">
                  <div className="mb-4 pb-4 border-b border-blue-500/30">
                    <div className="text-sm mb-3 text-blue-100">{cipherAlgorithms[selectedCipher].description}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{categories[cipherAlgorithms[selectedCipher].category]?.icon}</span>
                      <span className="font-bold text-blue-200">Category:</span>
                      <span className="text-blue-100">{categories[cipherAlgorithms[selectedCipher].category]?.name}</span>
                    </div>
                  </div>
                  <p className="text-blue-100 mb-4">{cipherAlgorithms[selectedCipher].info}</p>
                  
                  {/* Like/Dislike and Bookmark Buttons */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-blue-500/30">
                    <LikeDislikeButton cipherId={selectedCipher} />
                    <BookmarkButton cipherId={selectedCipher} onBookmarkChange={loadBookmarkedCiphers} />
                  </div>
                  
                  {cipherAlgorithms[selectedCipher].relatedCiphers && (
                    <div className="mt-4 pt-4 border-t border-blue-500/30">
                      <h4 className="text-sm font-bold text-blue-200 mb-3">Related Ciphers:</h4>
                      <div className="space-y-2">
                        {cipherAlgorithms[selectedCipher].relatedCiphers.map((related, idx) => (
                          <div key={idx} className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-300 font-semibold text-sm flex-shrink-0">
                                {related.inApp ? '✓' : '○'}
                              </span>
                              <div className="flex-1">
                                {related.inApp ? (
                                  <button
                                    onClick={() => {
                                      const cipherKey = Object.keys(cipherAlgorithms).find(
                                        key => cipherAlgorithms[key].name === related.name
                                      );
                                      if (cipherKey) setSelectedCipher(cipherKey);
                                    }}
                                    className="font-semibold text-blue-200 hover:text-blue-100 underline text-sm text-left"
                                  >
                                    {related.name}
                                  </button>
                                ) : (
                                  <span className="font-semibold text-blue-200 text-sm">{related.name}</span>
                                )}
                                <p className="text-xs text-blue-100/80 mt-1">{related.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-orange-500/30">
              <button 
                onClick={() => setShowTutorial(!showTutorial)} 
                className="w-full flex items-center justify-between text-left"
                title={showTutorial ? "🦦 Hide Otto's tutorial. But don't worry, you can always come back for more learning!" : "🦦 Watch Otto's tutorial! Learn step-by-step with videos and fun explanations. Otto loves teaching!"}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🦦</div>
                  <h3 className="text-lg font-bold text-orange-100">Tutorial by Otto</h3>
                </div>
                {showTutorial ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showTutorial && (
                <div className="mt-4">
                  <div className="bg-yellow-500/20 border-2 border-yellow-400/40 rounded-lg p-4 mb-4">
                    <p className="text-yellow-50 font-medium">{cipherAlgorithms[selectedCipher].funMessage}</p>
                  </div>
                  {cipherAlgorithms[selectedCipher].youtubeUrl && (
                    <div>
                      {selectedCipher === 'cryptarithm' ? (
                        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                          <p className="text-purple-100 mb-3">📚 Learn more about cryptarithm puzzles:</p>
                          <a 
                            href={cipherAlgorithms[selectedCipher].youtubeUrl}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6 py-3 rounded-lg font-semibold transition-all"
                          >
                            Visit Cryptarithm Puzzles →
                          </a>
                        </div>
                      ) : (
                        <>
                          {/* Show all three videos for Columnar cipher */}
                          {selectedCipher === 'columnar' && cipherAlgorithms[selectedCipher].youtubeUrlBeginner ? (
                            <div className="space-y-4">
                              {/* Beginner Tutorial */}
                              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                                <p className="text-green-100 mb-3 font-semibold">🌱 Beginner Tutorial:</p>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                  <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={cipherAlgorithms[selectedCipher].youtubeUrlBeginner.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                    title={`${cipherAlgorithms[selectedCipher].name} Beginner Tutorial`} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="text-xs text-green-200/80">
                                  <a 
                                    href={cipherAlgorithms[selectedCipher].youtubeUrlBeginner} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-green-300 underline"
                                  >
                                    Watch Beginner Tutorial on YouTube
                                  </a>
                                </div>
                              </div>
                              
                              {/* Intermediate Tutorial */}
                              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                                <p className="text-orange-100 mb-3 font-semibold">⭐ Intermediate Tutorial:</p>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                  <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={cipherAlgorithms[selectedCipher].youtubeUrl.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                    title={`${cipherAlgorithms[selectedCipher].name} Intermediate Tutorial`} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="text-xs text-orange-200/80">
                                  <a 
                                    href={cipherAlgorithms[selectedCipher].youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-orange-300 underline"
                                  >
                                    Watch Intermediate Tutorial on YouTube
                                  </a>
                                </div>
                              </div>
                              
                              {/* Advanced Tutorial */}
                              {cipherAlgorithms[selectedCipher].youtubeUrlAdvanced && (
                                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                                  <p className="text-blue-100 mb-3 font-semibold">🎓 Advanced Tutorial:</p>
                                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                    <iframe 
                                      width="100%" 
                                      height="100%" 
                                      src={cipherAlgorithms[selectedCipher].youtubeUrlAdvanced.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                      title={`${cipherAlgorithms[selectedCipher].name} Advanced Tutorial`} 
                                      frameBorder="0" 
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  <div className="text-xs text-blue-200/80">
                                    <a 
                                      href={cipherAlgorithms[selectedCipher].youtubeUrlAdvanced} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="hover:text-blue-300 underline"
                                    >
                                      Watch Advanced Tutorial on YouTube
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : selectedCipher === 'aristocrat' && cipherAlgorithms[selectedCipher].youtubeUrlK2 ? (
                            <div className="space-y-4">
                              {/* Show all three videos for Aristocrat cipher (K1, K2, K3) */}
                              {/* K1 Tutorial */}
                              <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                                <p className="text-green-100 mb-3 font-semibold">🔑 K1 Tutorial:</p>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                  <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={cipherAlgorithms[selectedCipher].youtubeUrl.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                    title={`${cipherAlgorithms[selectedCipher].name} K1 Tutorial`} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="text-xs text-green-200/80">
                                  <a 
                                    href={cipherAlgorithms[selectedCipher].youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-green-300 underline"
                                  >
                                    Watch K1 Tutorial on YouTube
                                  </a>
                                </div>
                              </div>
                              
                              {/* K2 Tutorial */}
                              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                                <p className="text-orange-100 mb-3 font-semibold">🔑 K2 Tutorial:</p>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                  <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={cipherAlgorithms[selectedCipher].youtubeUrlK2.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                    title={`${cipherAlgorithms[selectedCipher].name} K2 Tutorial`} 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="text-xs text-orange-200/80">
                                  <a 
                                    href={cipherAlgorithms[selectedCipher].youtubeUrlK2} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-orange-300 underline"
                                  >
                                    Watch K2 Tutorial on YouTube
                                  </a>
                                </div>
                              </div>
                              
                              {/* K3 Tutorial */}
                              {cipherAlgorithms[selectedCipher].youtubeUrlK3 && (
                                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                                  <p className="text-blue-100 mb-3 font-semibold">🔑 K3 Tutorial:</p>
                                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                    <iframe 
                                      width="100%" 
                                      height="100%" 
                                      src={cipherAlgorithms[selectedCipher].youtubeUrlK3.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                      title={`${cipherAlgorithms[selectedCipher].name} K3 Tutorial`} 
                                      frameBorder="0" 
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  <div className="text-xs text-blue-200/80">
                                    <a 
                                      href={cipherAlgorithms[selectedCipher].youtubeUrlK3} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="hover:text-blue-300 underline"
                                    >
                                      Watch K3 Tutorial on YouTube
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              {/* Standard single video layout for other ciphers */}
                              <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-3">
                                <iframe 
                                  width="100%" 
                                  height="100%" 
                                  src={cipherAlgorithms[selectedCipher].youtubeUrl.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                  title={`${cipherAlgorithms[selectedCipher].name} Tutorial`} 
                                  frameBorder="0" 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen
                                ></iframe>
                              </div>
                              <div className="text-xs text-orange-200/80 mb-3">
                                <a 
                                  href={cipherAlgorithms[selectedCipher].youtubeUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="hover:text-orange-300 underline"
                                >
                                  Watch on YouTube
                                </a>
                              </div>
                              {cipherAlgorithms[selectedCipher].youtubeUrlAdvanced && (
                                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/30">
                                  <p className="text-blue-100 mb-3">🎓 Advanced Tutorial:</p>
                                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl mb-2">
                                    <iframe 
                                      width="100%" 
                                      height="100%" 
                                      src={cipherAlgorithms[selectedCipher].youtubeUrlAdvanced.replace('watch?v=', 'embed/').split('&')[0].split('?')[0]} 
                                      title={`${cipherAlgorithms[selectedCipher].name} Advanced Tutorial`} 
                                      frameBorder="0" 
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                      allowFullScreen
                                    ></iframe>
                                  </div>
                                  <div className="text-xs text-blue-200/80">
                                    <a 
                                      href={cipherAlgorithms[selectedCipher].youtubeUrlAdvanced} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="hover:text-blue-300 underline"
                                    >
                                      Watch Advanced Tutorial on YouTube
                                    </a>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-teal-900/40 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-green-500/30">
              <button 
                onClick={() => setShowNotes(!showNotes)} 
                className="w-full flex items-center justify-between text-left"
                title={showNotes ? "📝 Hide notes section. Your notes are saved, so you can come back anytime!" : "📝 View expert notes and Otto's helpful tips! Plus, add your own personal notes to remember key concepts!"}
              >
                <div className="flex items-center gap-2">
                  <div className="text-2xl">👩‍🎓🦦</div>
                  <h3 className="text-lg font-bold text-green-100">Expert's and Otto's Notes</h3>
                </div>
                {showNotes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showNotes && (
                <div className="mt-4">
                  <div className="bg-green-500/20 border-2 border-green-400/40 rounded-lg p-6 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">🦦</div>
                      <div className="flex-1">
                        <p className="text-green-50 font-medium text-base leading-relaxed">
                          {(() => {
                            const placeholderMessages = {
                              caesar: "🎭 Hey there, future code-breaker! Our expert cryptographers and Otto are busy crafting super cool notes about Caesar Cipher! They're making sure you'll learn how Julius Caesar protected his messages 2000 years ago - and how you can do it too! Check back soon! 🚀",
                              atbash: "🔄 Whoa! The alphabet is doing backflips! Our experts and Otto are preparing amazing notes that will show you how to flip letters from A→Z and B→Y. It's like a secret code mirror! Stay tuned for some awesome learning! ✨",
                              aristocrat: "🕵️ Detective mode activated! Our experts and Otto are writing super helpful notes about the Aristocrat Cipher. They'll teach you how to be a code detective just like Sherlock Holmes! Look for patterns, find THE and AND - it's going to be epic! 🎯",
                              affine: "🧮 Math + Secret Codes = AWESOME! Our experts and Otto are creating mind-blowing notes about the Affine Cipher. They're breaking down the formula so it's easy-peasy to understand. Get ready to see how math can create super secure codes! 📊",
                              nihilist: "🔢 Russian spies used this! Our experts and Otto are preparing exciting notes about the Nihilist Cipher. They'll show you how numbers can hide messages using a special grid system. It's like a secret spy code! 🕵️‍♂️",
                              checkerboard: "🌐 Cold War secrets incoming! Our experts and Otto are crafting fascinating notes about the Straddling Checkerboard. They'll explain how real spies used this during the Cold War! Get ready to learn some serious spy techniques! 🎖️",
                              columnar: "📋 Time to shuffle! Our experts and Otto are writing great notes about Columnar Transposition. They'll show you how to rearrange letters using a keyword - like solving a word puzzle! It's going to be fun! 🎨",
                              baconian: "🥓 Baconian Cipher - it's not about food! Our experts and Otto are preparing awesome notes that will show you how Francis Bacon used only A's and B's to create secret codes. It's like binary code from the 1600s! Cool, right? 🤖",
                              porta: "🎭 Renaissance secrets! Our experts and Otto are crafting amazing notes about the Porta Cipher. They'll teach you how Giovanni Battista della Porta created this self-reciprocal cipher using 13 alphabets! It's magical! ✨",
                              patristocrat: "🔤 No spaces allowed! Our experts and Otto are writing helpful notes about the Patristocrat Cipher. They'll show you how removing spaces makes codes harder to crack - like a word puzzle without breaks! Challenge accepted! 💪",
                              cryptarithm: "🧩 Math puzzles are the best! Our experts and Otto are creating super fun notes about Cryptarithms. They'll teach you how to solve SEND + MORE = MONEY and other cool math puzzles! Get your thinking cap ready! 🎓",
                              fractionatedMorse: "📡 Morse code meets substitution! Our experts and Otto are preparing exciting notes about Fractionated Morse. They'll show you how to combine Morse code with keyword substitution - it's a favorite in crypto competitions! 🏆",
                              xenocrypt: "🇪🇸 ¡Hola! Our experts and Otto are writing awesome notes about Xenocrypt - the Spanish cipher! They'll teach you how to encrypt Spanish text using the special 27-letter alphabet (including Ñ!). It's going to be muy divertido! 🌟",
                              railfence: "🚂 Choo choo! Time to ride the rails! Our experts and Otto are crafting fun notes about the Rail Fence Cipher. They'll show you how text zigzags like a train track across multiple rails! All aboard the cipher train! 🎢",
                              pollux: "🔢 Numbers everywhere! Our experts and Otto are preparing cool notes about Pollux. They'll teach you how Morse code transforms into digits - like a secret number language! Get ready to decode the numbers! 🔐",
                              morbit: "🔢 Double the numbers, double the fun! Our experts and Otto are writing great notes about Morbit. They'll show you how Morse code becomes digit pairs - it's like Pollux but with extra complexity! You've got this! 💪",
                              vigenere: "🔑 Keyword power! Our experts and Otto are crafting amazing notes about the Vigenère Cipher. They'll explain how using a keyword makes codes much stronger than Caesar! Multiple shifts = super security! 🛡️",
                              rsa: "🔐 Prime number magic! Our experts and Otto are preparing fascinating notes about RSA. They'll break down how prime numbers create super secure codes (this is simplified for learning - real RSA uses HUGE primes!). Math is awesome! 🧮",
                              aristocratMisspelled: "🔤 Misspellings make it tricky! Our experts and Otto are writing helpful notes about the Aristocrat Misspelled Cipher. They'll show you how intentional misspellings make frequency analysis harder - it's like a code with extra challenges! 🎯",
                              dancingMen: "💃 Sherlock Holmes would be proud! Our experts and Otto are crafting fun notes about the Dancing Men Cipher. They'll teach you how stick figures in different poses can hide secret messages! It's like emoji code from the 1800s! 🕺",
                              hill2x2: "🔢 Matrix multiplication magic! Our experts and Otto are preparing awesome notes about Hill 2x2 Cipher. They'll break down how math matrices can encrypt pairs of letters - it's like math meets cryptography! 📐",
                              hill3x3: "🔢 Bigger matrices, bigger security! Our experts and Otto are writing exciting notes about Hill 3x3 Cipher. They'll explain how triple the matrix size means triple the security! It's like Hill 2x2 but on steroids! 🚀"
                            };
                            return placeholderMessages[selectedCipher] || "🎉 Our experts and Otto are working hard to create amazing notes that will help you learn this cipher faster! They're making sure everything is fun, easy to understand, and super helpful. Check back soon for awesome learning tips! 🦦✨";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Expert's Notes Section */}
                  <div className="mb-4 bg-gradient-to-r from-pink-900/40 to-purple-900/40 rounded-lg p-5 shadow-lg border border-pink-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">👩‍🎓</div>
                        <h4 className="text-lg font-bold text-pink-100">Expert's Notes</h4>
                      </div>
                      <NotesLikeDislike cipherId={selectedCipher} noteType="expert" />
                    </div>
                    <div className="bg-pink-900/20 rounded-lg p-4 border border-pink-500/20">
                      <textarea 
                        className="w-full p-4 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 resize-none focus:outline-none focus:border-pink-400 min-h-[150px]"
                        placeholder="Add expert notes here... (Coming soon - Our expert is preparing detailed learning materials!)"
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Otto's Notes Section */}
                  <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-lg p-5 shadow-lg border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">🦦</div>
                        <h4 className="text-lg font-bold text-cyan-100">Otto's Notes</h4>
                      </div>
                      <NotesLikeDislike cipherId={selectedCipher} noteType="otto" />
                    </div>
                    <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/20">
                      <div className="w-full p-4 rounded-lg bg-white/10 border-2 border-white/20 text-white leading-relaxed min-h-[200px] max-h-[600px] overflow-y-auto">
                        <OttosNotesRenderer cipherKey={selectedCipher} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Personal Notes Editor */}
                  <div className="mt-4">
                    <NotesEditor cipherId={selectedCipher} />
                  </div>
                  
                  {/* Progress Tracker */}
                  <div className="mt-4">
                    <ProgressTracker cipherId={selectedCipher} />
                  </div>
                </div>
              )}
            </div>

            {/* Community Section (Comments, Leaderboard, Study Groups) */}
            <div className="mt-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-lg rounded-xl p-5 shadow-lg border border-purple-500/30">
              <button
                onClick={() => setShowCommunity(!showCommunity)}
                className="w-full flex items-center justify-between text-left"
                title={showCommunity ? "👥 Hide community features. But remember, a group of otters is called a Raft!" : "👥 Join Otto's Community Raft! Share comments, see leaderboards, and join study groups. Learning together is more fun!"}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-300" />
                  <h3 className="text-lg font-bold text-purple-100">Community Raft</h3>
                  <span className="text-xs text-purple-300">(Comments, Leaderboard, Study Groups)</span>
                </div>
                {showCommunity ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showCommunity && (
                <div className="mt-4 space-y-4">
                  {/* Explanation */}
                  <div className="text-center text-purple-200 text-sm mb-2 italic">
                    🦦 Did you know? A group of otters swimming together is called a <strong>Raft</strong>, while a group playing on land is called a <strong>Romp</strong>!
                  </div>
                  
                  {/* Comments Section */}
                  <div>
                    <CommentsSection cipherId={selectedCipher} />
                  </div>

                  {/* Leaderboard Section */}
                  {isAuthenticated && (
                    <div>
                      <Leaderboard sortBy="score" limit={10} />
                    </div>
                  )}

                  {/* Study Groups Section */}
                  {isAuthenticated && (
                    <div>
                      <StudyGroups />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10">
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setMode('encrypt')} 
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${mode === 'encrypt' ? 'bg-green-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/30'}`}
                  title="🔒 Encrypt mode! Turn your plain text into secret code. Otto will help you lock your messages!"
                >
                  <Lock className="w-5 h-5" />
                  Encrypt
                </button>
                <button 
                  onClick={() => setMode('decrypt')} 
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${mode === 'decrypt' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white/20 hover:bg-white/30'}`}
                  title="🔓 Decrypt mode! Unlock secret messages and reveal the hidden text. Be a code-breaker like Otto!"
                >
                  <Unlock className="w-5 h-5" />
                  Decrypt
                </button>
              </div>

              <CipherInputs
                selectedCipher={selectedCipher}
                caesarShift={caesarShift}
                setCaesarShift={setCaesarShift}
                affineA={affineA}
                setAffineA={setAffineA}
                affineB={affineB}
                setAffineB={setAffineB}
                columnarKeyword={columnarKeyword}
                setColumnarKeyword={setColumnarKeyword}
                checkerboardKey={checkerboardKey}
                setCheckerboardKey={setCheckerboardKey}
                checkerboardBlanks={checkerboardBlanks}
                setCheckerboardBlanks={setCheckerboardBlanks}
                nihilistKeyword={nihilistKeyword}
                setNihilistKeyword={setNihilistKeyword}
                nihilistPolybiusKey={nihilistPolybiusKey}
                setNihilistPolybiusKey={setNihilistPolybiusKey}
                portaKeyword={portaKeyword}
                setPortaKeyword={setPortaKeyword}
                fractionatedMorseKeyword={fractionatedMorseKeyword}
                setFractionatedMorseKeyword={setFractionatedMorseKeyword}
                xenocryptKeyword={xenocryptKeyword}
                setXenocryptKeyword={setXenocryptKeyword}
                vigenereKeyword={vigenereKeyword}
                setVigenereKeyword={setVigenereKeyword}
                cryptarithmEquation={cryptarithmEquation}
                setCryptarithmEquation={setCryptarithmEquation}
                cryptarithmMapping={cryptarithmMapping}
                setCryptarithmMapping={setCryptarithmMapping}
                cryptarithmValidation={cryptarithmValidation}
                setCryptarithmValidation={setCryptarithmValidation}
                inputText={inputText}
                railfenceRails={railfenceRails}
                setRailfenceRails={setRailfenceRails}
                rsaPublicKey={rsaPublicKey}
                setRsaPublicKey={setRsaPublicKey}
                rsaPrivateKey={rsaPrivateKey}
                setRsaPrivateKey={setRsaPrivateKey}
              />

              <textarea 
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)} 
                placeholder={selectedCipher === 'cryptarithm' ? mode === 'encrypt' ? "Enter equation or text to convert using mapping..." : "Enter numbers to convert back to letters..." : "Enter your message..."} 
                rows={4} 
                className="w-full p-4 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 mb-4 resize-none focus:outline-none focus:border-purple-400"
              ></textarea>
              
              {selectedCipher === 'cryptarithm' && mode === 'encrypt' && !inputText && (
                <div className="mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                  <div className="text-xs text-purple-200">
                    💡 <strong>Tip:</strong> For cryptarithm, you can either:
                    <ul className="list-disc list-inside mt-2 space-y-1 text-purple-300">
                      <li>Enter the equation text (e.g., "SEND + MORE = MONEY") to see it converted to numbers</li>
                      <li>Enter any text to convert letters to digits based on your mapping</li>
                    </ul>
                  </div>
                </div>
              )}

              <button 
                onClick={processCipher} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg transform hover:scale-105"
                title={mode === 'encrypt' ? "🦦 Click to encrypt your message! Otto will transform your text into secret code using the selected cipher!" : "🦦 Click to decrypt! Otto will help you unlock the secret message and reveal the hidden text!"}
              >
                {mode === 'encrypt' ? '🔒 Encrypt Message' : '🔓 Decrypt Message'}
              </button>

              {outputText && (
                <div className="mt-4 p-4 bg-white/20 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-purple-200 font-semibold">Result:</div>
                    <button 
                      onClick={copyToClipboard} 
                      className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all"
                      title={copied ? "✅ Copied to clipboard! Otto says you're ready to paste it anywhere!" : "📋 Copy the result to your clipboard! Otto makes it easy to share your encrypted/decrypted messages!"}
                    >
                      {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                    </button>
                  </div>
                  <div className="font-mono text-lg break-all bg-black/20 p-3 rounded">{outputText}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <PracticeTab
            practiceChallenge={practiceChallenge}
            setPracticeChallenge={setPracticeChallenge}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            generateChallenge={generateChallenge}
            checkAnswer={checkAnswer}
            selectedCipher={selectedCipher}
            setSelectedCipher={setSelectedCipher}
            activeFilterType={activeFilterType}
            competitionLevelFilter={competitionLevelFilter}
            difficultyFilter={difficultyFilter}
            historicalPeriodFilter={historicalPeriodFilter}
            bookmarkedCiphers={bookmarkedCiphers}
          />
        )}

        <div className="mt-8 text-center text-purple-200 text-sm pb-8">
          <p>Made with 💜 by Otto the Otter</p>
          <p className="mt-2">Learn cryptography the fun way!</p>
        </div>
      </div>
    </div>
  );
};

export default CipherOtto;
