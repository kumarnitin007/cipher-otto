export const aristocratMisspelledCipher = {
  name: 'Aristocrat Misspelled',
  description: 'Substitution cipher with intentional misspellings',
  category: 'substitution',
  difficulty: 'intermediate',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Similar to Aristocrat cipher but includes common misspellings to make frequency analysis more challenging.',
  youtubeUrl: 'https://www.youtube.com/watch?v=4Ur_sGJJjzE&list=PLKS2onRfwJBMvSUHC3kVUZL35xn9xFtXj&index=5',
  funMessage: 'Misspellings make this harder to crack!',
  relatedCiphers: [
    { name: 'Aristocrat Cipher', inApp: true, description: 'Standard substitution cipher' },
    { name: 'Patristocrat Cipher', inApp: true, description: 'Substitution without spaces' }
  ],
  encrypt: (text, key = null) => {
    // Use aristocrat cipher logic but with misspellings
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const defaultKey = key || 'ZEBRASCDFGHIJKLMNOPQTUVWXY';
    const substitutionKey = defaultKey.toUpperCase().padEnd(26, alphabet).slice(0, 26);
    
    const misspellings = {
      'THE': 'TEH', 'AND': 'NAD', 'YOU': 'YUO', 'THAT': 'THTA',
      'WITH': 'WIT', 'FOR': 'FORR', 'ARE': 'ARE', 'WAS': 'WAS'
    };
    
    let cleanText = text.toUpperCase();
    
    // Apply common misspellings
    for (let [correct, misspelled] of Object.entries(misspellings)) {
      cleanText = cleanText.replace(new RegExp(correct, 'g'), misspelled);
    }
    
    return cleanText.split('').map(char => {
      const index = alphabet.indexOf(char);
      if (index !== -1) {
        return substitutionKey[index];
      }
      return char;
    }).join('');
  },
  decrypt: (text, key = null) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const defaultKey = key || 'ZEBRASCDFGHIJKLMNOPQTUVWXY';
    const substitutionKey = defaultKey.toUpperCase().padEnd(26, alphabet).slice(0, 26);
    
    const reverseMisspellings = {
      'TEH': 'THE', 'NAD': 'AND', 'YUO': 'YOU', 'THTA': 'THAT',
      'WIT': 'WITH', 'FORR': 'FOR'
    };
    
    let result = text.toUpperCase().split('').map(char => {
      const index = substitutionKey.indexOf(char);
      if (index !== -1) {
        return alphabet[index];
      }
      return char;
    }).join('');
    
    // Fix misspellings
    for (let [misspelled, correct] of Object.entries(reverseMisspellings)) {
      result = result.replace(new RegExp(misspelled, 'g'), correct);
    }
    
    return result;
  }
};
