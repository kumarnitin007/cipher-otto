export const atbashCipher = {
  name: 'Atbash Cipher',
  description: 'Reverse alphabet substitution',
  category: 'substitution',
  difficulty: 'beginner',
  competitionLevel: 'divisionA',
  historicalPeriod: 'ancient',
  info: 'One of the oldest known ciphers. A becomes Z, B becomes Y.',
  youtubeUrl: 'https://www.youtube.com/watch?v=17o9l4D2xyI',
  funMessage: 'The alphabet is doing a backflip! Try encrypting PIZZA!',
  relatedCiphers: [
    { name: 'Caesar Cipher', inApp: true, description: 'Shifts letters by a fixed amount' },
    { name: 'Aristocrat Cipher', inApp: true, description: 'Random letter substitution with preserved spaces' },
    { name: 'Simple Substitution', inApp: false, description: 'Each letter maps to another letter randomly' },
    { name: 'Pigpen Cipher', inApp: false, description: 'Substitutes letters with geometric symbols' }
  ],
  /**
   * Encrypts text using Atbash cipher (reverses alphabet)
   * @param {string} text - Plaintext to encrypt
   * @returns {string} Encrypted text
   */
  encrypt: (text) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const isUpper = code >= 65 && code <= 90;
        const base = isUpper ? 65 : 97;
        // Reverse alphabet: A(0) -> Z(25), B(1) -> Y(24), etc.
        return String.fromCharCode(base + (25 - (code - base)));
      }
      return char;
    }).join('');
  },
  /**
   * Decrypts text using Atbash cipher (same as encryption since it's self-reciprocal)
   * @param {string} text - Ciphertext to decrypt
   * @returns {string} Decrypted text
   */
  decrypt: (text) => atbashCipher.encrypt(text)
};
