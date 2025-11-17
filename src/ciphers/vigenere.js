export const vigenereCipher = {
  name: 'VigenÃ¨re',
  description: 'Polyalphabetic substitution cipher',
  category: 'polyalphabetic',
  difficulty: 'intermediate',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Uses a keyword to create multiple Caesar ciphers. Each letter of the keyword determines the shift for the corresponding plaintext letter.',
  youtubeUrl: 'https://www.youtube.com/watch?v=J1o2zo6HleY',
  funMessage: 'VigenÃ¨re adds keyword-based shifts! Much stronger than Caesar!',
  relatedCiphers: [
    { name: 'Caesar Cipher', inApp: true, description: 'Single shift substitution' },
    { name: 'Porta Cipher', inApp: true, description: 'Another keyword-based cipher' },
    { name: 'Beaufort Cipher', inApp: false, description: 'Variant of VigenÃ¨re' }
  ],
  /**
   * Encrypts text using VigenÃ¨re cipher with keyword
   * @param {string} text - Plaintext to encrypt
   * @param {string} keyword - Keyword for encryption (repeated to match text length)
   * @returns {string} Encrypted text
   */
  encrypt: (text, keyword = 'KEY') => {
    // Clean keyword: remove non-letters, convert to uppercase
    const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const cleanText = text.toUpperCase();
    let result = '';
    let keyIndex = 0; // Position in keyword (wraps around)
    
    for (let char of cleanText) {
      if (char.match(/[A-Z]/)) {
        // Get shift value from current keyword letter (0-25)
        const shift = cleanKeyword[keyIndex % cleanKeyword.length].charCodeAt(0) - 65;
        const code = char.charCodeAt(0);
        // Apply Caesar shift based on keyword letter
        const encrypted = String.fromCharCode(((code - 65 + shift) % 26) + 65);
        result += encrypted;
        keyIndex++; // Move to next keyword letter
      } else {
        // Preserve non-letter characters
        result += char;
      }
    }
    
    return result;
  },
  /**
   * Decrypts text using VigenÃ¨re cipher with keyword
   * @param {string} text - Ciphertext to decrypt
   * @param {string} keyword - Keyword used for encryption
   * @returns {string} Decrypted text
   */
  decrypt: (text, keyword = 'KEY') => {
    const cleanKeyword = keyword.toUpperCase().replace(/[^A-Z]/g, '') || 'KEY';
    const cleanText = text.toUpperCase();
    let result = '';
    let keyIndex = 0;
    
    for (let char of cleanText) {
      if (char.match(/[A-Z]/)) {
        // Get shift value from current keyword letter
        const shift = cleanKeyword[keyIndex % cleanKeyword.length].charCodeAt(0) - 65;
        const code = char.charCodeAt(0);
        // Reverse the shift (subtract instead of add, add 26 to handle negatives)
        const decrypted = String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
        result += decrypted;
        keyIndex++;
      } else {
        result += char;
      }
    }
    
    return result;
  }
};
