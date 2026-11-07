import React from 'react';
import { X, MapPin, Star, Lock, Play, Clock, Sparkles, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';
import { CAMPAIGN_STAGES, StageConfig } from '../data/stages';
import { StageProgress } from '../utils/storage';
import { sound } from '../utils/audio';

interface StageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStage: (stage: StageConfig) => void;
  stageProgress: Record<string, StageProgress>;
}

export const StageSelectorModal: React.FC<StageSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectStage,
  stageProgress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <MapPin className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Lagos Energy Environmental Stages
            </h2>
            <span className="text-xs text-purple-300">
              Battle unpredictable street mechanics, shifting traffic, and market hustle
            </span>
          </div>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {CAMPAIGN_STAGES.map((stage) => {
            const progress = stageProgress[stage.id] || {
              unlocked: stage.stageNumber === 1,
              highScore: 0,
              stars: 0,
              bestTimeRemaining: 0
            };
            const isUnlocked = progress.unlocked;

            const getDifficultyBadge = (diff: string) => {
              switch (diff) {
                case 'Easy': return 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
                case 'Medium': return 'bg-yellow-950 text-yellow-300 border-yellow-800/50';
                case 'Hard': return 'bg-orange-950 text-orange-300 border-orange-800/50';
                case 'Expert': return 'bg-rose-950 text-rose-300 border-rose-800/50';
                default: return 'bg-purple-950 text-purple-300 border-purple-800/50';
              }
            };

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-zinc-900/90 border-purple-800/50 hover:border-purple-500 shadow-xl'
                    : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                }`}
              >
                <div>
                  {/* Top Bar with Number, Difficulty, and Stars */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-purple-900/60 border border-purple-600/40 text-purple-200 text-xs font-bold flex items-center justify-center font-display">
                        {stage.stageNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(stage.difficulty)}`}>
                        {stage.difficulty} · {stage.gridCols}x{stage.gridRows} ({stage.totalCards} cards)
                      </span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map(s => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= progress.stars ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-display font-bold text-base text-white">
                    {stage.name}
                  </h3>
                  <span className="text-[11px] text-purple-300 font-medium block mb-2">
                    {stage.culturalLocation}
                  </span>

                  <p className="text-xs text-slate-300 leading-snug mb-3">
                    {stage.description}
                  </p>

                  {/* Environmental Mechanic Highlight */}
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200 mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{stage.mechanicSummary.split(':')[0]}</span>
                    </div>
                    <p className="text-slate-300 text-[10px]">
                      {stage.mechanicSummary.split(':')[1] || stage.mechanicSummary}
                    </p>
                  </div>
                </div>

                {/* Footer with Reward & CTA */}
                <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">First Clear Reward</span>
                    <span className="font-mono-numbers text-xs font-bold text-emerald-400">
                      +₦{stage.completionNairaReward.toLocaleString()}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sound.playTap();
                        onClose();
                        onSelectStage(stage);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Play Stage</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Clear Stage {stage.stageNumber - 1} to Unlock</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
