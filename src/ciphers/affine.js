export const affineCipher = {
  name: 'Affine Cipher',
  description: 'Mathematical cipher using formula',
  category: 'substitution',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Uses formula E(x) = (ax + b) mod 26.',
  youtubeUrl: 'https://www.youtube.com/watch?v=iyESl17IqFQ',
  funMessage: 'Math plus secret codes equals AWESOME!',
  relatedCiphers: [
    { name: 'Caesar Cipher', inApp: true, description: 'Special case of Affine where a=1' },
    { name: 'Atbash Cipher', inApp: true, description: 'Special case of Affine where a=-1, b=-1' },
    { name: 'Multiplicative Cipher', inApp: false, description: 'Affine cipher where b=0' }
  ],
  /**
   * Encrypts text using the affine formula: E(x) = (ax + b) mod 26
   * @param {string} text - Plaintext to encrypt
   * @param {number} a - Multiplier (must be coprime with 26)
   * @param {number} b - Shift amount (0-25)
   * @returns {string} Encrypted text
   */
  encrypt: (text, a = 5, b = 8) => {
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        // Convert letter to number (0-25)
        const x = code - base;
        // Apply affine transformation: (a*x + b) mod 26
        return String.fromCharCode(((a * x + b) % 26) + base);
      }
      return char;
    }).join('');
  },
  /**
   * Decrypts text using the inverse affine formula: D(y) = a^-1(y - b) mod 26
   * @param {string} text - Ciphertext to decrypt
   * @param {number} a - Multiplier used in encryption
   * @param {number} b - Shift amount used in encryption
   * @returns {string} Decrypted text
   */
  decrypt: (text, a = 5, b = 8) => {
    /**
     * Find modular multiplicative inverse of 'a' modulo 'm'
     * Finds x such that (a * x) mod m = 1
     */
    const modInverse = (a, m) => {
      for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
      }
      return 1;
    };
    // Calculate modular inverse of 'a' for decryption
    const aInv = modInverse(a, 26);
    return text.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const code = char.charCodeAt(0);
        const base = code >= 65 && code <= 90 ? 65 : 97;
        // Convert encrypted letter to number
        const y = code - base;
        // Apply inverse transformation: a^-1(y - b) mod 26
        // Add 26 before mod to handle negative values
        return String.fromCharCode(((aInv * (y - b + 26)) % 26) + base);
      }
      return char;
    }).join('');
  }
};
