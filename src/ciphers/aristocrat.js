export const aristocratCipher = {
  name: 'Aristocrat Cipher',
  description: 'Monoalphabetic substitution with spaces',
  category: 'substitution',
  difficulty: 'intermediate',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'A substitution cipher that preserves word boundaries.',
  youtubeUrl: 'https://www.youtube.com/watch?v=1LVBCOOsYAA&list=PLKS2onRfwJBMvSUHC3kVUZL35xn9xFtXj&index=4', // K1
  youtubeUrlK2: 'https://www.youtube.com/watch?v=3iNsLoijl60&list=PLKS2onRfwJBMvSUHC3kVUZL35xn9xFtXj&index=6', // K2
  youtubeUrlK3: 'https://www.youtube.com/watch?v=BMMns0PHz70&list=PLKS2onRfwJBMvSUHC3kVUZL35xn9xFtXj&index=8', // K3
  funMessage: 'Be a detective like Sherlock Holmes! Look for THE and AND!',
  key: 'ZEBRASCDFGHIJKLMNOPQTUVWXY',
  relatedCiphers: [
    { name: 'Patristocrat Cipher', inApp: true, description: 'Same as Aristocrat but removes all spaces between words' },
    { name: 'Caesar Cipher', inApp: true, description: 'Simple shift substitution cipher' },
    { name: 'Atbash Cipher', inApp: true, description: 'Reverses the alphabet completely' },
    { name: 'Affine Cipher', inApp: true, description: 'Mathematical substitution cipher' }
  ],
  /**
   * Encrypts text using monoalphabetic substitution while preserving spaces
   * @param {string} text - Plaintext to encrypt
   * @returns {string} Encrypted text with spaces preserved
   */
  encrypt: (text) => {
    const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = aristocratCipher.key;
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        // Map plain letter to cipher letter using substitution key
        return key[plain.indexOf(char)];
      }
      // Preserve spaces and punctuation
      return char;
    }).join('');
  },
  /**
   * Decrypts text by reversing the substitution mapping
   * @param {string} text - Ciphertext to decrypt
   * @returns {string} Decrypted text
   */
  decrypt: (text) => {
    const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = aristocratCipher.key;
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        // Find cipher letter in key, map back to plain letter
        return plain[key.indexOf(char)];
      }
      return char;
    }).join('');
  }
};
