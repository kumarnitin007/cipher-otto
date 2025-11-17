export const columnarCipher = {
  name: 'Complete Columnar',
  description: 'Transposition using keyword order',
  category: 'transposition',
  difficulty: 'intermediate',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Text is rearranged based on keyword order.',
  youtubeUrl: 'https://www.youtube.com/watch?v=giHMcSg9NE0', // Intermediate level
  youtubeUrlBeginner: 'https://www.youtube.com/watch?v=Rc4RDfW-8gg', // Beginner level
  youtubeUrlAdvanced: 'https://www.youtube.com/watch?v=mN3TX537zVk', // Advanced level
  funMessage: 'Your message does a dance and switches places!',
  relatedCiphers: [
    { name: 'Rail Fence Cipher', inApp: false, description: 'Writes text in zigzag pattern across rails' },
    { name: 'Route Cipher', inApp: false, description: 'Writes message in grid and reads in different pattern' }
  ],
  encrypt: (text, keyword = 'CRYPTO') => {
    const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    const keyLength = keyword.length;
    const keyOrder = keyword.toUpperCase().split('').map((char, idx) => ({ char, idx }))
      .sort((a, b) => a.char.localeCompare(b.char))
      .map((item, sortedIdx) => ({ ...item, order: sortedIdx }))
      .sort((a, b) => a.idx - b.idx)
      .map(item => item.order);
    const rows = Math.ceil(cleanText.length / keyLength);
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < keyLength; j++) {
        const charIndex = i * keyLength + j;
        grid[i][j] = charIndex < cleanText.length ? cleanText[charIndex] : 'X';
      }
    }
    let result = '';
    keyOrder.forEach((colIdx, order) => {
      const column = keyOrder.indexOf(order);
      for (let row = 0; row < rows; row++) {
        result += grid[row][column];
      }
    });
    return result;
  },
  decrypt: (text, keyword = 'CRYPTO') => {
    const keyLength = keyword.length;
    const rows = Math.ceil(text.length / keyLength);
    const keyOrder = keyword.toUpperCase().split('').map((char, idx) => ({ char, idx }))
      .sort((a, b) => a.char.localeCompare(b.char))
      .map((item, sortedIdx) => ({ ...item, order: sortedIdx }))
      .sort((a, b) => a.idx - b.idx)
      .map(item => item.order);
    const grid = Array(rows).fill().map(() => Array(keyLength).fill(''));
    let textIndex = 0;
    keyOrder.forEach((colIdx, order) => {
      const column = keyOrder.indexOf(order);
      for (let row = 0; row < rows; row++) {
        if (textIndex < text.length) {
          grid[row][column] = text[textIndex++];
        }
      }
    });
    let result = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < keyLength; col++) {
        result += grid[row][col];
      }
    }
    return result.replace(/X+$/, '');
  }
};
