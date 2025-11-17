export const hill3x3Cipher = {
  name: 'Hill 3x3',
  description: 'Matrix-based cipher using 3x3 matrix',
  category: 'polygraphic',
  difficulty: 'advanced',
  competitionLevel: 'divisionC',
  historicalPeriod: 'modern',
  info: 'Encrypts triplets of letters using a 3x3 matrix. More secure than 2x2 but computationally more complex.',
  youtubeUrl: 'https://www.youtube.com/watch?v=2Vz0ZF3y1AM',
  funMessage: 'Hill 3x3 uses bigger matrices for triple the security!',
  relatedCiphers: [
    { name: 'Hill 2x2', inApp: true, description: 'Smaller matrix version' },
    { name: 'Affine Cipher', inApp: true, description: 'Mathematical substitution' }
  ],
  encrypt: (text, matrix = null) => {
    // Default matrix: [[1, 2, 0], [0, 3, 1], [1, 0, 1]]
    const defaultMatrix = matrix || [[1, 2, 0], [0, 3, 1], [1, 0, 1]];
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').padEnd(Math.ceil(text.replace(/[^A-Z]/g, '').length / 3) * 3, 'X');
    let result = '';
    
    for (let i = 0; i < cleanText.length; i += 3) {
      const char1 = cleanText[i] || 'X';
      const char2 = cleanText[i + 1] || 'X';
      const char3 = cleanText[i + 2] || 'X';
      const num1 = char1.charCodeAt(0) - 65;
      const num2 = char2.charCodeAt(0) - 65;
      const num3 = char3.charCodeAt(0) - 65;
      
      const enc1 = (defaultMatrix[0][0] * num1 + defaultMatrix[0][1] * num2 + defaultMatrix[0][2] * num3) % 26;
      const enc2 = (defaultMatrix[1][0] * num1 + defaultMatrix[1][1] * num2 + defaultMatrix[1][2] * num3) % 26;
      const enc3 = (defaultMatrix[2][0] * num1 + defaultMatrix[2][1] * num2 + defaultMatrix[2][2] * num3) % 26;
      
      result += String.fromCharCode(enc1 + 65) + String.fromCharCode(enc2 + 65) + String.fromCharCode(enc3 + 65);
    }
    
    return result;
  },
  decrypt: (text, matrix = null) => {
    // For 3x3, we need a valid invertible matrix
    // Using a simple example matrix
    const defaultMatrix = matrix || [[1, 2, 0], [0, 3, 1], [1, 0, 1]];
    
    // Calculate determinant
    const det = (
      defaultMatrix[0][0] * (defaultMatrix[1][1] * defaultMatrix[2][2] - defaultMatrix[1][2] * defaultMatrix[2][1]) -
      defaultMatrix[0][1] * (defaultMatrix[1][0] * defaultMatrix[2][2] - defaultMatrix[1][2] * defaultMatrix[2][0]) +
      defaultMatrix[0][2] * (defaultMatrix[1][0] * defaultMatrix[2][1] - defaultMatrix[1][1] * defaultMatrix[2][0])
    ) % 26;
    
    // Find modular inverse
    let detInv = 0;
    for (let i = 0; i < 26; i++) {
      if ((det * i) % 26 === 1 || (det * i) % 26 === 25) {
        detInv = i;
        break;
      }
    }
    
    // Calculate adjugate matrix
    const adj = [
      [
        (defaultMatrix[1][1] * defaultMatrix[2][2] - defaultMatrix[1][2] * defaultMatrix[2][1]) % 26,
        -(defaultMatrix[0][1] * defaultMatrix[2][2] - defaultMatrix[0][2] * defaultMatrix[2][1]) % 26,
        (defaultMatrix[0][1] * defaultMatrix[1][2] - defaultMatrix[0][2] * defaultMatrix[1][1]) % 26
      ],
      [
        -(defaultMatrix[1][0] * defaultMatrix[2][2] - defaultMatrix[1][2] * defaultMatrix[2][0]) % 26,
        (defaultMatrix[0][0] * defaultMatrix[2][2] - defaultMatrix[0][2] * defaultMatrix[2][0]) % 26,
        -(defaultMatrix[0][0] * defaultMatrix[1][2] - defaultMatrix[0][2] * defaultMatrix[1][0]) % 26
      ],
      [
        (defaultMatrix[1][0] * defaultMatrix[2][1] - defaultMatrix[1][1] * defaultMatrix[2][0]) % 26,
        -(defaultMatrix[0][0] * defaultMatrix[2][1] - defaultMatrix[0][1] * defaultMatrix[2][0]) % 26,
        (defaultMatrix[0][0] * defaultMatrix[1][1] - defaultMatrix[0][1] * defaultMatrix[1][0]) % 26
      ]
    ];
    
    // Inverse matrix = adjugate * detInv mod 26
    const invMatrix = adj.map(row => 
      row.map(val => ((val % 26 + 26) % 26 * detInv) % 26)
    );
    
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    
    for (let i = 0; i < cleanText.length; i += 3) {
      const char1 = cleanText[i] || 'X';
      const char2 = cleanText[i + 1] || 'X';
      const char3 = cleanText[i + 2] || 'X';
      const num1 = char1.charCodeAt(0) - 65;
      const num2 = char2.charCodeAt(0) - 65;
      const num3 = char3.charCodeAt(0) - 65;
      
      const dec1 = (invMatrix[0][0] * num1 + invMatrix[0][1] * num2 + invMatrix[0][2] * num3) % 26;
      const dec2 = (invMatrix[1][0] * num1 + invMatrix[1][1] * num2 + invMatrix[1][2] * num3) % 26;
      const dec3 = (invMatrix[2][0] * num1 + invMatrix[2][1] * num2 + invMatrix[2][2] * num3) % 26;
      
      result += String.fromCharCode(dec1 + 65) + String.fromCharCode(dec2 + 65) + String.fromCharCode(dec3 + 65);
    }
    
    return result;
  }
};
