import React from 'react';
import { SPECIES_LIST } from '../data/species';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black select-none">
      {/* Deep cosmic purple and black radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(88,28,135,0.45),rgba(0,0,0,0.95))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,7,100,0.4),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(107,33,168,0.25),transparent_60%)]" />

      {/* Subtle cosmic grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `linear-gradient(to right, #9333ea 1px, transparent 1px), linear-gradient(to bottom, #9333ea 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Rare Species Backdrops */}
      {/* 1. Axolotl Top-Left */}
      <div className="absolute -top-12 -left-16 w-72 h-72 md:w-96 md:h-96 opacity-25 filter blur-[1px] animate-float-1">
        <img 
          src={SPECIES_LIST[0].image} 
          alt="Floating Axolotl" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen mask-radial"
        />
        <div className="absolute inset-0 rounded-full bg-purple-900/40 mix-blend-overlay" />
      </div>

      {/* 2. Pangolin Center-Right */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 md:w-[420px] md:h-[420px] opacity-20 filter blur-[1px] animate-float-2">
        <img 
          src={SPECIES_LIST[1].image} 
          alt="Floating Pangolin" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen"
        />
        <div className="absolute inset-0 rounded-full bg-amber-950/40 mix-blend-overlay" />
      </div>

      {/* 3. Golden Frog Bottom-Left */}
      <div className="absolute bottom-10 -left-16 w-64 h-64 md:w-80 md:h-80 opacity-20 filter blur-[1px] animate-float-2">
        <img 
          src={SPECIES_LIST[2].image} 
          alt="Floating Golden Frog" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen"
        />
      </div>

      {/* 4. Saiga Antelope Center-Left */}
      <div className="absolute top-1/2 -left-28 w-72 h-72 md:w-96 md:h-96 opacity-15 filter blur-[2px] animate-float-1">
        <img 
          src={SPECIES_LIST[3].image} 
          alt="Floating Saiga Antelope" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen"
        />
      </div>

      {/* 5. Okapi Bottom-Right */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 md:w-[440px] md:h-[440px] opacity-20 filter blur-[1px] animate-float-1">
        <img 
          src={SPECIES_LIST[4].image} 
          alt="Floating Okapi" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full mix-blend-screen"
        />
      </div>

      {/* Ambient glowing dust specks */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-purple-400/60 blur-[1px] animate-pulse-glow" />
      <div className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-fuchsia-400/50 blur-[2px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-violet-300/40 blur-[1px] animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
    </div>
  );
};
