/**
 * ============================================================================
 * BaconianTable Component
 * ============================================================================
 * 
 * Visual table showing the Baconian Cipher encoding where each letter
 * is represented by a 5-letter combination of A's and B's (like binary).
 * 
 * @component
 * @returns {JSX.Element} Visual Baconian encoding table
 */

import React from 'react';

const BaconianTable = () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const getBaconianCode = (index) => {
    // Convert index to 5-bit binary, then to A/B
    let binary = index.toString(2).padStart(5, '0');
    return binary.replace(/0/g, 'A').replace(/1/g, 'B');
  };

  const baconianCodes = alphabet.split('').map((letter, idx) => ({
    letter,
    code: getBaconianCode(idx)
  }));

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-amber-900/30 border-2 border-amber-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-amber-200 mb-3 text-center font-semibold">
          Baconian Cipher Encoding Table
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2">
          {baconianCodes.map(({ letter, code }) => (
            <div
              key={letter}
              className="bg-amber-800/40 border-2 border-amber-500/50 rounded p-2 text-center"
            >
              <div className="text-white font-bold text-sm mb-1">{letter}</div>
              <div className="text-amber-200 font-mono text-xs">{code}</div>
            </div>
          ))}
        </div>
        <div className="text-xs text-amber-300 mt-3 text-center">
          Example: "HELLO" = {baconianCodes[7].code} {baconianCodes[4].code} {baconianCodes[11].code} {baconianCodes[11].code} {baconianCodes[14].code}
        </div>
        <div className="text-xs text-amber-200 mt-2 text-center italic">
          💡 Each letter becomes 5 A's or B's - it's like binary code from 1605!
        </div>
      </div>
    </div>
  );
};

export default BaconianTable;

