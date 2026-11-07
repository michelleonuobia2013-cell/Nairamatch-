import React from 'react';
import { X, Palette, Check, Volume2, Sparkles } from 'lucide-react';
import { THEMES_LIST, GameTheme } from '../data/themes';
import { sound } from '../utils/audio';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedThemeId: string;
  onSelectTheme: (themeId: GameTheme['id']) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedThemeId,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  const playPreviewSound = (theme: GameTheme) => {
    switch (theme.soundType) {
      case 'sizzle': sound.playSizzle(); break;
      case 'afrobeat': sound.playAfrobeatDrop(); break;
      case 'danfo': sound.playDanfoHorn(); break;
      default: sound.playMatchSuccess(); break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Lagos Card Themes & Cultural Tiles
            </h2>
            <span className="text-xs text-purple-300">
              Customize tile aesthetics, custom icon pairs, and thematic match sounds
            </span>
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[70vh] overflow-y-auto pr-1">
          {THEMES_LIST.map((theme) => {
            const isSelected = theme.id === selectedThemeId;

            return (
              <div
                key={theme.id}
                onClick={() => {
                  sound.playTap();
                  playPreviewSound(theme);
                  onSelectTheme(theme.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-400 shadow-xl ring-2 ring-purple-500/50'
                    : 'bg-zinc-900/70 border-purple-900/30 hover:border-purple-600/60 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.badgeColor}`}>
                      {theme.culturalName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playPreviewSound(theme);
                        }}
                        title="Preview theme match audio"
                        className="p-1 rounded-md bg-zinc-800 text-purple-300 hover:text-white transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-white">
                    {theme.name}
                  </h3>

                  <p className="text-[11px] text-slate-300 mt-1 mb-3 leading-snug">
                    {theme.description}
                  </p>

                  {/* Sample Items preview icons */}
                  <div className="flex items-center gap-2 overflow-x-auto py-1 text-base">
                    {theme.items.slice(0, 6).map((item) => (
                      <span
                        key={item.id}
                        title={item.name}
                        className="w-7 h-7 rounded-lg bg-black/50 border border-purple-900/40 flex items-center justify-center shrink-0 shadow-inner"
                      >
                        {item.emoji}
                      </span>
                    ))}
                    <span className="text-[10px] text-purple-300 font-semibold shrink-0">
                      +{theme.items.length - 6} more
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-purple-900/30 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Match sound: <strong className="text-purple-200 capitalize">{theme.soundType} FX</strong></span>
                  <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? 'Active Theme' : 'Tap to Select'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
