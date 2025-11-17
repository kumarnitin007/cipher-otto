import React, { useState } from 'react';
import { Coffee, DollarSign, Sparkles, Calendar, X, ChevronDown, ChevronUp } from 'lucide-react';
import AnimatedOtter from './AnimatedOtter';

const AboutOttoModal = ({ show, onClose }) => {
  const [isAppsExpanded, setIsAppsExpanded] = useState(false);
  
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border-2 border-white/20 my-8 max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center mb-6">
          <div className="mb-4"><AnimatedOtter /></div>
          <h2 className="text-3xl font-bold mb-2">About Otto 💙</h2>
        </div>

        {/* About Otto Section */}
        <div className="mb-6 bg-white/10 rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-3 text-yellow-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Meet Otto the Otter
          </h3>
          <p className="text-purple-100 leading-relaxed">
            🦦 Otto is your friendly guide to the fascinating world of cryptography! 
            Otto loves helping people learn about ciphers, codes, and secret messages in a fun and engaging way. 
            Whether you're a beginner just starting your cryptography journey or an advanced learner tackling complex ciphers, 
            Otto is here to make learning enjoyable and accessible. With Otto by your side, you'll discover the secrets 
            behind historical ciphers, practice your skills, and become a cryptography master!
          </p>
        </div>

        {/* Other Apps in the Family Section */}
        <div className="mb-6 bg-white/10 rounded-xl p-6 border border-white/20">
          <button
            onClick={() => setIsAppsExpanded(!isAppsExpanded)}
            className="w-full flex items-center justify-between text-left"
            title={isAppsExpanded ? "Click to collapse other apps" : "Click to see other apps in the family"}
          >
            <h3 className="text-xl font-bold text-cyan-300">Other Apps in the Family</h3>
            {isAppsExpanded ? (
              <ChevronUp className="w-5 h-5 text-cyan-300" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cyan-300" />
            )}
          </button>
          {isAppsExpanded && (
            <div className="mt-4 space-y-4">
              {/* Cipher Otto */}
              <div className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 rounded-lg p-4 border border-purple-500/30">
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-white">🦦 Cipher Otto</h4>
                </div>
                <p className="text-purple-100 text-sm leading-relaxed">
                  Your interactive cryptography learning platform! Learn, practice, and master various ciphers 
                  with Otto's guidance. Explore historical ciphers, solve challenges, track your progress, and 
                  join a community of cryptography enthusiasts.
                </p>
              </div>

              {/* Leo Planner */}
              <div className="bg-gradient-to-r from-blue-800/50 to-cyan-800/50 rounded-lg p-4 border border-blue-500/30">
                <div className="mb-2">
                  <h4 className="text-lg font-bold text-white">🦁 Leo Planner</h4>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Your personal task manager, event tracker, and gift card organizer. Keep track of your schedule, 
                  share calendars with family, and manage your daily tasks with ease.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mb-6 bg-white/10 rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-3 text-green-300">Support Otto</h3>
          <p className="text-purple-200 mb-4">Help keep this app free and ad-free!</p>
          <div className="space-y-3">
            <a href="https://venmo.com/Nitin-Kumar-22" target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 py-4 rounded-xl font-bold text-center transition-all">
              <Coffee className="w-6 h-6 inline mr-2" />
              Donate via Venmo
            </a>
            <a href="https://paypal.me/kumarnitin007" target="_blank" rel="noopener noreferrer" className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-4 rounded-xl font-bold text-center transition-all">
              <DollarSign className="w-6 h-6 inline mr-2" />
              Donate via PayPal
            </a>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-semibold transition-all">Close</button>
      </div>
    </div>
  );
};

export default AboutOttoModal;

