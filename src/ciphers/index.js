/**
 * Cipher Algorithms Index
 * 
 * This file imports and exports all cipher algorithms from their individual files.
 * Each cipher is defined in its own file for better maintainability and organization.
 * 
 * Structure:
 * - Each cipher file exports a single cipher object (e.g., caesarCipher)
 * - This index file imports all ciphers and exports them as cipherAlgorithms
 * - The main app imports cipherAlgorithms from this index file
 */

// Import all cipher algorithms
import { caesarCipher } from './caesar';
import { atbashCipher } from './atbash';
import { aristocratCipher } from './aristocrat';
import { affineCipher } from './affine';
import { nihilistCipher } from './nihilist';
import { checkerboardCipher } from './checkerboard';
import { columnarCipher } from './columnar';
import { baconianCipher } from './baconian';
import { portaCipher } from './porta';
import { patristocratCipher } from './patristocrat';
import { cryptarithmCipher } from './cryptarithm';
import { fractionatedMorseCipher } from './fractionatedMorse';
import { xenocryptCipher } from './xenocrypt';
import { railfenceCipher } from './railfence';
import { polluxCipher } from './pollux';
import { morbitCipher } from './morbit';
import { vigenereCipher } from './vigenere';
import { rsaCipher } from './rsa';
import { aristocratMisspelledCipher } from './aristocratMisspelled';
import { dancingMenCipher } from './dancingMen';
import { hill2x2Cipher } from './hill2x2';
import { hill3x3Cipher } from './hill3x3';

/**
 * Collection of all cipher algorithms
 * Each cipher is an object with:
 * - name: Display name
 * - description: Short description
 * - category: Type of cipher (substitution, transposition, etc.)
 * - difficulty: Beginner, intermediate, or advanced
 * - competitionLevel: Division A, B, C, or Open
 * - historicalPeriod: Ancient, Medieval, Renaissance, Modern, or Contemporary
 * - encrypt: Function to encrypt text
 * - decrypt: Function to decrypt text
 * - info: Additional information about the cipher
 * - relatedCiphers: Array of related cipher references
 */
export const cipherAlgorithms = {
  caesar: caesarCipher,
  atbash: atbashCipher,
  aristocrat: aristocratCipher,
  affine: affineCipher,
  nihilist: nihilistCipher,
  checkerboard: checkerboardCipher,
  columnar: columnarCipher,
  baconian: baconianCipher,
  porta: portaCipher,
  patristocrat: patristocratCipher,
  cryptarithm: cryptarithmCipher,
  fractionatedMorse: fractionatedMorseCipher,
  xenocrypt: xenocryptCipher,
  railfence: railfenceCipher,
  pollux: polluxCipher,
  morbit: morbitCipher,
  vigenere: vigenereCipher,
  rsa: rsaCipher,
  aristocratMisspelled: aristocratMisspelledCipher,
  dancingMen: dancingMenCipher,
  hill2x2: hill2x2Cipher,
  hill3x3: hill3x3Cipher
};
