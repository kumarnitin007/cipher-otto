/**
 * ============================================================================
 * CipherInputs Component
 * ============================================================================
 * 
 * This component renders cipher-specific parameter input fields based on the
 * currently selected cipher. Different ciphers require different parameters:
 * 
 * - Caesar: Shift value (0-25)
 * - Affine: Multiplier (a) and shift (b) values
 * - Vigenere/Columnar/Porta/etc.: Keyword inputs
 * - RSA: Public and private key pairs (n, e, d)
 * - Cryptarithm: Equation and letter-to-digit mapping with validation
 * - Rail Fence: Number of rails (2-10)
 * 
 * The component conditionally renders the appropriate input fields based on
 * the selectedCipher prop, providing a clean and organized interface for
 * configuring cipher parameters.
 * 
 * @component
 * @param {string} selectedCipher - The currently selected cipher key
 * @param {Object} ...props - All cipher parameter state values and setters
 * @returns {JSX.Element} Conditional input fields for the selected cipher
 */

import React from 'react';
import { cipherAlgorithms } from '../ciphers';

const CipherInputs = ({
  selectedCipher,
  // Caesar
  caesarShift,
  setCaesarShift,
  // Affine
  affineA,
  setAffineA,
  affineB,
  setAffineB,
  // Keywords
  columnarKeyword,
  setColumnarKeyword,
  checkerboardKey,
  setCheckerboardKey,
  checkerboardBlanks,
  setCheckerboardBlanks,
  nihilistKeyword,
  setNihilistKeyword,
  nihilistPolybiusKey,
  setNihilistPolybiusKey,
  portaKeyword,
  setPortaKeyword,
  fractionatedMorseKeyword,
  setFractionatedMorseKeyword,
  xenocryptKeyword,
  setXenocryptKeyword,
  vigenereKeyword,
  setVigenereKeyword,
  // Cryptarithm
  cryptarithmEquation,
  setCryptarithmEquation,
  cryptarithmMapping,
  setCryptarithmMapping,
  cryptarithmValidation,
  setCryptarithmValidation,
  inputText,
  // Rail Fence
  railfenceRails,
  setRailfenceRails,
  // RSA
  rsaPublicKey,
  setRsaPublicKey,
  rsaPrivateKey,
  setRsaPrivateKey
}) => {
  return (
    <>
      {selectedCipher === 'caesar' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Shift (0-25):</label>
          <input 
            type="number" 
            min="0" 
            max="25" 
            value={caesarShift} 
            onChange={(e) => setCaesarShift(parseInt(e.target.value) || 0)} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
          />
        </div>
      )}

      {selectedCipher === 'affine' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30 space-y-3">
          <div>
            <label className="text-xs text-purple-200 block mb-1">Value a (must be coprime with 26):</label>
            <input 
              type="number" 
              value={affineA} 
              onChange={(e) => setAffineA(parseInt(e.target.value) || 5)} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
          <div>
            <label className="text-xs text-purple-200 block mb-1">Value b (0-25):</label>
            <input 
              type="number" 
              value={affineB} 
              onChange={(e) => setAffineB(parseInt(e.target.value) || 8)} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
        </div>
      )}

      {selectedCipher === 'nihilist' && (
        <div className="mb-4 space-y-3 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <div>
            <label className="text-xs text-purple-200 block mb-1">Keyword:</label>
            <input 
              type="text" 
              value={nihilistKeyword} 
              onChange={(e) => setNihilistKeyword(e.target.value.toUpperCase())} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
          <div>
            <label className="text-xs text-purple-200 block mb-1">Polybius Key:</label>
            <input 
              type="text" 
              value={nihilistPolybiusKey} 
              onChange={(e) => setNihilistPolybiusKey(e.target.value.toUpperCase())} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
        </div>
      )}

      {selectedCipher === 'columnar' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Keyword:</label>
          <input 
            type="text" 
            value={columnarKeyword} 
            onChange={(e) => setColumnarKeyword(e.target.value.toUpperCase())} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
          />
        </div>
      )}

      {selectedCipher === 'checkerboard' && (
        <div className="mb-4 space-y-3 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <div>
            <label className="text-xs text-purple-200 block mb-1">Key:</label>
            <input 
              type="text" 
              value={checkerboardKey} 
              onChange={(e) => setCheckerboardKey(e.target.value.toUpperCase())} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
          <div>
            <label className="text-xs text-purple-200 block mb-1">Blank positions (comma-separated):</label>
            <input 
              type="text" 
              value={checkerboardBlanks} 
              onChange={(e) => setCheckerboardBlanks(e.target.value)} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            />
          </div>
        </div>
      )}

      {selectedCipher === 'porta' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Keyword:</label>
          <input 
            type="text" 
            value={portaKeyword} 
            onChange={(e) => setPortaKeyword(e.target.value.toUpperCase())} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
          />
        </div>
      )}

      {selectedCipher === 'fractionatedMorse' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Keyword:</label>
          <input 
            type="text" 
            value={fractionatedMorseKeyword} 
            onChange={(e) => setFractionatedMorseKeyword(e.target.value.toUpperCase())} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            placeholder="CRYPTO"
          />
          <div className="text-xs text-purple-300 mt-2">💡 Creates substitution table from keyword for Morse triplet encoding</div>
        </div>
      )}

      {selectedCipher === 'xenocrypt' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Keyword:</label>
          <input 
            type="text" 
            value={xenocryptKeyword} 
            onChange={(e) => setXenocryptKeyword(e.target.value.toUpperCase())} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            placeholder="CRYPTO"
          />
          <div className="text-xs text-purple-300 mt-2">💡 Works with Spanish alphabet (A-Z + Ñ). Accented letters are normalized.</div>
        </div>
      )}

      {selectedCipher === 'railfence' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Number of Rails (2-10):</label>
          <input 
            type="number" 
            min="2" 
            max="10" 
            value={railfenceRails} 
            onChange={(e) => setRailfenceRails(parseInt(e.target.value) || 3)} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
          />
          <div className="text-xs text-purple-300 mt-2">💡 Text zigzags across the specified number of rails</div>
        </div>
      )}

      {selectedCipher === 'vigenere' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30">
          <label className="text-sm font-bold text-purple-200 block mb-2">Keyword:</label>
          <input 
            type="text" 
            value={vigenereKeyword} 
            onChange={(e) => setVigenereKeyword(e.target.value.toUpperCase())} 
            className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
            placeholder="KEY"
          />
          <div className="text-xs text-purple-300 mt-2">💡 Each letter of the keyword determines the shift for the corresponding plaintext letter</div>
        </div>
      )}

      {selectedCipher === 'rsa' && (
        <div className="mb-4 p-4 bg-purple-900/30 rounded-lg border-2 border-purple-500/30 space-y-3">
          <div className="text-xs text-purple-200 mb-2">💡 Simplified RSA for educational purposes. Uses small primes (p=3, q=11, n=33).</div>
          <div>
            <label className="text-xs text-purple-200 block mb-1">Public Key (n, e):</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={rsaPublicKey.n} 
                onChange={(e) => setRsaPublicKey({...rsaPublicKey, n: parseInt(e.target.value) || 33})} 
                placeholder="n"
                className="flex-1 p-2 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400 text-sm" 
              />
              <input 
                type="number" 
                value={rsaPublicKey.e} 
                onChange={(e) => setRsaPublicKey({...rsaPublicKey, e: parseInt(e.target.value) || 3})} 
                placeholder="e"
                className="flex-1 p-2 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400 text-sm" 
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-purple-200 block mb-1">Private Key (n, d):</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                value={rsaPrivateKey.n} 
                onChange={(e) => setRsaPrivateKey({...rsaPrivateKey, n: parseInt(e.target.value) || 33})} 
                placeholder="n"
                className="flex-1 p-2 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400 text-sm" 
              />
              <input 
                type="number" 
                value={rsaPrivateKey.d} 
                onChange={(e) => setRsaPrivateKey({...rsaPrivateKey, d: parseInt(e.target.value) || 7})} 
                placeholder="d"
                className="flex-1 p-2 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400 text-sm" 
              />
            </div>
          </div>
        </div>
      )}

      {selectedCipher === 'cryptarithm' && (
        <div className="mb-4 space-y-4 p-4 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-lg border-2 border-purple-500/30">
          <div>
            <label className="text-sm font-bold text-purple-200 block mb-2">🧩 Equation (e.g., SEND + MORE = MONEY):</label>
            <input 
              type="text" 
              value={cryptarithmEquation} 
              onChange={(e) => setCryptarithmEquation(e.target.value.toUpperCase())} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400" 
              placeholder="SEND + MORE = MONEY"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-purple-200 block mb-2">Letter-to-Digit Mapping (e.g., S=9,E=5,N=6,D=7,M=1,O=0,R=8,Y=2):</label>
            <input 
              type="text" 
              value={cryptarithmMapping} 
              onChange={(e) => setCryptarithmMapping(e.target.value.toUpperCase())} 
              className="w-full p-3 rounded-lg bg-white/20 border-2 border-white/30 text-white focus:outline-none focus:border-purple-400 font-mono text-sm" 
              placeholder="S=9,E=5,N=6,D=7,M=1,O=0,R=8,Y=2"
            />
            <div className="text-xs text-purple-300 mt-2">💡 Format: LETTER=DIGIT, separated by commas. Each letter must map to a unique digit (0-9).</div>
          </div>
          
          <button
            onClick={() => {
              const mappingObj = {};
              cryptarithmMapping.split(',').forEach(pair => {
                const [letter, digit] = pair.split('=').map(s => s.trim());
                if (letter && digit) mappingObj[letter.toUpperCase()] = digit;
              });
              const equationToValidate = inputText.trim() || cryptarithmEquation;
              const validation = cipherAlgorithms['cryptarithm'].validateEquation(equationToValidate, mappingObj);
              setCryptarithmValidation(validation);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-2 rounded-lg font-semibold transition-all shadow-lg mb-3"
            title="✅ Validate your cryptarithm equation! Otto will check if your letter-to-digit mapping makes the math work correctly!"
          >
            ✓ Validate Equation
          </button>
          
          {cryptarithmValidation && (
            <div className={`p-3 rounded-lg border-2 ${cryptarithmValidation.valid ? 'bg-green-900/30 border-green-500/50' : 'bg-red-900/30 border-red-500/50'}`}>
              {cryptarithmValidation.valid ? (
                <div>
                  <div className="text-green-300 font-bold mb-2">✅ Valid Equation!</div>
                  <div className="text-sm text-green-200">
                    {(() => {
                      const equationToShow = inputText.trim() || cryptarithmEquation;
                      const parsed = cipherAlgorithms['cryptarithm'].parseEquation(equationToShow);
                      const mappingObj = {};
                      cryptarithmMapping.split(',').forEach(pair => {
                        const [letter, digit] = pair.split('=').map(s => s.trim());
                        if (letter && digit) mappingObj[letter.toUpperCase()] = digit;
                      });
                      const words = parsed.parts.map(p => p.value);
                      const numbers = words.map(w => cipherAlgorithms['cryptarithm'].wordToNumber(w, mappingObj));
                      if (numbers.every(n => n !== null)) {
                        return `${words[0]} (${numbers[0]}) ${parsed.operator || '+'} ${words[1]} (${numbers[1]}) = ${words[2]} (${numbers[2]})`;
                      }
                      return 'Equation is valid!';
                    })()}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-red-300 font-bold mb-1">❌ Invalid Equation</div>
                  <div className="text-sm text-red-200">{cryptarithmValidation.error}</div>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-black/20 p-3 rounded-lg">
            <div className="text-xs text-purple-200 mb-2">📋 Current Mapping:</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {(() => {
                const mappingObj = {};
                cryptarithmMapping.split(',').forEach(pair => {
                  const [letter, digit] = pair.split('=').map(s => s.trim());
                  if (letter && digit) mappingObj[letter.toUpperCase()] = digit;
                });
                return Object.entries(mappingObj).map(([letter, digit]) => (
                  <div key={letter} className="bg-purple-600/30 p-2 rounded text-center">
                    <span className="font-bold">{letter}</span> = {digit}
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CipherInputs;

