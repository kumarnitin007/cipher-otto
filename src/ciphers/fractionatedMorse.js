export const fractionatedMorseCipher = {
  name: 'Fractionated Morse',
  description: 'Morse code with keyword substitution',
  category: 'polyalphabetic',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Converts text to Morse code, then groups into triplets and substitutes using a keyword-based table. Popular in cryptography competitions.',
  youtubeUrl: 'https://www.youtube.com/watch?v=lDWsHyyoW_A',
  funMessage: 'Morse code meets substitution! This is a favorite in crypto competitions!',
  relatedCiphers: [
    { name: 'Nihilist Cipher', inApp: true, description: 'Also uses keyword-based substitution with numbers' },
    { name: 'Morse Code', inApp: false, description: 'Basic encoding using dots and dashes' },
    { name: 'Porta Cipher', inApp: true, description: 'Another keyword-based polyalphabetic cipher' }
  ],
  encrypt: (text, keyword = 'CRYPTO') => {
    const morseCode = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
      '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
      '8': '---..', '9': '----.'
    };
    
    // Create substitution table from keyword
    const createTable = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/[^A-Z]/g, '').split(''))].join('');
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let table = uniqueKey;
      for (let char of alphabet) {
        if (!table.includes(char)) table += char;
      }
      return table.slice(0, 26);
    };
    
    const table = createTable(keyword);
    const cleanText = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Convert to Morse code
    let morse = '';
    for (let char of cleanText) {
      if (morseCode[char]) {
        morse += morseCode[char] + 'x'; // x is separator
      }
    }
    morse += 'xxx'; // Final separator
    
    // Group into triplets and substitute
    let result = '';
    for (let i = 0; i < morse.length; i += 3) {
      const triplet = morse.slice(i, i + 3).padEnd(3, 'x');
      const morseToTriplet = {
        '...': 0, '..-': 1, '..x': 2, '.-.': 3, '.--': 4, '.-x': 5,
        '.x.': 6, '.x-': 7, '.xx': 8, '-..': 9, '-.-': 10, '-.x': 11,
        '--.': 12, '---': 13, '--x': 14, '-x.': 15, '-x-': 16, '-xx': 17,
        'x..': 18, 'x.-': 19, 'x.x': 20, 'x-.': 21, 'x--': 22, 'x-x': 23,
        'xx.': 24, 'xx-': 25, 'xxx': 26
      };
      
      const index = morseToTriplet[triplet];
      if (index !== undefined && index < 26) {
        result += table[index];
      }
    }
    
    return result;
  },
  decrypt: (text, keyword = 'CRYPTO') => {
    const morseCode = {
      '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F',
      '--.': 'G', '....': 'H', '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
      '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R',
      '...': 'S', '-': 'T', '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
      '-.--': 'Y', '--..': 'Z', '-----': '0', '.----': '1', '..---': '2',
      '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7',
      '---..': '8', '----.': '9'
    };
    
    const createTable = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/[^A-Z]/g, '').split(''))].join('');
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let table = uniqueKey;
      for (let char of alphabet) {
        if (!table.includes(char)) table += char;
      }
      return table.slice(0, 26);
    };
    
    const table = createTable(keyword);
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    // Convert letters back to triplets
    const tripletToMorse = {
      0: '...', 1: '..-', 2: '..x', 3: '.-.', 4: '.--', 5: '.-x',
      6: '.x.', 7: '.x-', 8: '.xx', 9: '-..', 10: '-.-', 11: '-.x',
      12: '--.', 13: '---', 14: '--x', 15: '-x.', 16: '-x-', 17: '-xx',
      18: 'x..', 19: 'x.-', 20: 'x.x', 21: 'x-.', 22: 'x--', 23: 'x-x',
      24: 'xx.', 25: 'xx-', 26: 'xxx'
    };
    
    let morse = '';
    for (let char of cleanText) {
      const index = table.indexOf(char);
      if (index !== -1 && index < 26) {
        morse += tripletToMorse[index] || '';
      }
    }
    
    // Convert Morse back to text
    let result = '';
    let currentMorse = '';
    let i = 0;
    while (i < morse.length) {
      const char = morse[i];
      if (char === 'x') {
        // 'x' is a separator, process accumulated morse
        if (currentMorse && morseCode[currentMorse]) {
          result += morseCode[currentMorse];
          currentMorse = '';
        }
        i++;
      } else {
        // Accumulate dots and dashes
        currentMorse += char;
        if (morseCode[currentMorse]) {
          result += morseCode[currentMorse];
          currentMorse = '';
        }
        i++;
      }
    }
    
    // Process any remaining morse
    if (currentMorse && morseCode[currentMorse]) {
      result += morseCode[currentMorse];
    }
    
    return result;
  }
};