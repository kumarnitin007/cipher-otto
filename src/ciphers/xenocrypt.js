export const xenocryptCipher = {
  name: 'Xenocrypt',
  description: 'Spanish substitution cipher',
  category: 'substitution',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'A monoalphabetic substitution cipher used on Spanish text. Uses the 27-letter Spanish alphabet including Ã‘. Popular in cryptography competitions.',
  youtubeUrl: 'https://www.youtube.com/watch?v=aZ_94itKw28&t',
  funMessage: 'Â¡Hola! This cipher works with Spanish text! Try encrypting "HOLA MUNDO"!',
  relatedCiphers: [
    { name: 'Aristocrat Cipher', inApp: true, description: 'Similar monoalphabetic substitution cipher' },
    { name: 'Patristocrat Cipher', inApp: true, description: 'Same concept but removes spaces' },
    { name: 'Caesar Cipher', inApp: true, description: 'Simpler substitution cipher' }
  ],
  key: 'ZEBRASCDFGHIJKLMNOPQTUVWXYÃ‘',
  encrypt: (text, keyword = 'CRYPTO') => {
    // Create substitution key from keyword
    const createKey = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/[^A-ZÃ‘]/g, '').split(''))].join('');
      const spanishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÃ‘';
      let result = uniqueKey;
      for (let char of spanishAlphabet) {
        if (!result.includes(char)) result += char;
      }
      return result.slice(0, 27);
    };
    
    const substitutionKey = createKey(keyword);
    const plainAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÃ‘';
    
    // Normalize Spanish text (convert accented to unaccented)
    const normalize = (str) => {
      return str.toUpperCase()
        .replace(/Ã/g, 'A').replace(/Ã‰/g, 'E').replace(/Ã/g, 'I')
        .replace(/Ã“/g, 'O').replace(/Ãš/g, 'U').replace(/Ãœ/g, 'U');
    };
    
    const normalizedText = normalize(text);
    
    return normalizedText.split('').map(char => {
      const index = plainAlphabet.indexOf(char);
      if (index !== -1) {
        return substitutionKey[index];
      }
      return char; // Keep spaces and punctuation
    }).join('');
  },
  decrypt: (text, keyword = 'CRYPTO') => {
    const createKey = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/[^A-ZÃ‘]/g, '').split(''))].join('');
      const spanishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÃ‘';
      let result = uniqueKey;
      for (let char of spanishAlphabet) {
        if (!result.includes(char)) result += char;
      }
      return result.slice(0, 27);
    };
    
    const substitutionKey = createKey(keyword);
    const plainAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÃ‘';
    
    return text.toUpperCase().split('').map(char => {
      const index = substitutionKey.indexOf(char);
      if (index !== -1) {
        return plainAlphabet[index];
      }
      return char; // Keep spaces and punctuation
    }).join('');
  }
};
