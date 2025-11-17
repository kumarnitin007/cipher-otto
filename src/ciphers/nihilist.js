export const nihilistCipher = {
  name: 'Nihilist Cipher',
  description: 'Polybius square with numerical addition',
  category: 'polygraphic',
  difficulty: 'advanced',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Used by Russian Nihilists in the 1880s. Combines Polybius square with numerical addition.',
  youtubeUrl: 'https://www.youtube.com/watch?v=FLmk983WHg8&t',
  funMessage: 'Russian revolutionaries used this! Turns letters into numbers!',
  relatedCiphers: [
    { name: 'Straddling Checkerboard', inApp: true, description: 'Variable-length numerical encoding used by Soviet spies' },
    { name: 'Polybius Square', inApp: false, description: 'Converts letters to coordinates in a 5×5 grid' }
  ],
  encrypt: (text, keyword = 'CRYPTO', polybiusKey = 'CRYPTO') => {
    const createSquare = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/J/g, 'I').split(''))].join('');
      const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
      let square = uniqueKey;
      for (let char of alphabet) {
        if (!square.includes(char)) square += char;
      }
      return square.slice(0, 25);
    };
    const square = createSquare(polybiusKey);
    const getCoords = (char) => {
      const idx = square.indexOf(char === 'J' ? 'I' : char);
      return idx === -1 ? null : [Math.floor(idx / 5) + 1, (idx % 5) + 1];
    };
    const keyCoords = keyword.toUpperCase().split('').map(c => getCoords(c));
    const textClean = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = [];
    let keyIndex = 0;
    for (let char of textClean) {
      const textCoord = getCoords(char);
      if (textCoord && keyCoords[keyIndex]) {
        const sum = (textCoord[0] * 10 + textCoord[1]) + (keyCoords[keyIndex][0] * 10 + keyCoords[keyIndex][1]);
        result.push(sum);
        keyIndex = (keyIndex + 1) % keyCoords.length;
      }
    }
    return result.join(' ');
  },
  decrypt: (text, keyword = 'CRYPTO', polybiusKey = 'CRYPTO') => {
    const createSquare = (key) => {
      const uniqueKey = [...new Set(key.toUpperCase().replace(/J/g, 'I').split(''))].join('');
      const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
      let square = uniqueKey;
      for (let char of alphabet) {
        if (!square.includes(char)) square += char;
      }
      return square.slice(0, 25);
    };
    const square = createSquare(polybiusKey);
    const getChar = (row, col) => {
      if (row < 1 || row > 5 || col < 1 || col > 5) return '?';
      return square[(row - 1) * 5 + (col - 1)];
    };
    const getCoords = (char) => {
      const idx = square.indexOf(char === 'J' ? 'I' : char);
      return idx === -1 ? null : [Math.floor(idx / 5) + 1, (idx % 5) + 1];
    };
    const keyCoords = keyword.toUpperCase().split('').map(c => getCoords(c));
    const numbers = text.split(' ').map(n => parseInt(n)).filter(n => !isNaN(n));
    let result = '';
    let keyIndex = 0;
    for (let num of numbers) {
      if (keyCoords[keyIndex]) {
        const keyVal = keyCoords[keyIndex][0] * 10 + keyCoords[keyIndex][1];
        const diff = num - keyVal;
        result += getChar(Math.floor(diff / 10), diff % 10);
        keyIndex = (keyIndex + 1) % keyCoords.length;
      }
    }
    return result;
  }
};
