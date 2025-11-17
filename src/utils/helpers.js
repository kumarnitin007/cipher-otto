/**
 * Cipher category definitions with icons
 * Used for displaying cipher information and categorization
 */
export const categories = {
  substitution: { name: 'Substitution', icon: '🔤' },
  polygraphic: { name: 'Polygraphic', icon: '🔢' },
  transposition: { name: 'Transposition', icon: '↔️' },
  encoding: { name: 'Encoding', icon: '💾' },
  polyalphabetic: { name: 'Polyalphabetic', icon: '🔄' },
  puzzle: { name: 'Puzzle', icon: '🧩' }
};

/**
 * Returns Tailwind CSS color class based on difficulty level
 * @param {string} difficulty - Difficulty level ('beginner', 'intermediate', 'advanced')
 * @returns {string} Tailwind CSS color class
 */
export const getDifficultyColor = (difficulty) => {
  switch(difficulty) {
    case 'beginner': return 'text-green-300';      // Green for easy
    case 'intermediate': return 'text-yellow-300'; // Yellow for medium
    case 'advanced': return 'text-red-300';        // Red for hard
    default: return 'text-gray-300';
  }
};

/**
 * Returns star emoji badge based on difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {string} Star emoji string (⭐, ⭐⭐, or ⭐⭐⭐)
 */
export const getDifficultyBadge = (difficulty) => {
  switch(difficulty) {
    case 'beginner': return '⭐';      // 1 star
    case 'intermediate': return '⭐⭐'; // 2 stars
    case 'advanced': return '⭐⭐⭐';    // 3 stars
    default: return '';
  }
};

/**
 * Competition level definitions with icons and colors
 * Used for filtering ciphers by competition difficulty
 */
export const competitionLevels = {
  divisionA: { name: 'Division A', icon: '🥉', description: 'Beginner competition level' },
  divisionB: { name: 'Division B', icon: '🥈', description: 'Intermediate competition level' },
  divisionC: { name: 'Division C', icon: '🥇', description: 'Advanced competition level' },
  open: { name: 'Open/Expert', icon: '🏆', description: 'Expert level competitions' }
};

/**
 * Returns Tailwind CSS color class based on competition level
 * @param {string} competitionLevel - Competition level ('divisionA', 'divisionB', 'divisionC', 'open')
 * @returns {string} Tailwind CSS color class
 */
export const getCompetitionColor = (competitionLevel) => {
  switch(competitionLevel) {
    case 'divisionA': return 'text-blue-300';      // Blue for Division A
    case 'divisionB': return 'text-purple-300';     // Purple for Division B
    case 'divisionC': return 'text-orange-300';     // Orange for Division C
    case 'open': return 'text-red-300';             // Red for Open/Expert
    default: return 'text-gray-300';
  }
};

/**
 * Returns competition level badge with icon
 * @param {string} competitionLevel - Competition level
 * @returns {string} Competition level badge string with icon
 */
export const getCompetitionBadge = (competitionLevel) => {
  if (!competitionLevel) return '';
  const level = competitionLevels[competitionLevel];
  return level ? `${level.icon} ${level.name}` : '';
};

/**
 * Difficulty level definitions with icons
 * Used for filtering ciphers by difficulty
 */
export const difficultyLevels = {
  beginner: { name: 'Beginner', icon: '⭐', description: 'Easy ciphers for beginners' },
  intermediate: { name: 'Intermediate', icon: '⭐⭐', description: 'Moderate complexity ciphers' },
  advanced: { name: 'Advanced', icon: '⭐⭐⭐', description: 'Complex ciphers for experts' }
};

/**
 * Historical period definitions with icons and colors
 * Used for filtering ciphers by historical period
 */
export const historicalPeriods = {
  ancient: { name: 'Ancient', icon: '🏛️', description: 'Before 1000 CE', color: 'text-amber-300' },
  medieval: { name: 'Medieval', icon: '🏰', description: '1000-1500 CE', color: 'text-yellow-300' },
  renaissance: { name: 'Renaissance', icon: '📚', description: '1500-1800 CE', color: 'text-orange-300' },
  modern: { name: 'Modern Era', icon: '🏭', description: '1800-1950 CE', color: 'text-red-300' },
  contemporary: { name: 'Contemporary', icon: '💻', description: '1950+ CE', color: 'text-blue-300' }
};

/**
 * Returns Tailwind CSS color class based on historical period
 * @param {string} historicalPeriod - Historical period ('ancient', 'medieval', 'renaissance', 'modern', 'contemporary')
 * @returns {string} Tailwind CSS color class
 */
export const getHistoricalPeriodColor = (historicalPeriod) => {
  if (!historicalPeriod) return 'text-gray-300';
  const period = historicalPeriods[historicalPeriod];
  return period ? period.color : 'text-gray-300';
};

