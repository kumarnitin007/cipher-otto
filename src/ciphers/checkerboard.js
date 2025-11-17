export const checkerboardCipher = {
  name: 'Straddling Checkerboard',
  description: 'Variable-length numerical encoding',
  category: 'polygraphic',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Used by Soviet spies during the Cold War.',
  youtubeUrl: 'https://www.youtube.com/watch?v=1ggE6xkeQUw',
  funMessage: 'Cold War spies LOVED this cipher! Real spy techniques!',
  relatedCiphers: [
    { name: 'Nihilist Cipher', inApp: true, description: 'Russian cipher using Polybius square with addition' }
  ],
  encrypt: (text, key = 'CRYPTO', blankPositions = '2,6') => {
    const blanks = blankPositions.split(',').map(n => parseInt(n.trim()));
    const alphabet = [...new Set(key.toUpperCase() + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.replace(/J/g, 'I'))].join('').slice(0, 28);
    const board = {};
    let letterIndex = 0;
    for (let col = 0; col < 10; col++) {
      if (!blanks.includes(col)) {
        board[alphabet[letterIndex]] = col.toString();
        letterIndex++;
      }
    }
    for (let blank of blanks) {
      for (let col = 0; col < 10; col++) {
        if (letterIndex < alphabet.length) {
          board[alphabet[letterIndex]] = blank.toString() + col.toString();
          letterIndex++;
        }
      }
    }
    const cleanText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    return cleanText.split('').map(c => board[c] || '').join('');
  },
  decrypt: () => 'Requires board reconstruction'
};
