import React from 'react';
import { X, Bell, CheckCircle2, Clock, Trophy, Wallet, Sparkles } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payout' | 'tournament' | 'reward';
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onOpenPayout: () => void;
  onOpenDailyRewards: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onOpenPayout,
  onOpenDailyRewards
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-700/50 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">Notifications</h3>
              <span className="text-[11px] text-purple-300">Live game & payout alerts</span>
            </div>
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No new alerts at the moment.
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  item.read 
                    ? 'bg-zinc-900/40 border-purple-900/20' 
                    : 'bg-purple-950/40 border-purple-600/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-black/40 border border-purple-800/30 shrink-0 mt-0.5">
                    {item.type === 'payout' && <Wallet className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'tournament' && <Trophy className="w-4 h-4 text-amber-400" />}
                    {item.type === 'reward' && <Sparkles className="w-4 h-4 text-purple-400" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-xs text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono-numbers">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    {item.type === 'payout' && (
                      <button
                        onClick={() => { onClose(); onOpenPayout(); }}
                        className="mt-2 text-[10px] font-bold text-emerald-400 hover:underline"
                      >
                        View Bank Payout Details →
                      </button>
                    )}
                    {item.type === 'reward' && (
                      <button
                        onClick={() => { onClose(); onOpenDailyRewards(); }}
                        className="mt-2 text-[10px] font-bold text-purple-300 hover:underline"
                      >
                        Claim Daily Bonus →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
