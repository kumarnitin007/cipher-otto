export const morbitCipher = {
  name: 'Morbit',
  description: 'Morse code digit substitution with pairs',
  category: 'substitution',
  difficulty: 'advanced',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Similar to Pollux but uses pairs of digits. Converts text to Morse, then groups symbols and substitutes with digit pairs.',
  youtubeUrl: 'https://www.youtube.com/watch?v=9SUwAHVywvI',
  funMessage: 'Morbit pairs digits for extra complexity!',
  relatedCiphers: [
    { name: 'Pollux', inApp: true, description: 'Similar Morse code digit cipher' },
    { name: 'Fractionated Morse', inApp: true, description: 'Another Morse-based cipher' }
  ],
  encrypt: (text, mapping = null) => {
    const morseCode = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..'
    };
    
    // Default mapping: . = 1, - = 2, x = 3
    const defaultMapping = mapping || { '.': '1', '-': '2', 'x': '3' };
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    let morse = '';
    
    for (let char of cleanText) {
      if (morseCode[char]) {
        morse += morseCode[char] + 'x';
      }
    }
    morse += 'xxx';
    
    // Convert to digit pairs
    let result = '';
    for (let symbol of morse) {
      if (symbol === 'x') {
        result += defaultMapping['x'] || '3';
      } else {
        result += defaultMapping[symbol] || symbol;
      }
    }
    
    // Group into pairs
    return result.match(/.{1,2}/g)?.join(' ') || '';
  },
  decrypt: (text, mapping = null) => {
    const morseToChar = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
      '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
      '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
      '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
      '-.--': 'Y', '--..': 'Z'
    };
    
    const defaultMapping = mapping || { '.': '1', '-': '2', 'x': '3' };
    const reverseMapping = {};
    for (let [key, value] of Object.entries(defaultMapping)) {
      reverseMapping[value] = key;
    }
    
    const digits = text.replace(/[^0-9\s]/g, '').replace(/\s/g, '');
    let morse = '';
    
    for (let digit of digits) {
      if (reverseMapping[digit]) {
        morse += reverseMapping[digit];
      }
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
