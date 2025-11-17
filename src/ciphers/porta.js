export const portaCipher = {
  name: 'Porta Cipher',
  description: 'Polyalphabetic substitution with keyword',
  category: 'polyalphabetic',
  difficulty: 'intermediate',
  competitionLevel: 'divisionB',
  historicalPeriod: 'renaissance',
  info: 'Created by Giovanni Battista della Porta in 1563. Uses 13 alphabets.',
  youtubeUrl: 'https://www.youtube.com/watch?v=mXOcQ8QwlYI',
  funMessage: 'This Renaissance cipher uses 13 alphabets! It\'s self-reciprocal!',
  relatedCiphers: [
    { name: 'VigenÃ¨re Cipher', inApp: false, description: 'Classic polyalphabetic cipher using keyword' },
    { name: 'Beaufort Cipher', inApp: false, description: 'Similar to VigenÃ¨re but uses subtraction' },
    { name: 'Caesar Cipher', inApp: true, description: 'Simple shift cipher' }
  ],
  encrypt: (text, keyword = 'CRYPTO') => {
    const tableau = {
      'AB': 'NOPQRSTUVWXYZABCDEFGHIJKLM',
      'CD': 'OPQRSTUVWXYZNMABCDEFGHIJKL',
      'EF': 'PQRSTUVWXYZNOLMABCDEFGHIJK',
      'GH': 'QRSTUVWXYZNOPKLMABCDEFGHIJ',
      'IJ': 'RSTUVWXYZNOPQJKLMABCDEFGHI',
      'KL': 'STUVWXYZNOPQRIJKLMABCDEFGH',
      'MN': 'TUVWXYZNOPQRSHIJKLMABCDEFG',
      'OP': 'UVWXYZNOPQRSTGHIJKLMABCDEF',
      'QR': 'VWXYZNOPQRSTUFGHIJKLMABCDE',
      'ST': 'WXYZNOPQRSTUVEFGHIJKLMABCD',
      'UV': 'XYZNOPQRSTUVWDEFGHIJKLMABC',
      'WX': 'YZNOPQRSTUVWXCDEFGHIJKLMAB',
      'YZ': 'ZNOPQRSTUVWXYBCDEFGHIJKLMA'
    };
    
    const getAlphabet = (char) => {
      char = char.toUpperCase();
      for (let key in tableau) {
        if (key.includes(char)) return tableau[key];
      }
      return tableau['AB'];
    };
    
    const plainAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    
    let result = '';
    for (let i = 0; i < cleanText.length; i++) {
      const keyChar = cleanKey[i % cleanKey.length];
      const textChar = cleanText[i];
      const alphabet = getAlphabet(keyChar);
      const index = plainAlpha.indexOf(textChar);
      result += alphabet[index];
    }
    return result;
  },
  decrypt: (text, keyword = 'CRYPTO') => {
    // Porta cipher is self-reciprocal
    return portaCipher.encrypt(text, keyword);
  }
};