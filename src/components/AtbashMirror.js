/**
 * ============================================================================
 * AtbashMirror Component
 * ============================================================================
 * 
 * Visual representation of the Atbash Cipher showing how the alphabet
 * is mirrored (A↔Z, B↔Y, etc.). Displays the mirror relationship clearly.
 * 
 * @component
 * @returns {JSX.Element} Visual Atbash alphabet mirror
 */

import React from 'react';

const AtbashMirror = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const atbashMap = {};
  
  alphabet.split('').forEach((letter, idx) => {
    atbashMap[letter] = alphabet[25 - idx];
  });

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-yellow-900/30 border-2 border-yellow-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-yellow-200 mb-3 text-center font-semibold">
          Atbash Mirror - The Alphabet Flipped!
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            {alphabet.split('').map((letter, idx) => {
              const mirrored = atbashMap[letter];
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 border-2 border-yellow-500/50 bg-yellow-800/40 text-white font-bold text-sm flex items-center justify-center rounded">
                    {letter}
                  </div>
                  <div className="text-yellow-400 text-xs">↕</div>
                  <div className="w-10 h-10 border-2 border-yellow-400 bg-yellow-500/60 text-white font-bold text-sm flex items-center justify-center rounded">
                    {mirrored}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-xs text-yellow-300 mt-3 text-center">
          Example: A ↔ Z, B ↔ Y, C ↔ X, ... M ↔ N
        </div>
        <div className="text-xs text-yellow-200 mt-2 text-center italic">
          💡 It's like looking at the alphabet in a mirror - everything flips!
        </div>
      </div>
    </div>
  );
};

export default AtbashMirror;

