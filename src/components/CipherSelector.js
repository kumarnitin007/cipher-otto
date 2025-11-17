import React from 'react';
import { Sparkles } from 'lucide-react';
import { cipherAlgorithms } from '../ciphers';
import { getDifficultyColor, getDifficultyBadge, getCompetitionColor } from '../utils/helpers';

/**
 * CipherSelector Component - Displays all available ciphers for selection
 * @param {string} selectedCipher - Currently selected cipher key
 * @param {Function} onSelect - Callback when cipher is selected
 * @param {string} activeFilterType - Active filter type: 'competition', 'difficulty', 'historical', 'bookmarks'
 * @param {string} competitionLevelFilter - Competition level filter: 'all', 'divisionA', 'divisionB', 'divisionC', 'open'
 * @param {string} difficultyFilter - Difficulty level filter: 'all', 'beginner', 'intermediate', 'advanced'
 * @param {string} historicalPeriodFilter - Historical period filter: 'all', 'ancient', 'medieval', 'renaissance', 'modern', 'contemporary'
 * @param {Array} bookmarkedCiphers - Array of bookmarked cipher IDs
 */
const CipherSelector = ({ selectedCipher, onSelect, activeFilterType = 'competition', competitionLevelFilter = 'all', difficultyFilter = 'all', historicalPeriodFilter = 'all', bookmarkedCiphers = [] }) => {
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
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        Select Cipher
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {availableCiphers.map(key => {
          const cipher = cipherAlgorithms[key];
          return (
            <button 
              key={key} 
              onClick={() => onSelect(key)} 
              className={`p-4 rounded-xl text-sm transition-all transform hover:scale-105 ${
                selectedCipher === key 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold shadow-lg scale-105' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-center">{cipher.name}</span>
                <div className="flex items-center gap-1">
                  <span className={`${selectedCipher === key ? 'text-gray-900' : getDifficultyColor(cipher.difficulty)}`}>
                    {getDifficultyBadge(cipher.difficulty)}
                  </span>
                  {cipher.competitionLevel && (
                    <span className={`text-xs ${selectedCipher === key ? 'text-gray-700' : getCompetitionColor(cipher.competitionLevel)}`}>
                      {cipher.competitionLevel === 'divisionA' ? '🥉' : 
                       cipher.competitionLevel === 'divisionB' ? '🥈' : 
                       cipher.competitionLevel === 'divisionC' ? '🥇' : '🏆'}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CipherSelector;

