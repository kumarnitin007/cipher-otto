export const polluxCipher = {
  name: 'Pollux',
  description: 'Morse code digit substitution cipher',
  category: 'substitution',
  difficulty: 'advanced',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Converts text to Morse code, then substitutes dots and dashes with digits. Each dot/dash combination maps to a unique digit.',
  youtubeUrl: 'https://www.youtube.com/watch?v=9SUwAHVywvI',
  funMessage: 'Pollux transforms Morse code into numbers!',
  relatedCiphers: [
    { name: 'Morbit', inApp: true, description: 'Similar Morse code digit cipher' },
    { name: 'Fractionated Morse', inApp: true, description: 'Another Morse-based cipher' }
  ],
  encrypt: (text, mapping = null) => {
    const morseCode = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.'
    };
    
    // Default mapping: . = 5, - = 8
    const defaultMapping = mapping || { '.': '5', '-': '8' };
    
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let morse = '';
    
    for (let char of cleanText) {
      if (morseCode[char]) {
        morse += morseCode[char] + 'x'; // x is separator
      }
    }
    morse += 'xxx'; // Final separator
    
    return morse.split('').map(symbol => {
      if (symbol === 'x') return ' ';
      return defaultMapping[symbol] || symbol;
    }).join('');
  },
  decrypt: (text, mapping = null) => {
    const morseToChar = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
      '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
      '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
      '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
      '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
      '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
      '---..': '8', '----.': '9'
    };
    
    const defaultMapping = mapping || { '.': '5', '-': '8' };
    const reverseMapping = {};
    for (let [key, value] of Object.entries(defaultMapping)) {
      reverseMapping[value] = key;
    }
    
    const digits = text.replace(/[^0-9\s]/g, '').split(' ');
    let morse = '';
    
    for (let digitGroup of digits) {
      for (let digit of digitGroup) {
        if (reverseMapping[digit]) {
          morse += reverseMapping[digit];
        }
      }
      morse += 'x';
    }
    
    let result = '';
    let currentMorse = '';
    for (let symbol of morse) {
      if (symbol === 'x') {
        if (morseToChar[currentMorse]) {
          result += morseToChar[currentMorse];
          currentMorse = '';
        }
      } else {
        currentMorse += symbol;
        if (morseToChar[currentMorse]) {
          result += morseToChar[currentMorse];
          currentMorse = '';
        }
      }
    }
    
    return result;
  }
};
