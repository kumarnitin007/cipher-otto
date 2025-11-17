/**
 * ============================================================================
 * PolybiusSquare Component
 * ============================================================================
 * 
 * Visual representation of a Polybius Square (5×5 grid) used in ciphers like
 * Nihilist, Checkerboard, and others. Displays letters in a grid format with
 * row and column labels to help users understand how letters map to coordinates.
 * 
 * @component
 * @param {string} keyword - Optional keyword to generate the square (default: standard alphabet)
 * @param {boolean} showLabels - Whether to show row/column labels (default: true)
 * @returns {JSX.Element} Visual Polybius Square grid
 */

import React from 'react';

const PolybiusSquare = ({ keyword = 'CRYPTO', showLabels = true }) => {
  // Generate Polybius square from keyword
  const generateSquare = (key) => {
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is typically combined with I
    const keyUpper = key.toUpperCase().replace(/J/g, 'I');
    const seen = new Set();
    const square = [];
    
    // Add keyword letters first
    for (const char of keyUpper) {
      if (!seen.has(char) && alphabet.includes(char)) {
        square.push(char);
        seen.add(char);
      }
    }
    
    // Fill remaining with alphabet
    for (const char of alphabet) {
      if (!seen.has(char)) {
        square.push(char);
      }
    }
    
    // Convert to 5x5 grid
    const grid = [];
    for (let i = 0; i < 5; i++) {
      grid.push(square.slice(i * 5, (i + 1) * 5));
    }
    
    return grid;
  };

  const grid = generateSquare(keyword);

  return (
    <div className="my-4 flex flex-col items-center w-full">
      <div className="bg-cyan-900/30 border-2 border-cyan-400/50 rounded-lg p-4 w-full">
        <div className="text-sm md:text-base text-cyan-200 mb-3 text-center font-semibold">
          Polybius Square (Keyword: {keyword})
        </div>
        <div className="flex justify-center">
          <table className="border-collapse">
            {showLabels && (
              <thead>
                <tr>
                  <th className="w-10 h-10 md:w-12 md:h-12 text-sm md:text-base text-cyan-300 font-bold"></th>
                  {[1, 2, 3, 4, 5].map(col => (
                    <th key={col} className="w-12 h-12 md:w-16 md:h-16 text-sm md:text-base text-cyan-300 font-bold border border-cyan-500/50">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {grid.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {showLabels && (
                    <td className="w-10 h-10 md:w-12 md:h-12 text-sm md:text-base text-cyan-300 font-bold border border-cyan-500/50 text-center">
                      {rowIdx + 1}
                    </td>
                  )}
                  {row.map((letter, colIdx) => (
                    <td
                      key={`${rowIdx}-${colIdx}`}
                      className="w-12 h-12 md:w-16 md:h-16 border-2 border-cyan-400/60 bg-cyan-800/40 text-center text-white font-bold text-base md:text-lg"
                    >
                      {letter}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-xs text-cyan-300 mt-2 text-center">
          {(() => {
            const hRow = grid.findIndex(r => r.includes('H'));
            const hCol = hRow >= 0 ? grid[hRow].indexOf('H') : -1;
            if (hRow >= 0 && hCol >= 0) {
              return `Example: Letter "H" at row ${hRow + 1}, column ${hCol + 1} = ${hRow + 1}${hCol + 1}`;
            }
            return 'Example: Find a letter\'s coordinates by its row and column numbers!';
          })()}
        </div>
      </div>
    </div>
  );
};

export default PolybiusSquare;

