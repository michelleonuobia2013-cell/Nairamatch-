import React, { useState } from 'react';
import { X, Sparkles, Bell, Check, Gift, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  onClaimDaily: () => Promise<number>;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({
  isOpen,
  onClose,
  streak,
  onClaimDaily,
  notificationsEnabled,
  onToggleNotifications
}) => {
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimedToday, setClaimedToday] = useState<boolean>(false);
  const [rewardClaimedAmount, setRewardClaimedAmount] = useState<number | null>(null);

  if (!isOpen) return null;

  const rewardTiers = [
    { day: 1, reward: 200 },
    { day: 2, reward: 250 },
    { day: 3, reward: 300 },
    { day: 4, reward: 400 },
    { day: 5, reward: 500 },
    { day: 6, reward: 750 },
    { day: 7, reward: 1000 }
  ];

  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      const amount = await onClaimDaily();
      sound.playCashout();
      setClaimedToday(true);
      setRewardClaimedAmount(amount);
    } catch {
      setClaimedToday(true);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Daily Login Bonus & Retention
            </h2>
            <span className="text-xs text-purple-300">
              Claim free Naira balance every 24 hours to fuel your tournament matches
            </span>
          </div>
        </div>

        {/* 7-Day Reward Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
          {rewardTiers.map((tier) => {
            const isCurrent = (streak % 7) + 1 === tier.day;
            const isCompleted = (streak % 7) >= tier.day;

            return (
              <div
                key={tier.day}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent 
                    ? 'bg-purple-900/60 border-purple-500 shadow-md ring-1 ring-purple-400' 
                    : isCompleted 
                      ? 'bg-emerald-950/40 border-emerald-800/40 opacity-80' 
                      : 'bg-zinc-900/60 border-purple-900/30'
                }`}
              >
                <span className="block text-[10px] text-slate-400 font-bold uppercase">
                  Day {tier.day}
                </span>

                <div className="my-1.5 flex justify-center">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Sparkles className={`w-4 h-4 ${isCurrent ? 'text-amber-400 animate-spin' : 'text-purple-400'}`} />
                  )}
                </div>

                <span className="font-mono-numbers text-xs font-bold text-emerald-400 block">
                  +₦{tier.reward}
                </span>
              </div>
            );
          })}
        </div>

        {/* Streak status callout */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <span className="font-bold text-sm text-white block">
                {streak} Days Consecutive Streak
              </span>
              <span className="text-[11px] text-purple-300">
                Log in daily to unlock the Day 7 ₦1,000 jackpot!
              </span>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isClaiming || claimedToday}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {claimedToday ? 'Claimed Today' : isClaiming ? 'Claiming...' : 'Claim Bonus'}
          </button>
        </div>

        {/* Interactive Push Notifications Setting */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/40 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <span className="font-bold text-xs sm:text-sm text-white block">
                Interactive Push Notifications
              </span>
              <span className="text-[11px] text-slate-400">
                Get alerted when ₦500 flash tournaments start & daily bonus refreshes
              </span>
            </div>
          </div>

          <button
            onClick={onToggleNotifications}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              notificationsEnabled ? 'bg-purple-600 justify-end' : 'bg-zinc-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>

        {/* Success Alert */}
        {rewardClaimedAmount && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs text-center font-bold">
            +₦{rewardClaimedAmount.toLocaleString()} credited directly to your real wallet balance!
          </div>
        )}

      </div>
    </div>
  );
};
