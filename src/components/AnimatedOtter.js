import React, { useState, useEffect } from 'react';

/**
 * Animated Otter mascot component that waves every 3 seconds
 * Uses SVG to render a friendly otter character with animation
 */
const AnimatedOtter = () => {
  // State to control waving animation
  const [isWaving, setIsWaving] = useState(false);
  
  // Set up interval to trigger waving animation every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaving(true);
      // Reset waving after 600ms
      setTimeout(() => setIsWaving(false), 600);
    }, 3000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-blue-400/30 rounded-full animate-pulse" />
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <ellipse cx="50" cy="65" rx="22" ry="18" fill="#8B4513" />
        <ellipse cx="50" cy="68" rx="14" ry="12" fill="#D2691E" />
        <circle cx="50" cy="40" r="18" fill="#8B4513" />
        <circle cx="38" cy="32" r="5" fill="#654321" />
        <circle cx="62" cy="32" r="5" fill="#654321" />
        <ellipse cx="50" cy="45" rx="12" ry="10" fill="#D2691E" />
        <g className="animate-pulse">
          <circle cx="44" cy="38" r="3" fill="#000" />
          <circle cx="56" cy="38" r="3" fill="#000" />
          <circle cx="45" cy="37" r="1.5" fill="#fff" />
          <circle cx="57" cy="37" r="1.5" fill="#fff" />
        </g>
        <ellipse cx="50" cy="44" rx="3" ry="2" fill="#000" />
        <line x1="35" y1="42" x2="28" y2="41" stroke="#000" strokeWidth="0.5" />
        <line x1="35" y1="44" x2="28" y2="45" stroke="#000" strokeWidth="0.5" />
        <line x1="65" y1="42" x2="72" y2="41" stroke="#000" strokeWidth="0.5" />
        <line x1="65" y1="44" x2="72" y2="45" stroke="#000" strokeWidth="0.5" />
        <g style={{ animation: isWaving ? 'wave 0.6s ease-in-out' : 'none', transformOrigin: '30px 55px' }}>
          <ellipse cx="30" cy="58" rx="6" ry="10" fill="#8B4513" transform="rotate(-20 30 58)" />
          <circle cx="28" cy="65" r="4" fill="#D2691E" />
        </g>
        <ellipse cx="70" cy="58" rx="6" ry="10" fill="#8B4513" transform="rotate(20 70 58)" />
        <circle cx="72" cy="65" r="4" fill="#D2691E" />
        <ellipse cx="50" cy="80" rx="8" ry="4" fill="#654321" />
        {isWaving && (
          <path d="M 65 25 C 65 22 67 20 69 20 C 71 20 73 22 73 25 C 73 28 69 32 69 32 C 69 32 65 28 65 25 Z" fill="#ff69b4" className="animate-ping" opacity="0.8" />
        )}
      </svg>
      <style>{`@keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } }`}</style>
    </div>
  );
};

export default AnimatedOtter;

