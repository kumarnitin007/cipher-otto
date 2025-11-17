export const railfenceCipher = {
  name: 'Rail Fence',
  description: 'Zigzag transposition cipher',
  category: 'transposition',
  difficulty: 'intermediate',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Writes the plaintext in a zigzag pattern across multiple rails, then reads off rows. The number of rails determines the encryption.',
  youtubeUrl: 'https://www.youtube.com/watch?v=wKjRwJTXQH4',
  funMessage: 'Ride the rails! Text zigzags like a train track!',
  relatedCiphers: [
    { name: 'Columnar Transposition', inApp: true, description: 'Another transposition cipher' },
    { name: 'Scytale', inApp: false, description: 'Ancient Greek transposition cipher' }
  ],
  /**
   * Encrypts text by writing it in a zigzag pattern across rails
   * @param {string} text - Plaintext to encrypt
   * @param {number} rails - Number of rails (rows) to use (2-10)
   * @returns {string} Encrypted text (characters read horizontally from rails)
   */
  encrypt: (text, rails = 3) => {
    rails = parseInt(rails) || 3;
    if (rails < 2) rails = 2; // Minimum 2 rails required
    // Remove non-letters and convert to uppercase
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    // Create array of rails (each rail is an array of characters)
    const fence = Array(rails).fill(null).map(() => []);
    let row = 0; // Current rail (0-indexed)
    let direction = 1; // Direction of movement: 1 = down, -1 = up
    
    // Write characters in zigzag pattern
    for (let char of cleanText) {
      fence[row].push(char); // Add character to current rail
      row += direction; // Move to next rail
      // Reverse direction at top or bottom rail
      if (row === 0 || row === rails - 1) direction *= -1;
    }
    
    // Read characters horizontally from all rails
    return fence.map(row => row.join('')).join('');
  },
  /**
   * Decrypts text by reconstructing the zigzag pattern
   * @param {string} text - Ciphertext to decrypt
   * @param {number} rails - Number of rails used in encryption
   * @returns {string} Decrypted text
   */
  decrypt: (text, rails = 3) => {
    rails = parseInt(rails) || 3;
    if (rails < 2) rails = 2;
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const fence = Array(rails).fill(null).map(() => []);
    const lengths = []; // Track how many characters belong to each rail
    let row = 0;
    let direction = 1;
    
    // Step 1: Calculate how many characters belong to each rail
    // This simulates the zigzag writing pattern to determine rail lengths
    for (let i = 0; i < cleanText.length; i++) {
      lengths[row] = (lengths[row] || 0) + 1;
      row += direction;
      if (row === 0 || row === rails - 1) direction *= -1;
    }
    
    // Step 2: Distribute ciphertext characters into rails based on calculated lengths
    let index = 0;
    for (let r = 0; r < rails; r++) {
      // Take characters from ciphertext equal to this rail's length
      fence[r] = cleanText.slice(index, index + lengths[r]).split('');
      index += lengths[r];
    }
    
    // Step 3: Read characters in zigzag order to reconstruct plaintext
    let result = '';
    row = 0;
    direction = 1;
    const positions = Array(rails).fill(0); // Track position in each rail
    
    for (let i = 0; i < cleanText.length; i++) {
      // Read character from current rail at current position
      result += fence[row][positions[row]++];
      row += direction;
      // Reverse direction at edges
      if (row === 0 || row === rails - 1) direction *= -1;
    }
    
    return result;
  }
};
