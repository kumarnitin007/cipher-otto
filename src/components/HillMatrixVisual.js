/**
 * ============================================================================
 * HillMatrixVisual Component
 * ============================================================================
 * 
 * Visual representation of Hill Cipher matrix multiplication.
 * Shows how letter pairs/triplets are converted to numbers, multiplied
 * by a matrix, and converted back to letters.
 * 
 * @component
 * @param {number} size - Matrix size (2 for 2x2, 3 for 3x3, default: 2)
 * @param {Array<Array<number>>} matrix - The encryption matrix (optional, shows example if not provided)
 * @returns {JSX.Element} Visual Hill Cipher matrix multiplication
 */

import React from 'react';

const HillMatrixVisual = ({ size = 2, matrix = null }) => {
  // Default example matrices
  const defaultMatrix2x2 = [[3, 3], [2, 5]];
  const defaultMatrix3x3 = [[1, 2, 3], [0, 1, 2], [0, 0, 1]];
  
  const displayMatrix = matrix || (size === 2 ? defaultMatrix2x2 : defaultMatrix3x3);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const exampleLetters = size === 2 ? ['H', 'E'] : ['H', 'E', 'L'];
  const exampleNumbers = exampleLetters.map(l => alphabet.indexOf(l));

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-pink-900/30 border-2 border-pink-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-pink-200 mb-3 text-center font-semibold">
          Hill {size}x{size} Matrix Multiplication
        </div>
        
        {/* Example calculation */}
        <div className="space-y-3">
          <div className="text-xs text-pink-300 font-semibold">Example: Encrypt "{exampleLetters.join('')}"</div>
          
          {/* Step 1: Letters to numbers */}
          <div>
            <div className="text-xs text-pink-300 mb-1">Step 1: Convert letters to numbers</div>
            <div className="flex items-center gap-2 justify-center">
              {exampleLetters.map((letter, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-10 h-10 border-2 border-pink-500/50 bg-pink-800/40 text-white font-bold flex items-center justify-center rounded mb-1">
                    {letter}
                  </div>
                  <div className="text-xs text-pink-300">= {exampleNumbers[idx]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Matrix */}
          <div>
            <div className="text-xs text-pink-300 mb-1">Step 2: Multiply by matrix</div>
            <div className="flex items-center gap-2 justify-center flex-wrap">
              <div className="border-2 border-pink-500/50 rounded p-2">
                <div className="text-xs text-pink-300 mb-1 text-center">Matrix</div>
                <div className="flex flex-col gap-1">
                  {displayMatrix.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex gap-1 justify-center">
                      {row.map((val, colIdx) => (
                        <div
                          key={colIdx}
                          className="w-8 h-8 border border-pink-400/50 bg-pink-700/40 text-white font-bold text-xs flex items-center justify-center rounded"
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-pink-300 text-lg">×</div>
              <div className="border-2 border-pink-500/50 rounded p-2">
                <div className="text-xs text-pink-300 mb-1 text-center">Letters</div>
                <div className="flex flex-col gap-1">
                  {exampleNumbers.map((num, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 border border-pink-400/50 bg-pink-700/40 text-white font-bold text-xs flex items-center justify-center rounded"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Result */}
          <div>
            <div className="text-xs text-pink-300 mb-1">Step 3: Result (mod 26) → Letters</div>
            <div className="text-xs text-pink-200 text-center italic">
              💡 Multiply matrix × letter numbers, take mod 26, convert back to letters!
            </div>
          </div>
        </div>

        <div className="text-xs text-pink-200 mt-3 text-center italic">
          💡 Matrix math makes this cipher super secure! Each letter pair/triplet gets transformed together.
        </div>
      </div>
    </div>
  );
};

export default HillMatrixVisual;

