/**
 * Avatar Selector Component
 * 
 * Allows users to choose their avatar from a selection of emoji avatars
 */

import React, { useState } from 'react';
import { User, Check } from 'lucide-react';

const AvatarSelector = ({ currentAvatar, onSelect }) => {
  // Kid-friendly emoji avatars
  const avatars = [
    '🦦', '👦', '👧', '🧑', '👨', '👩', '👴', '👵',
    '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞',
    '🐱', '🐶', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁',
    '🐸', '🐷', '🐮', '🐹', '🐭', '🦊', '🐺', '🐨',
    '🎃', '👻', '🤖', '👽', '👾', '🤡', '💀', '☠️',
    '🦄', '🐉', '🐲', '🦋', '🐝', '🐞', '🦗', '🕷️',
    '🌞', '⭐', '🌟', '💫', '✨', '🔥', '💧', '⚡',
    '🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎤'
  ];

  const [selected, setSelected] = useState(currentAvatar || '🦦');

  const handleSelect = (avatar) => {
    setSelected(avatar);
    onSelect(avatar);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-purple-200 mb-2">
        Choose Your Avatar
      </label>
      <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
        {avatars.map((avatar, index) => (
          <button
            key={index}
            onClick={() => handleSelect(avatar)}
            className={`w-10 h-10 rounded-full text-2xl flex items-center justify-center transition-all transform hover:scale-110 relative ${
              selected === avatar
                ? 'bg-yellow-400 ring-2 ring-yellow-300 ring-offset-2 ring-offset-purple-900'
                : 'bg-white/10 hover:bg-white/20'
            }`}
            title={`Select ${avatar}`}
          >
            {avatar}
            {selected === avatar && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                <Check size={12} className="text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <div className="text-xs text-purple-300 text-center">
        Click an emoji to select it as your avatar
      </div>
    </div>
  );
};

export default AvatarSelector;

