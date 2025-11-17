/**
 * ============================================================================
 * RailFenceVisualization Component
 * ============================================================================
 * 
 * Visual representation of the Rail Fence Cipher's zigzag pattern.
 * Shows how text is written across multiple rails in a zigzag pattern,
 * then read horizontally to create the encrypted message.
 * 
 * @component
 * @param {string} message - The message to visualize (default: "HELLO WORLD")
 * @param {number} rails - Number of rails (2-10, default: 3)
 * @returns {JSX.Element} Visual Rail Fence zigzag pattern
 */

import React from 'react';

const RailFenceVisualization = ({ message = "HELLO WORLD", rails = 3 }) => {
  // Remove spaces and convert to uppercase for visualization
  const cleanMessage = message.replace(/\s/g, '').toUpperCase();
  
  // Create the rail pattern
  const createRailPattern = (text, numRails) => {
    const railArrays = Array(numRails).fill(null).map(() => []);
    let currentRail = 0;
    let direction = 1; // 1 = down, -1 = up
    
    for (let i = 0; i < text.length; i++) {
      railArrays[currentRail].push(text[i]);
      
      // Move to next rail
      currentRail += direction;
      
      // Bounce at edges
      if (currentRail === numRails - 1) {
        direction = -1;
      } else if (currentRail === 0) {
        direction = 1;
      }
    }
    
    return railArrays;
  };

  const railArrays = createRailPattern(cleanMessage, rails);
  const maxLength = Math.max(...railArrays.map(r => r.length));

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-purple-900/30 border-2 border-purple-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-purple-200 mb-3 text-center font-semibold">
          Rail Fence Pattern ({rails} rails) - Message: "{message}"
        </div>
        <div className="flex flex-col gap-1">
          {railArrays.map((rail, railIndex) => (
            <div key={railIndex} className="flex items-center gap-1">
              <div className="w-16 text-xs text-purple-300 font-bold text-right pr-2">
                Rail {railIndex + 1}:
              </div>
              <div className="flex gap-1">
                {Array(maxLength).fill(null).map((_, colIndex) => {
                  const letter = rail[colIndex];
                  const isLetter = letter !== undefined;
                  return (
                    <div
                      key={colIndex}
                      className={`w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-bold ${
                        isLetter
                          ? 'bg-purple-500/60 border-purple-400 text-white'
                          : 'bg-purple-800/20 border-purple-600/30 text-purple-400/30'
                      }`}
                    >
                      {isLetter ? letter : '·'}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="text-xs text-purple-300 mt-3 text-center">
          Read horizontally: {railArrays.map(r => r.join('')).join(' ')}
        </div>
        <div className="text-xs text-purple-200 mt-2 text-center italic">
          💡 The zigzag pattern bounces between rails like a train on tracks!
        </div>
      </div>
    </div>
  );
};

export default RailFenceVisualization;

