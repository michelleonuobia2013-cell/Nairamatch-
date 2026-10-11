import React from 'react';
import { Volume2, VolumeX, Bell, Wallet, UserCheck, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopBarProps {
  walletBalance: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  activeTab: 'game' | 'leaderboard' | 'payout' | 'species' | 'tutorial';
  onSelectTab: (tab: 'game' | 'leaderboard' | 'payout' | 'species' | 'tutorial') => void;
  onOpenPayout: () => void;
  onOpenNotifications: () => void;
  onOpenDailyRewards: () => void;
  unreadNotificationsCount: number;
  streak: number;
  userName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  walletBalance,
  soundEnabled,
  onToggleSound,
  activeTab,
  onSelectTab,
  onOpenPayout,
  onOpenNotifications,
  onOpenDailyRewards,
  unreadNotificationsCount,
  streak,
  userName
}) => {
  return (
    <header className="relative z-30 w-full border-b border-purple-900/40 bg-black/70 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectTab('game')} 
            className="flex items-center gap-2 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-900/50 border border-purple-400/30">
              <span className="font-display font-black text-white text-lg tracking-tight">₦</span>
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors whitespace-nowrap block leading-tight">
                NairaMatch
              </span>
              <span className="text-[10px] tracking-wider text-purple-400 font-medium block uppercase">
                Species Reaction
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => { sound.playTap(); onSelectTab('game'); }}
            className={`whitespace-nowrap transition-colors py-1 ${activeTab === 'game' ? 'text-white font-semibold border-b-2 border-purple-500' : 'hover:text-purple-300'}`}
          >
            Play Match
          </button>
          <button
            onClick={() => { sound.playTap(); onSelectTab('leaderboard'); }}
            className={`whitespace-nowrap transition-colors py-1 ${activeTab === 'leaderboard' ? 'text-white font-semibold border-b-2 border-purple-500' : 'hover:text-purple-300'}`}
          >
            Leaderboard
          </button>
          <button
            onClick={() => { sound.playTap(); onSelectTab('payout'); }}
            className={`whitespace-nowrap transition-colors py-1 ${activeTab === 'payout' ? 'text-white font-semibold border-b-2 border-purple-500' : 'hover:text-purple-300'}`}
          >
            Real Payout Engine
          </button>
          <button
            onClick={() => { sound.playTap(); onSelectTab('species'); }}
            className={`whitespace-nowrap transition-colors py-1 ${activeTab === 'species' ? 'text-white font-semibold border-b-2 border-purple-500' : 'hover:text-purple-300'}`}
          >
            Rare Species Intel
          </button>
          <button
            onClick={() => { sound.playTap(); onSelectTab('tutorial'); }}
            className={`whitespace-nowrap transition-colors py-1 ${activeTab === 'tutorial' ? 'text-white font-semibold border-b-2 border-purple-500' : 'hover:text-purple-300'}`}
          >
            How to Play
          </button>
        </nav>

        {/* Zone 3: Wallet Action & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Daily Streak Trigger */}
          <button
            onClick={() => { sound.playTap(); onOpenDailyRewards(); }}
            title="Claim daily streak rewards"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-950/70 border border-purple-800/50 hover:border-purple-600/70 text-purple-300 hover:text-purple-100 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak {streak}x</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            className="p-2 rounded-lg bg-zinc-900/80 border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-700 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          {/* Notification Center */}
          <button
            onClick={() => { sound.playTap(); onOpenNotifications(); }}
            title="Interactive notifications"
            className="relative p-2 rounded-lg bg-zinc-900/80 border border-purple-900/40 text-slate-300 hover:text-white hover:border-purple-700 transition-colors"
          >
            <Bell className="w-4 h-4 text-purple-400" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center shadow">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Real Wallet Balance Pill + Cashout Engine Trigger */}
          <button
            onClick={() => { sound.playTap(); onOpenPayout(); }}
            className="group flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-purple-900/80 to-fuchsia-950/80 hover:from-purple-800 hover:to-fuchsia-900 border border-purple-500/40 hover:border-purple-400 transition-all shadow-md shadow-purple-950/60"
          >
            <Wallet className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="text-left">
              <span className="block text-[10px] uppercase font-bold text-purple-300 tracking-wider leading-none">
                Real Balance
              </span>
              <span className="font-mono-numbers text-sm sm:text-base font-bold text-emerald-300 leading-tight">
                ₦{walletBalance.toLocaleString()}
              </span>
            </div>
            <span className="hidden md:inline-block ml-1 text-xs px-2 py-0.5 rounded bg-purple-600/60 text-purple-100 font-semibold group-hover:bg-purple-500 transition-colors">
              Cashout
            </span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center justify-between gap-1 mt-2.5 pt-2 border-t border-purple-900/30 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => { sound.playTap(); onSelectTab('game'); }}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${activeTab === 'game' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400'}`}
        >
          Play Match
        </button>
        <button
          onClick={() => { sound.playTap(); onSelectTab('leaderboard'); }}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${activeTab === 'leaderboard' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400'}`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => { sound.playTap(); onSelectTab('payout'); }}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${activeTab === 'payout' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400'}`}
        >
          Bank Payout
        </button>
        <button
          onClick={() => { sound.playTap(); onSelectTab('species'); }}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${activeTab === 'species' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400'}`}
        >
          Rare Species
        </button>
        <button
          onClick={() => { sound.playTap(); onSelectTab('tutorial'); }}
          className={`px-3 py-1 rounded-md whitespace-nowrap ${activeTab === 'tutorial' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400'}`}
        >
          Tutorial
        </button>
      </div>
    </header>
  );
};
