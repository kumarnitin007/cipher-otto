export const hill2x2Cipher = {
  name: 'Hill 2x2',
  description: 'Matrix-based cipher using 2x2 matrix',
  category: 'polygraphic',
  difficulty: 'advanced',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Encrypts pairs of letters using a 2x2 matrix. Each pair is multiplied by the matrix modulo 26.',
  youtubeUrl: 'https://www.youtube.com/watch?v=AyiVMC-rJd8',
  funMessage: 'Hill cipher uses matrix multiplication! Math meets cryptography!',
  relatedCiphers: [
    { name: 'Hill 3x3', inApp: true, description: 'Larger matrix version' },
    { name: 'Affine Cipher', inApp: true, description: 'Mathematical substitution' }
  ],
  /**
   * Encrypts text using Hill 2x2 cipher
   * @param {string} text - Plaintext to encrypt
   * @param {Array<Array<number>>} matrix - 2x2 encryption matrix (default: [[3,3],[2,5]])
   * @returns {string} Encrypted text
   */
  encrypt: (text, matrix = null) => {
    // Default matrix: [[3, 3], [2, 5]]
    const defaultMatrix = matrix || [[3, 3], [2, 5]];
    // Clean text and pad with 'X' if odd length (Hill cipher works on pairs)
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').padEnd(Math.ceil(text.replace(/[^A-Z]/g, '').length / 2) * 2, 'X');
    let result = '';
    
    // Process text in pairs
    for (let i = 0; i < cleanText.length; i += 2) {
      const char1 = cleanText[i] || 'X';
      const char2 = cleanText[i + 1] || 'X';
      // Convert letters to numbers (0-25)
      const num1 = char1.charCodeAt(0) - 65;
      const num2 = char2.charCodeAt(0) - 65;
      
      // Matrix multiplication: [enc1, enc2] = Matrix * [num1, num2] mod 26
      const enc1 = (defaultMatrix[0][0] * num1 + defaultMatrix[0][1] * num2) % 26;
      const enc2 = (defaultMatrix[1][0] * num1 + defaultMatrix[1][1] * num2) % 26;
      
      // Convert numbers back to letters
      result += String.fromCharCode(enc1 + 65) + String.fromCharCode(enc2 + 65);
    }
    
    return result;
  },
  /**
   * Decrypts text using Hill 2x2 cipher
   * @param {string} text - Ciphertext to decrypt
   * @param {Array<Array<number>>} matrix - 2x2 encryption matrix used
   * @returns {string} Decrypted text
   */
  decrypt: (text, matrix = null) => {
    const defaultMatrix = matrix || [[3, 3], [2, 5]];
    
    // Step 1: Calculate determinant of the matrix mod 26
    // det = ad - bc (for 2x2 matrix [[a,b],[c,d]])
    const det = (defaultMatrix[0][0] * defaultMatrix[1][1] - defaultMatrix[0][1] * defaultMatrix[1][0] + 26) % 26;
    
    // Step 2: Find modular multiplicative inverse of determinant
    // Need detInv such that (det * detInv) mod 26 = 1
    let detInv = 0;
    for (let i = 0; i < 26; i++) {
      if ((det * i) % 26 === 1) {
        detInv = i;
        break;
      }
    }
    
    // Step 3: Calculate inverse matrix mod 26
    // For 2x2 matrix [[a,b],[c,d]], inverse = (1/det) * [[d,-b],[-c,a]]
    const invMatrix = [
      [(defaultMatrix[1][1] * detInv) % 26, (-defaultMatrix[0][1] * detInv + 26) % 26],
      [(-defaultMatrix[1][0] * detInv + 26) % 26, (defaultMatrix[0][0] * detInv) % 26]
    ];
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    
    // Process ciphertext in pairs
    for (let i = 0; i < cleanText.length; i += 2) {
      const char1 = cleanText[i] || 'X';
      const char2 = cleanText[i + 1] || 'X';
      const num1 = char1.charCodeAt(0) - 65;
      const num2 = char2.charCodeAt(0) - 65;
      
      // Matrix multiplication with inverse: [dec1, dec2] = InvMatrix * [num1, num2] mod 26
      const dec1 = (invMatrix[0][0] * num1 + invMatrix[0][1] * num2) % 26;
      const dec2 = (invMatrix[1][0] * num1 + invMatrix[1][1] * num2) % 26;
      
      result += String.fromCharCode(dec1 + 65) + String.fromCharCode(dec2 + 65);
    }
    
    return result;
  }
};
