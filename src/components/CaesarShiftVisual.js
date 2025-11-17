/**
 * ============================================================================
 * CaesarShiftVisual Component
 * ============================================================================
 * 
 * Visual representation of the Caesar Cipher shift showing how letters
 * are shifted forward in the alphabet. Displays both original and shifted
 * alphabets side by side.
 * 
 * @component
 * @param {number} shift - The shift amount (0-25, default: 3)
 * @returns {JSX.Element} Visual Caesar shift alphabet comparison
 */

import React from 'react';

const CaesarShiftVisual = ({ shift = 3 }) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const createShiftedAlphabet = (shiftAmount) => {
    return alphabet.split('').map((letter, idx) => {
      const newIdx = (idx + shiftAmount) % 26;
      return alphabet[newIdx];
    }).join('');
  };

  const shiftedAlphabet = createShiftedAlphabet(shift);

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-green-900/30 border-2 border-green-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-green-200 mb-3 text-center font-semibold">
          Caesar Shift (Shift: {shift})
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs text-green-300 font-bold">Original:</div>
            <div className="flex gap-1 flex-wrap">
              {alphabet.split('').map((letter, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 border-2 border-green-500/50 bg-green-800/40 text-white font-bold text-xs flex items-center justify-center rounded"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs text-green-300 font-bold">Shifted:</div>
            <div className="flex gap-1 flex-wrap">
              {shiftedAlphabet.split('').map((letter, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 border-2 border-green-400 bg-green-500/60 text-white font-bold text-xs flex items-center justify-center rounded"
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-xs text-green-300 mt-3 text-center">
          Example: A → {shiftedAlphabet[0]} (shifted by {shift} positions)
        </div>
        <div className="text-xs text-green-200 mt-2 text-center italic">
          💡 Each letter moves forward by {shift} positions. After Z, it wraps back to A!
        </div>
      </div>
    </div>
  );
};

export default CaesarShiftVisual;

