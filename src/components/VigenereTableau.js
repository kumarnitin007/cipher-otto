/**
 * ============================================================================
 * VigenereTableau Component
 * ============================================================================
 * 
 * Visual representation of the Vigenère Square (Tabula Recta) showing
 * the 26x26 grid where each row is a Caesar-shifted alphabet. This helps
 * users understand how the Vigenère cipher uses different alphabets.
 * 
 * @component
 * @param {boolean} showFull - Whether to show full 26x26 grid or compact view (default: false)
 * @returns {JSX.Element} Visual Vigenère Square/Tableau
 */

import React, { useState } from 'react';

const VigenereTableau = ({ showFull = false }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [hoveredCell, setHoveredCell] = useState(null);

  const createTableau = () => {
    const tableau = [];
    for (let i = 0; i < 26; i++) {
      const row = [];
      for (let j = 0; j < 26; j++) {
        row.push(alphabet[(i + j) % 26]);
      }
      tableau.push(row);
    }
    return tableau;
  };

  const tableau = createTableau();
  const displayRows = showFull ? 26 : 8; // Show first 8 rows in compact mode

  return (
    <div className="my-4 flex flex-col items-center w-full">
      <div className="bg-indigo-900/30 border-2 border-indigo-400/50 rounded-lg p-4 w-full overflow-x-auto">
        <div className="text-sm md:text-base text-indigo-200 mb-3 text-center font-semibold">
          Vigenère Square (Tabula Recta)
        </div>
        {!showFull && (
          <div className="text-xs md:text-sm text-indigo-300 mb-2 text-center">
            Showing first 8 rows (each row is a Caesar-shifted alphabet)
          </div>
        )}
        <div className="overflow-x-auto w-full">
          <div className="flex justify-center">
            <table className="border-collapse text-xs md:text-sm">
              <thead>
                <tr>
                  <th className="w-10 h-8 md:w-12 md:h-10 text-xs md:text-sm text-indigo-300 font-bold border border-indigo-500/50"></th>
                  {alphabet.split('').map((letter, idx) => (
                    <th
                      key={idx}
                      className="w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm text-indigo-300 font-bold border border-indigo-500/50 text-center"
                    >
                      {letter}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableau.slice(0, displayRows).map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    <td className="w-10 h-8 md:w-12 md:h-10 text-xs md:text-sm text-indigo-300 font-bold border border-indigo-500/50 text-center">
                      {alphabet[rowIdx]}
                    </td>
                    {row.map((letter, colIdx) => {
                      const isHovered = hoveredCell?.row === rowIdx && hoveredCell?.col === colIdx;
                      return (
                        <td
                          key={colIdx}
                          onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-8 h-8 md:w-10 md:h-10 border border-indigo-400/40 text-center text-white font-bold text-xs md:text-sm ${
                            isHovered
                              ? 'bg-indigo-500 border-indigo-300 scale-110 z-10 relative'
                              : 'bg-indigo-700/40'
                          }`}
                        >
                          {letter}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="text-xs text-indigo-300 mt-3 text-center">
          {hoveredCell && (
            <div>
              Row {alphabet[hoveredCell.row]} + Column {alphabet[hoveredCell.col]} = {tableau[hoveredCell.row][hoveredCell.col]}
            </div>
          )}
          {!hoveredCell && (
            <div>💡 Hover over cells to see how letters combine! Row letter + Column letter = Result</div>
          )}
        </div>
        <div className="text-xs text-indigo-200 mt-2 text-center italic">
          💡 Each row is the alphabet shifted by that row's position. Use keyword letters to pick which row!
        </div>
      </div>
    </div>
  );
};

export default VigenereTableau;

