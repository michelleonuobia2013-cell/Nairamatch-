import React, { useState } from 'react';
import { Eye, Zap, Sparkles, Shield, Plus, ShoppingBag, X } from 'lucide-react';
import { BOOSTERS_CONFIG, BoosterConfig } from '../data/stages';
import { BoosterInventory } from '../utils/storage';
import { sound } from '../utils/audio';

interface BoosterDockProps {
  boosters: BoosterInventory;
  walletBalance: number;
  onUseBooster: (boosterId: keyof BoosterInventory) => void;
  onBuyBooster: (boosterId: keyof BoosterInventory, count: number) => void;
  activeShieldCharges: number;
  isFlashLightActive: boolean;
  disabled?: boolean;
}

export const BoosterDock: React.FC<BoosterDockProps> = ({
  boosters,
  walletBalance,
  onUseBooster,
  onBuyBooster,
  activeShieldCharges,
  isFlashLightActive,
  disabled = false
}) => {
  const [shopOpen, setShopOpen] = useState<boolean>(false);
  const [selectedBooster, setSelectedBooster] = useState<BoosterConfig | null>(null);

  const boosterList = Object.values(BOOSTERS_CONFIG) as BoosterConfig[];

  const getIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'Eye': return <Eye className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Shield': return <Shield className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleBoosterClick = (id: keyof BoosterInventory) => {
    if (disabled) return;
    const count = boosters[id];
    if (count > 0) {
      sound.playPowerUp();
      onUseBooster(id);
    } else {
      sound.playTap();
      setSelectedBooster(BOOSTERS_CONFIG[id]);
      setShopOpen(true);
    }
  };

  const handlePurchase = (id: keyof BoosterInventory, cost: number) => {
    if (walletBalance < cost) {
      sound.playMismatch();
      return;
    }
    sound.playCashout();
    onBuyBooster(id, 1);
  };

  return (
    <div className="w-full">
      {/* Active Booster Dock Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur-md">
        
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold text-purple-300 tracking-wider hidden sm:inline">
            Power-Ups:
          </span>
          <button
            onClick={() => { sound.playTap(); setShopOpen(true); }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800/60 border border-purple-600/40 text-[11px] font-semibold text-purple-200 transition-colors"
          >
            <ShoppingBag className="w-3 h-3 text-amber-400" />
            <span>Booster Shop</span>
          </button>
        </div>

        {/* 4 Power-Up Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {boosterList.map(b => {
            const count = boosters[b.id as keyof BoosterInventory];
            const isShield = b.id === 'noWahala';
            const isFlash = b.id === 'flashLight';
            const isActive = (isShield && activeShieldCharges > 0) || (isFlash && isFlashLightActive);

            return (
              <button
                key={b.id}
                onClick={() => handleBoosterClick(b.id as keyof BoosterInventory)}
                disabled={disabled}
                title={`${b.culturalName} (${b.genericName}): ${b.description}`}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all select-none ${
                  isActive
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-400 animate-pulse'
                    : count > 0
                      ? 'bg-zinc-900/90 hover:bg-purple-950/60 border-purple-800/50 hover:border-purple-500 text-white shadow'
                      : 'bg-zinc-900/40 border-purple-950/30 text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`p-1 rounded-md bg-gradient-to-br ${b.badgeBg} text-white shadow-sm shrink-0`}>
                  {getIcon(b.iconName, 'w-3.5 h-3.5')}
                </div>

                <div className="text-left">
                  <span className="block text-[11px] font-bold text-slate-100 group-hover:text-purple-300 leading-none whitespace-nowrap">
                    {b.culturalName}
                  </span>
                  <span className="text-[9px] text-slate-400 leading-none block mt-0.5">
                    {isActive 
                      ? (isShield ? `${activeShieldCharges} Shield` : 'Active!') 
                      : count > 0 
                        ? `${count} left` 
                        : `₦${b.priceNaira}`}
                  </span>
                </div>

                {count === 0 && (
                  <span className="ml-1 p-0.5 rounded-full bg-purple-900/60 text-purple-300">
                    <Plus className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Booster Purchase Shop Modal */}
      {shopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto">
            
            <button
              onClick={() => { setShopOpen(false); setSelectedBooster(null); }}
              className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">Lagos Street Booster Shop</h3>
                <span className="text-xs text-purple-300">
                  Buy power-ups using in-game Naira wallet balance
                </span>
              </div>
            </div>

            {/* Wallet Available Banner */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between mb-5 text-xs">
              <span className="text-slate-300">Available Real Naira Balance:</span>
              <span className="font-mono-numbers font-bold text-emerald-400 text-sm">
                ₦{walletBalance.toLocaleString()}
              </span>
            </div>

            {/* Boosters List in Shop */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {boosterList.map(b => {
                const count = boosters[b.id as keyof BoosterInventory];
                const canAfford = walletBalance >= b.priceNaira;

                return (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-zinc-900/80 border border-purple-900/30 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.badgeBg} flex items-center justify-center text-white shrink-0 shadow`}>
                        {getIcon(b.iconName, 'w-5 h-5')}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white">
                            {b.culturalName}
                          </h4>
                          <span className="text-[10px] text-purple-300 font-medium">
                            ({b.genericName})
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                          {b.description}
                        </p>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          In inventory: <strong className="text-white">{count}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePurchase(b.id as keyof BoosterInventory, b.priceNaira)}
                      disabled={!canAfford}
                      className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white font-bold text-xs shrink-0 shadow transition-all cursor-pointer"
                    >
                      Buy for ₦{b.priceNaira}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-purple-900/40 text-center text-xs text-slate-400">
              Boosters can be used anytime during campaign stages or classic 10-minute tournaments!
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
