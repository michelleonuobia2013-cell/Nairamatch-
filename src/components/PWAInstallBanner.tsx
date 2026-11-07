import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Check, X, Share2, Sparkles, Wifi } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/audio';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  // If already running standalone as installed app, or user dismissed for session
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    sound.playTap();
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        sound.playCashout();
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General prompt
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {/* Subtle, sleek persistent install strip at top or bottom */}
      <div className="relative z-20 w-full bg-gradient-to-r from-purple-950 via-zinc-900 to-indigo-950 border-b border-purple-800/40 px-3 sm:px-6 py-2 text-xs flex items-center justify-between gap-3 shadow-md">
        
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-purple-600/80 border border-purple-400/40 flex items-center justify-center shrink-0 text-white">
            <Smartphone className="w-3.5 h-3.5" />
          </div>

          <div className="truncate">
            <span className="font-bold text-white">Install Nairamatch App</span>
            <span className="text-purple-300 ml-1.5 hidden md:inline">
              · Play offline, fast full-screen mobile experience, auto-saves to your phone & laptop
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install on Device</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            title="Dismiss install banner"
            className="p-1 rounded-md text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* iOS / General Device Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-6 relative text-center">
            
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg mb-3 text-white">
              <Download className="w-7 h-7" />
            </div>

            <h3 className="font-display text-lg font-bold text-white mb-1">
              Install Nairamatch on Your Device
            </h3>
            <p className="text-slate-300 text-xs mb-5">
              Enjoy zero lag, offline gameplay, and direct home screen launch!
            </p>

            <div className="space-y-3 text-left text-xs bg-zinc-900/80 p-4 rounded-2xl border border-purple-900/30 text-slate-200">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap your browser's <strong className="text-white">Share</strong> or <strong className="text-white">Menu (⋮)</strong> icon.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Select <strong className="text-emerald-400">Add to Home Screen</strong> or <strong className="text-emerald-400">Install App</strong>.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-900 text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Launch anytime directly from your phone app drawer or desktop dock!
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            >
              Got It!
            </button>

          </div>
        </div>
      )}
    </>
  );
};
