import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send } from 'lucide-react';
import { sound } from '../utils/audio';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchesCount: number;
  totalWon: number;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  matchesCount,
  totalWon
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const shareText = `I just won ₦${totalWon.toLocaleString()} in the NairaMatch Rare Species 10-Minute Reaction Tournament! Match cards, earn +₦500 per pair and cash out directly to your Nigerian bank. Play now: https://nairamatch.app?ref=CHINEDU99`;

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.playTap();
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareToWhatsApp = () => {
    sound.playTap();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToX = () => {
    sound.playTap();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    sound.playTap();
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://nairamatch.app')}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    sound.playTap();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NairaMatch: Species Reaction & Cashout',
          text: shareText,
          url: 'https://nairamatch.app'
        });
      } catch {
        // user cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-950/50 mb-4">
          <Share2 className="w-7 h-7 text-white" />
        </div>

        <h3 className="font-display text-xl font-bold text-white mb-1">
          Share Your NairaMatch Victory
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm mb-6">
          Invite friends to compete in 10-minute reaction tournaments and earn a ₦200 referral bonus for every friend who links their bank account!
        </p>

        {/* Share Preview Card */}
        <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-left mb-6 font-mono-numbers text-xs space-y-1">
          <div className="text-emerald-400 font-bold text-sm">
            🏆 ₦{totalWon.toLocaleString()} Won Today!
          </div>
          <div className="text-slate-300">
            🎯 {matchesCount} Pairs Matched | ⚡ 10-Minute Blitz
          </div>
          <div className="text-purple-300 text-[11px] truncate mt-1">
            Referral Code: NAIRA-CHINEDU-99
          </div>
        </div>

        {/* Channels */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <button
            onClick={shareToWhatsApp}
            className="p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-emerald-300">WhatsApp</span>
          </button>

          <button
            onClick={shareToX}
            className="p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-purple-900/40 flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
          >
            <span className="font-bold text-base text-white group-hover:scale-110 transition-transform">𝕏</span>
            <span className="text-[11px] font-semibold text-slate-300">Twitter / X</span>
          </button>

          <button
            onClick={shareToTelegram}
            className="p-3 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-700/50 flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
          >
            <Send className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-semibold text-blue-300">Telegram</span>
          </button>
        </div>

        {/* Copy Invite Link */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value="https://nairamatch.app/ref/CHINEDU99"
            className="flex-1 py-2 px-3 rounded-xl bg-zinc-900 border border-purple-900/40 text-slate-300 text-xs font-mono-numbers focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
