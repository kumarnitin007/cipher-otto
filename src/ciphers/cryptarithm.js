export const cryptarithmCipher = {
  name: 'Cryptarithm',
  description: 'Mathematical puzzle with letter substitution',
  category: 'puzzle',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'A type of mathematical puzzle where digits are replaced by letters. Each letter represents a unique digit, and the equation must be mathematically correct.',
  youtubeUrl: 'https://www.puzzles-to-print.com/math-puzzles/cryptarithms.shtml', // Website resource
  funMessage: 'Math meets cryptography! SEND + MORE = MONEY can you solve it?',
  relatedCiphers: [
    { name: 'Aristocrat Cipher', inApp: true, description: 'Letter substitution puzzle' },
    { name: 'Alphametics', inApp: false, description: 'Classic cryptarithm puzzles' }
  ],
  /**
   * Parses a cryptarithm equation into its component words and operator
   * Example: "SEND + MORE = MONEY" â†’ { parts: [{word: 'SEND'}, {word: 'MORE'}, {word: 'MONEY'}], operator: '+' }
   * @param {string} equation - Equation string (e.g., "SEND + MORE = MONEY")
   * @returns {Object} Object with parts array and operator
   */
  parseEquation: (equation) => {
    const cleaned = equation.toUpperCase().replace(/\s+/g, ' ').trim();
    const operators = ['+', '-', '*', '/', '=', 'Ã—', 'Ã·'];
    let parts = []; // Array of word objects
    let currentWord = ''; // Accumulating current word
    let operator = null; // Mathematical operator (+, -, *, /)
    
    // Parse equation character by character
    for (let char of cleaned) {
      if (operators.includes(char)) {
        // Found an operator, save current word if exists
        if (currentWord) {
          parts.push({ type: 'word', value: currentWord });
          currentWord = '';
        }
        // Track the operator (first non-= operator is the main operator)
        if (char === '=') {
          operator = '=';
        } else if (operator === null) {
          operator = char;
        }
      } else if (char.match(/[A-Z]/)) {
        // Accumulate letters into current word
        currentWord += char;
      } else if (char === ' ') {
        // Skip spaces
      }
    }
    // Save last word if exists
    if (currentWord) {
      parts.push({ type: 'word', value: currentWord });
    }
    
    return { parts, operator };
  },
  
  /**
   * Converts a word to a number using the letter-to-digit mapping
   * Example: wordToNumber("SEND", {S:'9', E:'5', N:'6', D:'7'}) â†’ 9567
   * @param {string} word - Word to convert (e.g., "SEND")
   * @param {Object} mapping - Letter-to-digit mapping object
   * @returns {number|null} Number representation or null if mapping incomplete/invalid
   */
  wordToNumber: (word, mapping) => {
    let numStr = '';
    // Convert each letter to its mapped digit
    for (let char of word) {
      if (mapping[char] !== undefined) {
        numStr += mapping[char];
      } else {
        return null; // Mapping incomplete - letter not found
      }
    }
    // Check for leading zeros (invalid in cryptarithms - numbers can't start with 0)
    if (numStr.length > 1 && numStr[0] === '0') {
      return null;
    }
    return parseInt(numStr);
  },
  
  /**
   * Validates if a cryptarithm equation is mathematically correct
   * Checks: mapping completeness, unique digit assignment, mathematical correctness
   * @param {string} equation - Equation to validate (e.g., "SEND + MORE = MONEY")
   * @param {Object} mapping - Letter-to-digit mapping object
   * @returns {Object} Validation result with {valid: boolean, error?: string, result?: number, numbers?: Array}
   */
  validateEquation: (equation, mapping) => {
    // Step 1: Parse equation into components
    const parsed = cryptarithmCipher.parseEquation(equation);
    if (parsed.parts.length < 3 || !parsed.operator) {
      return { valid: false, error: 'Invalid equation format' };
    }
    
    // Step 2: Convert words to numbers
    const words = parsed.parts.map(p => p.value);
    const numbers = words.map(w => cryptarithmCipher.wordToNumber(w, mapping));
    
    // Step 3: Check if all mappings are complete
    if (numbers.some(n => n === null)) {
      return { valid: false, error: 'Incomplete letter mapping' };
    }
    
    // Step 4: Check for duplicate digits (each letter must map to unique digit)
    const digitValues = Object.values(mapping);
    if (new Set(digitValues).size !== digitValues.length) {
      return { valid: false, error: 'Each letter must map to a unique digit' };
    }
    
    // Step 5: Perform the mathematical calculation
    let result;
    if (parsed.operator === '+' || parsed.operator === undefined) {
      result = numbers[0] + numbers[1];
    } else if (parsed.operator === '-') {
      result = numbers[0] - numbers[1];
    } else if (parsed.operator === '*' || parsed.operator === 'Ã—') {
      result = numbers[0] * numbers[1];
    } else if (parsed.operator === '/' || parsed.operator === 'Ã·') {
      if (numbers[1] === 0) return { valid: false, error: 'Division by zero' };
      result = numbers[0] / numbers[1];
    }
    
    // Step 6: Compare calculated result with expected result (third word)
    const expectedResult = numbers[2];
    if (result === expectedResult) {
      return { valid: true, result: result, numbers: numbers };
    } else {
      return { valid: false, error: `Equation doesn't balance: ${numbers[0]} ${parsed.operator} ${numbers[1]} = ${result}, but expected ${expectedResult}` };
    }
  },
  
  encrypt: (text, mapping = null) => {
    // If mapping is provided as string, parse it
    let digitMap = mapping;
    if (!mapping) {
      // Default mapping for SEND + MORE = MONEY
      digitMap = {
        'S': '9', 'E': '5', 'N': '6', 'D': '7',
        'M': '1', 'O': '0', 'R': '8', 'Y': '2'
      };
    } else if (typeof mapping === 'string') {
      // Parse string format like "S=9,E=5,N=6,D=7,M=1,O=0,R=8,Y=2"
      digitMap = {};
      mapping.split(',').forEach(pair => {
        const [letter, digit] = pair.split('=').map(s => s.trim());
        if (letter && digit) {
          digitMap[letter.toUpperCase()] = digit;
        }
      });
    }
    
    return text.toUpperCase().split('').map(char => {
      if (digitMap && digitMap[char]) {
        return digitMap[char];
      }
      return char;
    }).join('');
  },
  
  decrypt: (text, mapping = null) => {
    // Reverse mapping: digit to letter
    let letterMap = {};
    if (!mapping) {
      // Default reverse mapping
      letterMap = {
        '9': 'S', '5': 'E', '6': 'N', '7': 'D',
        '1': 'M', '0': 'O', '8': 'R', '2': 'Y'
      };
    } else if (typeof mapping === 'string') {
      // Parse and reverse
      mapping.split(',').forEach(pair => {
        const [letter, digit] = pair.split('=').map(s => s.trim());
        if (letter && digit) {
          letterMap[digit] = letter.toUpperCase();
        }
      });
    } else {
      // If mapping is object, reverse it
      for (let [letter, digit] of Object.entries(mapping)) {
        letterMap[digit] = letter.toUpperCase();
      }
    }
    
    return text.split('').map(char => {
      if (letterMap[char]) {
        return letterMap[char];
      }
      return char;
    }).join('');
  }
};
