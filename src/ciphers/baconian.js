export const baconianCipher = {
  name: 'Baconian Cipher',
  description: 'Binary encoding with A and B',
  category: 'encoding',
  difficulty: 'beginner',
  competitionLevel: 'divisionA',
  historicalPeriod: 'renaissance',
  info: 'Invented by Francis Bacon using As and Bs.',
  youtubeUrl: 'https://www.youtube.com/watch?v=T6lg0qC27I4',
  youtubeUrlAdvanced: 'https://www.youtube.com/watch?v=bQosctxFQFs',
  funMessage: 'This cipher uses only As and Bs! Like computer code from the 1600s!',
  relatedCiphers: [
    { name: 'Morse Code', inApp: false, description: 'Uses dots and dashes to encode letters' },
    { name: 'Binary Code', inApp: false, description: 'Modern digital encoding using 0s and 1s' }
  ],
  encrypt: (text) => {
    const bacon = {
      'A': 'AAAAA', 'B': 'AAAAB', 'C': 'AAABA', 'D': 'AAABB', 'E': 'AABAA',
      'F': 'AABAB', 'G': 'AABBA', 'H': 'AABBB', 'I': 'ABAAA', 'J': 'ABAAA',
      'K': 'ABAAB', 'L': 'ABABA', 'M': 'ABABB', 'N': 'ABBAA', 'O': 'ABBAB',
      'P': 'ABBBA', 'Q': 'ABBBB', 'R': 'BAAAA', 'S': 'BAAAB', 'T': 'BAABA',
      'U': 'BAABB', 'V': 'BAABB', 'W': 'BABAA', 'X': 'BABAB', 'Y': 'BABBA',
      'Z': 'BABBB'
    };
    return text.toUpperCase().split('').map(c => bacon[c] || c).join(' ');
  },
  decrypt: (text) => {
    const bacon = {
      'AAAAA': 'A', 'AAAAB': 'B', 'AAABA': 'C', 'AAABB': 'D', 'AABAA': 'E',
      'AABAB': 'F', 'AABBA': 'G', 'AABBB': 'H', 'ABAAA': 'I', 'ABAAB': 'K',
      'ABABA': 'L', 'ABABB': 'M', 'ABBAA': 'N', 'ABBAB': 'O', 'ABBBA': 'P',
      'ABBBB': 'Q', 'BAAAA': 'R', 'BAAAB': 'S', 'BAABA': 'T', 'BAABB': 'U',
      'BABAA': 'W', 'BABAB': 'X', 'BABBA': 'Y', 'BABBB': 'Z'
    };
    return text.split(' ').map(code => bacon[code] || code).join('');
  }
};