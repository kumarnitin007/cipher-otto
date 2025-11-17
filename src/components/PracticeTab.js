/**
 * ============================================================================
 * PracticeTab Component
 * ============================================================================
 * 
 * This component handles the Practice Mode tab of the Cipher Otto application.
 * Practice Mode allows users to test their cipher-decoding skills through
 * interactive challenges.
 * 
 * Features:
 * - Challenge Generation: Creates encrypted messages with hints (keywords, shifts, etc.)
 * - Answer Validation: Checks user answers and awards points based on difficulty
 * - Cipher Selection: Filtered cipher selection based on active filters
 * - Progress Tracking: Integrates with Supabase to track user progress and achievements
 * - Special Handling: Custom logic for cryptarithm puzzles (accepts word or number answers)
 * 
 * Flow:
 * 1. User selects a cipher (filtered by difficulty/competition/historical/bookmarks)
 * 2. Click "Start Challenge" to generate an encrypted message
 * 3. User enters their decrypted answer
 * 4. System validates and awards points (5 for beginner, 10 for intermediate, 15 for advanced)
 * 5. Progress is saved to database and achievements are checked
 * 
 * @component
 * @param {Object} practiceChallenge - Current challenge object with encrypted message and hints
 * @param {Function} generateChallenge - Function to create a new practice challenge
 * @param {Function} checkAnswer - Function to validate user's answer and award points
 * @param {string} selectedCipher - Currently selected cipher key
 * @param {Object} ...filterProps - Filter state for cipher selection
 * @returns {JSX.Element} Practice mode UI with challenge interface
 */

