export const rsaCipher = {
  name: 'RSA',
  description: 'Asymmetric encryption (simplified)',
  category: 'substitution',
  difficulty: 'advanced',
  competitionLevel: 'divisionC',
  historicalPeriod: 'contemporary',
  info: 'RSA is a public-key cryptosystem. This simplified version demonstrates the concept using small prime numbers for educational purposes.',
  youtubeUrl: 'https://www.youtube.com/watch?v=wcbH4t5SJpg',
  funMessage: 'RSA uses prime numbers for security! This is a simplified educational version.',
  relatedCiphers: [
    { name: 'Affine Cipher', inApp: true, description: 'Mathematical substitution cipher' },
    { name: 'Hill Cipher', inApp: true, description: 'Matrix-based cipher' }
  ],
  /**
   * Encrypts text using RSA public key
   * @param {string} text - Plaintext to encrypt
   * @param {Object} publicKey - Public key object {n: number, e: number}
   * @returns {string} Encrypted text as space-separated numbers
   */
  encrypt: (text, publicKey = null) => {
    // Simplified RSA for educational purposes
    // Using small primes: p=3, q=11, n=33, e=3, d=7
    const defaultKey = publicKey || { n: 33, e: 3 };
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    
    return cleanText.split('').map(char => {
      // Convert letter to number: A=1, B=2, ..., Z=26
      const m = char.charCodeAt(0) - 64;
      if (m < 1 || m > 26) return char;
      // RSA encryption: c = m^e mod n (modular exponentiation)
      // Note: For real RSA, this would use efficient modular exponentiation
      const c = Math.pow(m, defaultKey.e) % defaultKey.n;
      // Pad with zeros to ensure 2-digit format
      return c.toString().padStart(2, '0');
    }).join(' ');
  },
  /**
   * Decrypts text using RSA private key
   * @param {string} text - Ciphertext as space-separated numbers
   * @param {Object} privateKey - Private key object {n: number, d: number}
   * @returns {string} Decrypted text
   */
  decrypt: (text, privateKey = null) => {
    const defaultKey = privateKey || { n: 33, d: 7 };
    // Extract numbers from ciphertext
    const numbers = text.trim().split(/\s+/).filter(n => n.match(/^\d+$/));
    
    return numbers.map(num => {
      const c = parseInt(num);
      // RSA decryption: m = c^d mod n (modular exponentiation)
      const m = Math.pow(c, defaultKey.d) % defaultKey.n;
      // Convert number back to letter (1-26 maps to A-Z)
      if (m >= 1 && m <= 26) {
        return String.fromCharCode(m + 64);
      }
      return '?'; // Invalid decryption result
    }).join('');
  }
};
