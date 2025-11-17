/**
 * ============================================================================
 * ColumnarTranspositionVisual Component
 * ============================================================================
 * 
 * Visual representation of Columnar Transposition showing how a message
 * is written in rows and then read in columns based on keyword order.
 * 
 * @component
 * @param {string} message - The message to visualize (default: "HELLO WORLD")
 * @param {string} keyword - The keyword for column ordering (default: "KEY")
 * @returns {JSX.Element} Visual Columnar Transposition grid
 */

import React from 'react';

const ColumnarTranspositionVisual = ({ message = "HELLO WORLD", keyword = "KEY" }) => {
  const cleanMessage = message.replace(/\s/g, '').toUpperCase();
  const cleanKeyword = keyword.toUpperCase();
  
  // Create the grid
  const createGrid = (text, key) => {
    const keyLength = key.length;
    const numRows = Math.ceil(text.length / keyLength);
    const grid = [];
    
    for (let row = 0; row < numRows; row++) {
      const rowData = [];
      for (let col = 0; col < keyLength; col++) {
        const index = row * keyLength + col;
        rowData.push(index < text.length ? text[index] : '');
      }
      grid.push(rowData);
    }
    
    return grid;
  };

  // Get column order based on keyword
  const getColumnOrder = (key) => {
    const sorted = key.split('').map((char, idx) => ({ char, idx }))
      .sort((a, b) => a.char.localeCompare(b.char));
    return sorted.map(item => item.idx);
  };

  const grid = createGrid(cleanMessage, cleanKeyword);
  const columnOrder = getColumnOrder(cleanKeyword);
  const keywordChars = cleanKeyword.split('');

  return (
    <div className="my-4 flex flex-col items-center">
      <div className="bg-blue-900/30 border-2 border-blue-400/50 rounded-lg p-4 inline-block">
        <div className="text-xs text-blue-200 mb-3 text-center font-semibold">
          Columnar Transposition - Message: "{message}", Keyword: "{keyword}"
        </div>
        
        {/* Original grid */}
        <div className="mb-4">
          <div className="text-xs text-blue-300 mb-2 font-semibold">Step 1: Write in rows</div>
          <table className="border-collapse mx-auto">
            <thead>
              <tr>
                <th className="w-8 h-8 text-xs text-blue-300"></th>
                {keywordChars.map((char, idx) => (
                  <th key={idx} className="w-10 h-10 text-xs text-blue-300 font-bold border border-blue-500/50">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="w-8 h-8 text-xs text-blue-300 font-bold border border-blue-500/50 text-center">
                    {rowIdx + 1}
                  </td>
                  {row.map((letter, colIdx) => (
                    <td
                      key={colIdx}
                      className={`w-10 h-10 border-2 border-blue-400/60 text-center text-white font-bold text-sm ${
                        letter ? 'bg-blue-500/60' : 'bg-blue-800/20'
                      }`}
                    >
                      {letter || '·'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Column order */}
        <div className="text-xs text-blue-300 mb-2">
          Step 2: Read columns in keyword order: {columnOrder.map(i => keywordChars[i]).join(' → ')}
        </div>
        <div className="text-xs text-blue-200 mt-2 text-center italic">
          💡 The keyword determines which column to read first, second, third, etc.!
        </div>
      </div>
    </div>
  );
};

export default ColumnarTranspositionVisual;

