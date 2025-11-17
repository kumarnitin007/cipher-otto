/**
 * ============================================================================
 * OttosNotesRenderer Component
 * ============================================================================
 * 
 * Renders Otto's learning notes with support for embedded React components
 * like images, diagrams, and interactive elements. This allows the notes
 * to include visual aids that help explain cipher concepts better.
 * 
 * The component parses special markers in the notes text and replaces them
 * with appropriate React components. For example:
 * - [[POLYBIUS:keyword]] renders a Polybius Square
 * - [[IMAGE:path]] renders an image (future support)
 * 
 * @component
 * @param {string} cipherKey - The cipher key to render notes for
 * @returns {JSX.Element} Rendered notes with embedded components
 */

import React from 'react';
import { getOttosNotes } from '../utils/ottosNotes';
import PolybiusSquare from './PolybiusSquare';
import RailFenceVisualization from './RailFenceVisualization';
import ColumnarTranspositionVisual from './ColumnarTranspositionVisual';
import CaesarShiftVisual from './CaesarShiftVisual';
import AtbashMirror from './AtbashMirror';
import VigenereTableau from './VigenereTableau';
import MorseCodeChart from './MorseCodeChart';
import BaconianTable from './BaconianTable';
import HillMatrixVisual from './HillMatrixVisual';
import PortaTable from './PortaTable';

const OttosNotesRenderer = ({ cipherKey }) => {
  const notes = getOttosNotes(cipherKey);
  
  // Split notes by component markers and render accordingly
  const renderNotes = () => {
    // Pattern to match all component markers: [[COMPONENT:params]]
    const componentPattern = /(\[\[[A-Z_]+(?::[^\]]+)?\]\])/g;
    const parts = notes.split(componentPattern);
    
    return parts.map((part, index) => {
      // Polybius Square: [[POLYBIUS:keyword]]
      const polybiusMatch = part.match(/\[\[POLYBIUS:([^\]]+)\]\]/);
      if (polybiusMatch) {
        const keyword = polybiusMatch[1] || 'CRYPTO';
        return <PolybiusSquare key={`polybius-${index}`} keyword={keyword} />;
      }
      
      // Rail Fence: [[RAILFENCE:message:rails]]
      const railfenceMatch = part.match(/\[\[RAILFENCE:([^:]+):(\d+)\]\]/);
      if (railfenceMatch) {
        const message = railfenceMatch[1] || 'HELLO WORLD';
        const rails = parseInt(railfenceMatch[2]) || 3;
        return <RailFenceVisualization key={`railfence-${index}`} message={message} rails={rails} />;
      }
      
      // Columnar: [[COLUMNAR:message:keyword]]
      const columnarMatch = part.match(/\[\[COLUMNAR:([^:]+):([^\]]+)\]\]/);
      if (columnarMatch) {
        const message = columnarMatch[1] || 'HELLO WORLD';
        const keyword = columnarMatch[2] || 'KEY';
        return <ColumnarTranspositionVisual key={`columnar-${index}`} message={message} keyword={keyword} />;
      }
      
      // Caesar Shift: [[CAESAR:shift]]
      const caesarMatch = part.match(/\[\[CAESAR:(\d+)\]\]/);
      if (caesarMatch) {
        const shift = parseInt(caesarMatch[1]) || 3;
        return <CaesarShiftVisual key={`caesar-${index}`} shift={shift} />;
      }
      
      // Atbash Mirror: [[ATBASH]]
      if (part.match(/\[\[ATBASH\]\]/)) {
        return <AtbashMirror key={`atbash-${index}`} />;
      }
      
      // Vigenere Tableau: [[VIGENERE]] or [[VIGENERE:full]]
      const vigenereMatch = part.match(/\[\[VIGENERE(?::([^\]]+))?\]\]/);
      if (vigenereMatch) {
        const showFull = vigenereMatch[1] === 'full';
        return <VigenereTableau key={`vigenere-${index}`} showFull={showFull} />;
      }
      
      // Morse Code Chart: [[MORSE]]
      if (part.match(/\[\[MORSE\]\]/)) {
        return <MorseCodeChart key={`morse-${index}`} />;
      }
      
      // Baconian Table: [[BACONIAN]]
      if (part.match(/\[\[BACONIAN\]\]/)) {
        return <BaconianTable key={`baconian-${index}`} />;
      }
      
      // Hill Matrix: [[HILL:size]] or [[HILL2X2]] or [[HILL3X3]]
      const hillMatch = part.match(/\[\[HILL(?:(2X2|3X3)|:(\d+))?\]\]/);
      if (hillMatch) {
        let size = 2;
        if (hillMatch[1] === '3X3' || hillMatch[2] === '3') size = 3;
        return <HillMatrixVisual key={`hill-${index}`} size={size} />;
      }
      
      // Porta Table: [[PORTA]]
      if (part.match(/\[\[PORTA\]\]/)) {
        return <PortaTable key={`porta-${index}`} />;
      }
      
      // Regular text - preserve line breaks
      return (
        <span key={`text-${index}`} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div className="w-full text-white whitespace-pre-wrap leading-relaxed">
      {renderNotes()}
    </div>
  );
};

export default OttosNotesRenderer;

