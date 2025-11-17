/**
 * ============================================================================
 * PortaTable Component
 * ============================================================================
 * 
 * Visual representation of the Porta Cipher's 13 alphabets table.
 * The Porta cipher uses 13 letter pairs (AB, CD, EF, etc.), each with
 * its own shifted alphabet. This component displays all 13 alphabets
 * in a clear table format.
 * 
 * @component
 * @returns {JSX.Element} Visual Porta cipher table showing all 13 alphabets
 */

import React, { useState } from 'react';

const PortaTable = () => {
  const [hoveredPair, setHoveredPair] = useState(null);
  
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

  const plainAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const pairs = Object.keys(tableau);

  return (
    <div className="my-4 flex flex-col items-center w-full">
      <div className="bg-teal-900/30 border-2 border-teal-400/50 rounded-lg p-4 w-full overflow-x-auto">
        <div className="text-sm md:text-base text-teal-200 mb-3 text-center font-semibold">
          Porta Cipher Table - 13 Alphabets
        </div>
        <div className="text-xs md:text-sm text-teal-300 mb-2 text-center">
          Each letter pair has its own alphabet. Find your keyword letter's pair, then use that alphabet!
        </div>
        <div className="overflow-x-auto w-full">
          <table className="border-collapse text-xs md:text-sm">
            <thead>
              <tr>
                <th className="w-20 h-10 md:w-24 md:h-12 text-xs md:text-sm text-teal-300 font-bold border border-teal-500/50 bg-teal-800/40 sticky left-0 z-10">
                  Pair
                </th>
                {plainAlpha.split('').map((letter, idx) => (
                  <th
                    key={idx}
                    className="w-8 h-10 md:w-10 md:h-12 text-xs md:text-sm text-teal-300 font-bold border border-teal-500/50 bg-teal-800/40 text-center"
                  >
                    {letter}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair, pairIdx) => {
                const alphabet = tableau[pair];
                const isHovered = hoveredPair === pair;
                return (
                  <tr key={pairIdx}>
                    <td
                      className={`w-20 h-10 md:w-24 md:h-12 text-xs md:text-sm font-bold border border-teal-500/50 text-center sticky left-0 z-10 ${
                        isHovered
                          ? 'bg-teal-500/60 text-white border-teal-300'
                          : 'bg-teal-800/40 text-teal-200'
                      }`}
                      onMouseEnter={() => setHoveredPair(pair)}
                      onMouseLeave={() => setHoveredPair(null)}
                    >
                      {pair}
                    </td>
                    {alphabet.split('').map((letter, letterIdx) => {
                      const plainLetter = plainAlpha[letterIdx];
                      const isHighlighted = isHovered;
                      return (
                        <td
                          key={letterIdx}
                          className={`w-8 h-10 md:w-10 md:h-12 border border-teal-400/40 text-center text-white font-bold text-xs md:text-sm ${
                            isHighlighted
                              ? 'bg-teal-500/60 border-teal-300'
                              : 'bg-teal-700/40'
                          }`}
                          title={`${plainLetter} → ${letter} (using pair ${pair})`}
                        >
                          {letter}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-teal-300 mt-3 text-center">
          {hoveredPair && (
            <div>
              <strong>Pair {hoveredPair}:</strong> When your keyword letter is in pair {hoveredPair}, use this alphabet row!
              <br />
              Example: Plaintext "A" → Ciphertext "{tableau[hoveredPair][0]}" (first letter of this row)
            </div>
          )}
          {!hoveredPair && (
            <div>
              💡 Hover over a letter pair to see its alphabet! Each pair encrypts differently.
            </div>
          )}
        </div>
        <div className="text-xs text-teal-200 mt-2 text-center italic">
          💡 The magic: Each letter pair (AB, CD, EF...) has its own shifted alphabet. Your keyword letter tells you which pair to use!
        </div>
      </div>
    </div>
  );
};

export default PortaTable;

