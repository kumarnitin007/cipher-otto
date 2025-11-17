export const dancingMenCipher = {
  name: 'Dancing Men',
  description: 'Substitution cipher from Sherlock Holmes',
  category: 'encoding',
  difficulty: 'beginner',
  competitionLevel: 'open',
  historicalPeriod: 'modern',
  info: 'A substitution cipher where each letter is represented by a stick figure in different poses. Popularized in "The Adventure of the Dancing Men" by Arthur Conan Doyle.',
  youtubeUrl: 'https://www.youtube.com/watch?v=qIagP3EzYWE&t=55s',
  funMessage: 'Sherlock Holmes would be proud! These dancing men hide secrets!',
  relatedCiphers: [
    { name: 'Baconian Cipher', inApp: true, description: 'Another encoding-based cipher' },
    { name: 'Aristocrat Cipher', inApp: true, description: 'Substitution cipher' }
  ],
  encrypt: (text, mapping = null) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const defaultMapping = mapping || {
      'A': 'ðŸ•º', 'B': 'ðŸ’ƒ', 'C': 'ðŸ‘¯', 'D': 'ðŸ•´', 'E': 'ðŸ§',
      'F': 'ðŸ§Ž', 'G': 'ðŸƒ', 'H': 'ðŸš¶', 'I': 'ðŸ¤¸', 'J': 'ðŸ¤¾',
      'K': 'ðŸ¤½', 'L': 'ðŸŠ', 'M': 'ðŸ§—', 'N': 'ðŸ¤¹', 'O': 'ðŸš´',
      'P': 'ðŸ‡', 'Q': 'ðŸ‚', 'R': 'â›·ï¸', 'S': 'ðŸ„', 'T': 'ðŸ‹ï¸',
      'U': 'ðŸ¤¼', 'V': 'ðŸ¤º', 'W': 'ðŸ¤¸', 'X': 'ðŸ§˜', 'Y': 'ðŸ¤³', 'Z': 'ðŸ§'
    };
    
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return defaultMapping[char] || char;
      }
      return char;
    }).join('');
  },
  decrypt: (text, mapping = null) => {
    const defaultMapping = mapping || {
      'ðŸ•º': 'A', 'ðŸ’ƒ': 'B', 'ðŸ‘¯': 'C', 'ðŸ•´': 'D', 'ðŸ§': 'E',
      'ðŸ§Ž': 'F', 'ðŸƒ': 'G', 'ðŸš¶': 'H', 'ðŸ¤¸': 'I', 'ðŸ¤¾': 'J',
      'ðŸ¤½': 'K', 'ðŸŠ': 'L', 'ðŸ§—': 'M', 'ðŸ¤¹': 'N', 'ðŸš´': 'O',
      'ðŸ‡': 'P', 'ðŸ‚': 'Q', 'â›·ï¸': 'R', 'ðŸ„': 'S', 'ðŸ‹ï¸': 'T',
      'ðŸ¤¼': 'U', 'ðŸ¤º': 'V', 'ðŸ§˜': 'X', 'ðŸ¤³': 'Y', 'ðŸ§': 'Z'
    };
    
    return text.split('').map(char => {
      if (defaultMapping[char]) {
        return defaultMapping[char];
      }
      return char;
    }).join('');
  }
};
