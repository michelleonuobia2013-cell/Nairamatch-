import React, { useState } from 'react';
import { X, Trophy, Medal, Award, Flame, Search, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardPlayer {
  rank: number;
  name: string;
  winnings: string;
  matches: number;
  winRate: string;
  badge: string;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboard: LeaderboardPlayer[];
  userRank: number;
  userName: string;
  userWinnings: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  leaderboard,
  userRank,
  userName,
  userWinnings
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'daily' | 'weekly' | 'allTime'>('daily');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Global Tournament Leaderboard
            </h2>
            <span className="text-xs text-purple-300">
              Top rare species reaction champions across Nigeria & Diaspora
            </span>
          </div>
        </div>

        {/* Period Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-zinc-900/90 rounded-xl border border-purple-900/40 mb-5">
          <button
            onClick={() => { sound.playTap(); setFilterPeriod('daily'); }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              filterPeriod === 'daily' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's 10-Min Rush
          </button>
          <button
            onClick={() => { sound.playTap(); setFilterPeriod('weekly'); }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              filterPeriod === 'weekly' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Grand Prix
          </button>
          <button
            onClick={() => { sound.playTap(); setFilterPeriod('allTime'); }}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-all ${
              filterPeriod === 'allTime' 
                ? 'bg-purple-700 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All-Time Hall of Fame
          </button>
        </div>

        {/* User's Standings Callout Box */}
        <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-600/50 flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
              #{userRank}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">{userName}</span>
              <span className="text-[10px] text-purple-300">Your current tournament standing</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono-numbers font-bold text-sm text-emerald-400 block">
              ₦{userWinnings.toLocaleString()} Won
            </span>
            <span className="text-[10px] font-semibold text-purple-200">
              Gold Tier Rank
            </span>
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {leaderboard.map((item) => {
            const isTop3 = item.rank <= 3;
            const isFirst = item.rank === 1;

            return (
              <div
                key={item.rank}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isFirst
                    ? 'bg-amber-950/30 border-amber-500/40 shadow-md'
                    : isTop3
                      ? 'bg-purple-950/30 border-purple-800/40'
                      : 'bg-zinc-900/50 border-purple-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-400 text-black shadow' :
                    item.rank === 2 ? 'bg-slate-300 text-black' :
                    item.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-zinc-800 text-slate-400'
                  }`}>
                    {item.rank}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 border border-purple-700/40">
                        {item.badge}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{item.matches} matches played</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.winRate} accuracy</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono-numbers font-bold text-xs sm:text-sm text-emerald-400 block">
                    {item.winnings}
                  </span>
                  <span className="text-[10px] text-purple-300">
                    {item.rank <= 2 ? '+₦500 Eligible' : 'Top Contender'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-purple-900/30 text-center text-xs text-slate-400">
          Rankings update in real-time after each 10-minute game cycle. Top 2 always claim ₦500 each.
        </div>

      </div>
    </div>
  );
};
