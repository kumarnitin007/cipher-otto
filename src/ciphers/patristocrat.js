export const patristocratCipher = {
  name: 'Patristocrat Cipher',
  description: 'Monoalphabetic substitution without spaces',
  category: 'substitution',
  difficulty: 'intermediate',
  competitionLevel: 'divisionB',
  historicalPeriod: 'modern',
  info: 'Similar to Aristocrat but removes all spaces, making it harder to solve.',
  youtubeUrl: 'https://www.youtube.com/watch?v=WRhiaHFBZLw',
  funMessage: 'No spaces allowed! This makes word boundaries invisible!',
  key: 'ZEBRASCDFGHIJKLMNOPQTUVWXY',
  relatedCiphers: [
    { name: 'Aristocrat Cipher', inApp: true, description: 'Same cipher but preserves spaces' },
    { name: 'Caesar Cipher', inApp: true, description: 'Simple shift substitution' },
    { name: 'Atbash Cipher', inApp: true, description: 'Reverses the alphabet' }
  ],
  encrypt: (text) => {
    const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = patristocratCipher.key;
    return text.toUpperCase().replace(/[^A-Z]/g, '').split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return key[plain.indexOf(char)];
      }
      return '';
    }).join('');
  },
  decrypt: (text) => {
    const plain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const key = patristocratCipher.key;
    return text.toUpperCase().split('').map(char => {
      if (char.match(/[A-Z]/)) {
        return plain[key.indexOf(char)];
      }
      return char;
    }).join('');
  }
};