import React, { useState } from 'react';
import { Trophy, Star, RotateCcw, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import AnimatedOtter from './AnimatedOtter';
import { cipherAlgorithms } from '../ciphers';
import { getDifficultyBadge, competitionLevels, difficultyLevels, historicalPeriods } from '../utils/helpers';
import PolybiusSquare from './PolybiusSquare';
import MorseCodeChart from './MorseCodeChart';
import VigenereTableau from './VigenereTableau';
import PortaTable from './PortaTable';
import CaesarShiftVisual from './CaesarShiftVisual';
import AtbashMirror from './AtbashMirror';
import BaconianTable from './BaconianTable';
import NotesEditor from './NotesEditor';

const PracticeTab = ({
  practiceChallenge,
  setPracticeChallenge,
  userAnswer,
  setUserAnswer,
  generateChallenge,
  checkAnswer,
  selectedCipher,
  setSelectedCipher,
  activeFilterType,
  competitionLevelFilter,
  difficultyFilter,
  historicalPeriodFilter,
  bookmarkedCiphers
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  // Map ciphers to their relevant reference tools
  const getRelevantTools = (cipherKey) => {
    if (!cipherKey) return []; // No cipher selected, show no tools
    
    const toolMap = {
      'caesar': ['caesar'],
      'atbash': ['atbash'],
      'nihilist': ['polybius'],
      'checkerboard': ['polybius'],
      'vigenere': ['vigenere'],
      'porta': ['porta'],
      'baconian': ['baconian'],
      'pollux': ['morse'],
      'morbit': ['morse'],
      'fractionatedMorse': ['morse'],
    };
    
    return toolMap[cipherKey] || [];
  };

  // Get the current cipher being practiced or selected
  const currentCipher = practiceChallenge?.cipher || selectedCipher;
  const relevantTools = getRelevantTools(currentCipher);

  // Define all available tools
  const allTools = [
    {
      id: 'polybius',
      name: 'Polybius Square',
      component: <PolybiusSquare keyword="CRYPTO" showLabels={true} />,
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-200',
      textColorSecondary: 'text-cyan-300',
      description: 'Used for: Nihilist, Checkerboard',
      fullWidth: false
    },
    {
      id: 'morse',
      name: 'Morse Code Chart',
      component: <MorseCodeChart />,
      bgColor: 'bg-orange-900/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-200',
      textColorSecondary: 'text-orange-300',
      description: 'Used for: Pollux, Morbit, Fractionated Morse',
      fullWidth: false
    },
    {
      id: 'vigenere',
      name: 'Vigenère Square',
      component: <VigenereTableau showFull={false} />,
      bgColor: 'bg-indigo-900/20',
      borderColor: 'border-indigo-500/30',
      textColor: 'text-indigo-200',
      textColorSecondary: 'text-indigo-300',
      description: 'Used for: Vigenère Cipher',
      fullWidth: true
    },
    {
      id: 'porta',
      name: 'Porta Cipher Table',
      component: <PortaTable />,
      bgColor: 'bg-teal-900/20',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-200',
      textColorSecondary: 'text-teal-300',
      description: 'Used for: Porta Cipher',
      fullWidth: true,
      scrollable: true
    },
    {
      id: 'caesar',
      name: 'Caesar Shift (Shift 3)',
      component: <CaesarShiftVisual shift={3} />,
      bgColor: 'bg-green-900/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-200',
      textColorSecondary: 'text-green-300',
      description: 'Used for: Caesar Cipher',
      fullWidth: false
    },
    {
      id: 'atbash',
      name: 'Atbash Mirror',
      component: <AtbashMirror />,
      bgColor: 'bg-yellow-900/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-200',
      textColorSecondary: 'text-yellow-300',
      description: 'Used for: Atbash Cipher',
      fullWidth: false
    },
    {
      id: 'baconian',
      name: 'Baconian Encoding',
      component: <BaconianTable />,
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-500/30',
      textColor: 'text-amber-200',
      textColorSecondary: 'text-amber-300',
      description: 'Used for: Baconian Cipher',
      fullWidth: false
    }
  ];

  // Filter tools based on current cipher
  const toolsToShow = currentCipher 
    ? allTools.filter(tool => relevantTools.includes(tool.id))
    : []; // Show no tools if no cipher is selected

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-400" />
        Practice Mode
      </h2>
      
      {/* Reference Tools Collapsible Section */}
      <div className="mb-6">
        <button
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg border-2 border-blue-400/30 hover:border-blue-400/50 transition-all"
          title="📚 Open reference tools and tables to help you solve ciphers!"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-300" />
            <span className="font-bold text-blue-200">Reference Tools</span>
            <span className="text-xs text-blue-300 ml-2">(Click to expand)</span>
          </div>
          {isToolsOpen ? (
            <ChevronUp className="w-5 h-5 text-blue-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-blue-300" />
          )}
        </button>
        
        {isToolsOpen && (
          <div className="mt-4 bg-black/20 rounded-lg p-4 border border-blue-400/20">
            {toolsToShow.length > 0 ? (
              <>
                <div className="text-sm text-blue-200 mb-4 text-center italic">
                  💡 Reference tools for {currentCipher ? cipherAlgorithms[currentCipher]?.name || 'this cipher' : 'selected cipher'}:
                </div>
                <div className={`grid gap-6 ${toolsToShow.length === 1 ? 'grid-cols-1' : toolsToShow.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {toolsToShow.map((tool) => (
                    <div 
                      key={tool.id} 
                      className={`${tool.bgColor} rounded-lg p-6 border ${tool.borderColor} ${tool.fullWidth ? 'lg:col-span-2' : ''}`}
                    >
                      <div className={`text-base font-bold ${tool.textColor} mb-4`}>{tool.name}</div>
                      <div className={`w-full ${tool.scrollable ? 'max-h-[600px] overflow-y-auto overflow-x-auto' : ''}`}>
                        {tool.component}
                      </div>
                      <div className={`text-sm ${tool.textColorSecondary} mt-3`}>{tool.description}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-blue-200 text-center italic py-4">
                {currentCipher 
                  ? `💡 No specific reference tools available for ${cipherAlgorithms[currentCipher]?.name || 'this cipher'}. Select a cipher that uses reference tables to see tools here!`
                  : '💡 Select a cipher and start a challenge to see relevant reference tools here!'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personal Notes Section */}
      {(currentCipher || selectedCipher) && (
        <div className="mb-6">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg border-2 border-purple-400/30 hover:border-purple-400/50 transition-all"
            title="📝 View and edit your personal notes for this cipher. Your notes are private and only visible to you!"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="font-bold text-purple-200">My Personal Notes</span>
              <span className="text-xs text-purple-300 ml-2">
                {currentCipher ? `(${cipherAlgorithms[currentCipher]?.name || 'Current Cipher'})` : `(${cipherAlgorithms[selectedCipher]?.name || 'Selected Cipher'})`}
              </span>
            </div>
            {isNotesOpen ? (
              <ChevronUp className="w-5 h-5 text-purple-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-300" />
            )}
          </button>
          
          {isNotesOpen && (
            <div className="mt-4">
              <NotesEditor cipherId={currentCipher || selectedCipher} />
            </div>
          )}
        </div>
      )}

      {!practiceChallenge ? (
        <div className="text-center py-8">
          <div className="mb-4 animate-bounce"><AnimatedOtter /></div>
          <p className="mb-2 text-xl font-bold">Otto wants to practice!</p>
          <p className="mb-6 text-purple-200">
            {(() => {
              if (activeFilterType === 'bookmarks') {
                return 'Select a cipher from your bookmarked ciphers and start your challenge';
              } else if (activeFilterType === 'competition') {
                if (competitionLevelFilter === 'all') {
                  return 'Select a cipher from competition ciphers and start your challenge';
                } else {
                  const level = competitionLevels[competitionLevelFilter];
                  return `Select a cipher from ${level?.name || 'competition'} ciphers and start your challenge`;
                }
              } else if (activeFilterType === 'difficulty') {
                if (difficultyFilter === 'all') {
                  return 'Select a cipher from difficulty-filtered ciphers and start your challenge';
                } else {
                  const level = difficultyLevels[difficultyFilter];
                  return `Select a cipher from ${level?.name || 'difficulty'} ciphers and start your challenge`;
                }
              } else if (activeFilterType === 'historical') {
                if (historicalPeriodFilter === 'all') {
                  return 'Select a cipher from historical ciphers and start your challenge';
                } else {
                  const period = historicalPeriods[historicalPeriodFilter];
                  return `Select a cipher from ${period?.name || 'historical'} ciphers and start your challenge`;
                }
              }
              return 'Select a cipher and start your challenge';
            })()}
          </p>
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-w-3xl mx-auto mb-4">
              {(() => {
                // Filter ciphers based on active filter type
                const availableCiphers = Object.keys(cipherAlgorithms).filter(key => {
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
                
                return availableCiphers.map(key => {
                  const cipher = cipherAlgorithms[key];
                  return (
                    <button 
                      key={key} 
                      onClick={() => setSelectedCipher(key)} 
                      className={`p-3 rounded-lg text-sm transition-all transform hover:scale-105 ${
                        selectedCipher === key 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{cipher.name}</span>
                        <span>{getDifficultyBadge(cipher.difficulty)}</span>
                      </div>
                    </button>
                  );
                });
              })()}
            </div>
          </div>
          <button 
            onClick={generateChallenge} 
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-8 py-4 rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all"
            title="⭐ Start a new challenge! Otto will give you an encrypted message to decode. Earn points and climb the leaderboard!"
          >
            <Star className="w-5 h-5 inline mr-2" />
            Start Challenge
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-purple-900/50 p-4 rounded-lg mb-4 border border-purple-500/30">
            <div className="text-sm text-purple-200 mb-2">
              Cipher: <span className="font-bold text-yellow-300">{cipherAlgorithms[practiceChallenge.cipher].name}</span> {getDifficultyBadge(cipherAlgorithms[practiceChallenge.cipher].difficulty)}
            </div>
            
            {practiceChallenge.cipher === 'cryptarithm' ? (
              <div>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-yellow-300 mb-3">🧩 {practiceChallenge.equation}</div>
                  <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-4 rounded-lg border-2 border-blue-400/30">
                    <div className="text-lg font-mono mb-2 text-blue-100">Given:</div>
                    <div className="text-3xl font-bold font-mono text-white mb-3">{practiceChallenge.encrypted}</div>
                    <div className="text-sm text-purple-200">What is the missing word or number?</div>
                  </div>
                </div>
                
                {practiceChallenge.mapping && (
                  <div className="bg-black/20 p-3 rounded-lg mb-3">
                    <div className="text-xs text-purple-200 mb-2">💡 Letter-to-Digit Mapping:</div>
                    <div className="grid grid-cols-4 gap-1 text-xs">
                      {Object.entries(practiceChallenge.mapping).map(([letter, digit]) => (
                        <div key={letter} className="bg-purple-600/30 p-1 rounded text-center">
                          <span className="font-bold">{letter}</span> = {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="font-mono text-xl mb-3 break-all bg-black/30 p-3 rounded">{practiceChallenge.encrypted}</div>
                {practiceChallenge.shift && <div className="text-sm text-purple-200">💡 Hint: Shift = {practiceChallenge.shift}</div>}
                {practiceChallenge.keyword && <div className="text-sm text-purple-200">💡 Keyword: {practiceChallenge.keyword}</div>}
                {practiceChallenge.polybiusKey && <div className="text-sm text-purple-200">💡 Polybius Key: {practiceChallenge.polybiusKey}</div>}
              </div>
            )}
          </div>
          <input 
            type="text" 
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)} 
            placeholder={practiceChallenge.cipher === 'cryptarithm' ? "Enter the missing word or number..." : "Enter your answer..."} 
            className="w-full p-4 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-white/50 mb-4 focus:outline-none focus:border-purple-400" 
          />
          <div className="flex gap-2">
            <button 
              onClick={checkAnswer} 
              className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 py-3 rounded-lg font-bold transition-all shadow-lg"
              title="✅ Check your answer! Otto will tell you if you're right and award points. Good luck!"
            >
              ✓ Check Answer
            </button>
            <button 
              onClick={generateChallenge} 
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg font-bold transition-all"
              title="⏭️ Skip this challenge and get a new one! Sometimes it's okay to move on - Otto understands!"
            >
              Skip →
            </button>
            <button 
              onClick={() => setPracticeChallenge(null)} 
              className="bg-purple-500/50 hover:bg-purple-500/70 px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
              title="🔄 Change to a different cipher! Otto has many challenges waiting for you!"
            >
              <RotateCcw className="w-4 h-4" />
              Change Cipher
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeTab;

