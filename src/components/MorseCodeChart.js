/**
 * ============================================================================
 * MorseCodeChart Component
 * ============================================================================
 * 
 * Visual chart showing Morse code for all letters and numbers.
 * Useful for ciphers like Pollux, Morbit, and Fractionated Morse.
 * 
 * @component
 * @returns {JSX.Element} Visual Morse code chart
 */

import React from 'react';

const MorseCodeChart = () => {
  const morseCode = {
    'A': '·-', 'B': '-···', 'C': '-·-·', 'D': '-··', 'E': '·',
    'F': '··-·', 'G': '--·', 'H': '····', 'I': '··', 'J': '·---',
    'K': '-·-', 'L': '·-··', 'M': '--', 'N': '-·', 'O': '---',
    'P': '·--·', 'Q': '--·-', 'R': '·-·', 'S': '···', 'T': '-',
    'U': '··-', 'V': '···-', 'W': '·--', 'X': '-··-', 'Y': '-·--',
    'Z': '--··',
    '0': '-----', '1': '·----', '2': '··---', '3': '···--', '4': '····-',
    '5': '·····', '6': '-····', '7': '--···', '8': '---··', '9': '----·'
  };

  const letters = Object.keys(morseCode).filter(k => k.match(/[A-Z]/));
  const numbers = Object.keys(morseCode).filter(k => k.match(/[0-9]/));

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-orange-900/30 border-2 border-orange-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-orange-200 mb-3 text-center font-semibold">
          Morse Code Chart
        </div>
        
        {/* Letters */}
        <div className="mb-4">
          <div className="text-xs text-orange-300 mb-2 font-semibold">Letters:</div>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-2">
            {letters.map(letter => (
              <div
                key={letter}
                className="bg-orange-800/40 border-2 border-orange-500/50 rounded p-2 text-center"
              >
                <div className="text-white font-bold text-sm mb-1">{letter}</div>
                <div className="text-orange-200 font-mono text-xs">{morseCode[letter]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Numbers */}
        <div>
          <div className="text-xs text-orange-300 mb-2 font-semibold">Numbers:</div>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {numbers.map(num => (
              <div
                key={num}
                className="bg-orange-800/40 border-2 border-orange-500/50 rounded p-2 text-center"
              >
                <div className="text-white font-bold text-sm mb-1">{num}</div>
                <div className="text-orange-200 font-mono text-xs">{morseCode[num]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-orange-200 mt-3 text-center italic">
          💡 · = dot (short), - = dash (long). Use this chart to convert text to Morse code!
        </div>
      </div>
    </div>
  );
};

export default MorseCodeChart;

