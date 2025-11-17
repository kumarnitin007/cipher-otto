export const caesarCipher = {
  name: 'Caesar Cipher',
  description: 'Shift each letter by a fixed number',
  category: 'substitution',
  difficulty: 'beginner',
  competitionLevel: 'divisionA',
  historicalPeriod: 'ancient',
  info: 'Named after Julius Caesar, who used it with a shift of 3.',
  youtubeUrl: 'https://www.youtube.com/watch?v=VKd4BxW7YkU',
  funMessage: 'Julius Caesar used this cipher over 2000 years ago! Try shifting your name by 3!',
  relatedCiphers: [
    { name: 'ROT13', inApp: false, description: 'A special Caesar cipher with shift of 13, commonly used in online forums' },
    { name: 'Atbash Cipher', inApp: true, description: 'Reverses the alphabet - A becomes Z, B becomes Y' },
    { name: 'Aristocrat Cipher', inApp: true, description: 'Random letter substitution that preserves word spaces' },
    { name: 'Affine Cipher', inApp: true, description: 'Mathematical substitution using multiplication and addition' }
  ],
  /**
   * Encrypts text by shifting each letter forward by the shift amount
   * @param {string} text - Plaintext to encrypt
   * @param {number} shift - Number of positions to shift (0-25)
   * @returns {string} Encrypted text
   */
  encrypt: (text, shift = 3) => {
    shift = parseInt(shift) || 3;
    return text.split('').map(char => {
      // Only process letters, preserve other characters
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        // Determine base: 65 for uppercase (A), 97 for lowercase (a)
        const base = code >= 65 && code <= 90 ? 65 : 97;
        // Shift letter and wrap around using modulo 26
        return String.fromCharCode(((code - base + shift) % 26) + base);
      }
      return char;
    }).join('');
  },
  /**
   * Decrypts text by shifting backwards (equivalent to encrypting with 26-shift)
   * @param {string} text - Ciphertext to decrypt
   * @param {number} shift - Number of positions the text was shifted
   * @returns {string} Decrypted text
   */
  decrypt: (text, shift = 3) => {
    shift = parseInt(shift) || 3;
    // Decryption is encryption with the inverse shift (26 - shift)
    return caesarCipher.encrypt(text, 26 - shift);
  }
};
