import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, AlertCircle, Trophy, Wallet, ArrowRight, Play } from 'lucide-react';
import { SPECIES_LIST } from '../data/species';
import { sound } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRealMatch: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onStartRealMatch
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Mini Interactive Tutorial Practice Board (4 cards, 2 pairs)
  const [practiceCards, setPracticeCards] = useState([
    { id: 1, sp: SPECIES_LIST[0], flipped: false, matched: false },
    { id: 2, sp: SPECIES_LIST[1], flipped: false, matched: false },
    { id: 3, sp: SPECIES_LIST[0], flipped: false, matched: false },
    { id: 4, sp: SPECIES_LIST[1], flipped: false, matched: false }
  ]);
  const [practiceSelected, setPracticeSelected] = useState<number[]>([]);
  const [practiceEarnings, setPracticeEarnings] = useState<number>(0);
  const [practiceMessage, setPracticeMessage] = useState<string>('Click any card to flip and practice finding pairs!');

  if (!isOpen) return null;

  // Handle click on practice cards
  const handlePracticeCardClick = (index: number) => {
    if (practiceCards[index].flipped || practiceCards[index].matched || practiceSelected.length >= 2) return;

    sound.playCardFlip();
    const nextCards = [...practiceCards];
    nextCards[index].flipped = true;
    setPracticeCards(nextCards);

    const nextSelected = [...practiceSelected, index];
    setPracticeSelected(nextSelected);

    if (nextSelected.length === 2) {
      const [idx1, idx2] = nextSelected;
      if (nextCards[idx1].sp.id === nextCards[idx2].sp.id) {
        // Matched!
        setTimeout(() => {
          sound.playMatchSuccess();
          nextCards[idx1].matched = true;
          nextCards[idx2].matched = true;
          setPracticeCards([...nextCards]);
          setPracticeSelected([]);
          setPracticeEarnings(e => e + 500);
          setPracticeMessage('Match found! +₦500 added to your score!');
        }, 400);
      } else {
        // Mismatch!
        setTimeout(() => {
          sound.playMismatch();
          nextCards[idx1].flipped = false;
          nextCards[idx2].flipped = false;
          setPracticeCards([...nextCards]);
          setPracticeSelected([]);
          setPracticeEarnings(e => Math.max(0, e - 1));
          setPracticeMessage('Mismatch! -₦1 deducted. Remember their positions!');
        }, 700);
      }
    }
  };

  const resetPractice = () => {
    setPracticeCards([
      { id: 1, sp: SPECIES_LIST[0], flipped: false, matched: false },
      { id: 2, sp: SPECIES_LIST[1], flipped: false, matched: false },
      { id: 3, sp: SPECIES_LIST[0], flipped: false, matched: false },
      { id: 4, sp: SPECIES_LIST[1], flipped: false, matched: false }
    ]);
    setPracticeSelected([]);
    setPracticeEarnings(0);
    setPracticeMessage('Practice board reset! Tap to flip cards.');
  };

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              NairaMatch Tutorial & Practice Level
            </h2>
            <span className="text-xs text-purple-300">
              Master the card reaction rules and win real money
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6 border-b border-purple-900/30 pb-3 text-xs">
          {[
            { num: 1, title: 'Card Matching' },
            { num: 2, title: '10-Min Tournament' },
            { num: 3, title: 'Bank Cashout' },
            { num: 4, title: 'Practice Board' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => { sound.playTap(); setActiveStep(s.num); }}
              className={`flex items-center gap-1.5 transition-colors ${
                activeStep === s.num ? 'text-purple-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                activeStep === s.num ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-slate-400'
              }`}>
                {s.num}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          ))}
        </div>

        {/* STEP 1: CARD RULES */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">+₦500 For Every Correct Pair</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Tap any two cards. If both reveal the identical endangered species (e.g. Mexican Axolotl or Sunda Pangolin), you instantly win ₦500.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">-₦1 Deduction For Mismatches</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    If the cards do not match, ₦1 is deducted from your match earnings and the cards flip face-down. Keep sharp focus and remember card locations!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => { sound.playTap(); setActiveStep(2); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5"
              >
                <span>Next: Tournament Rules</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: 10-MIN TOURNAMENT */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
              <div className="flex items-start gap-3">
                <Trophy className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">10-Minute Precision Timer & 4-Player Table</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Matches run with a 10-minute session countdown. Compete against 3 other contenders on the real-time leaderboard.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-purple-900/40 text-xs text-slate-300 space-y-1.5 font-medium">
                <div className="flex justify-between text-emerald-400">
                  <span>1st Position Champion:</span>
                  <span className="font-bold">+₦500 Direct Account Prize</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>2nd Position Runner-up:</span>
                  <span className="font-bold">+₦500 Direct Account Prize</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>3rd & 4th Position:</span>
                  <span className="font-bold">₦0 Position Bonus</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => { sound.playTap(); setActiveStep(1); }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-slate-300 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                onClick={() => { sound.playTap(); setActiveStep(3); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5"
              >
                <span>Next: Real Bank Cashout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CASHOUT */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 space-y-3">
              <div className="flex items-start gap-3">
                <Wallet className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Assert Your Real Account Details</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Navigate to the Payout Engine, select your Nigerian Bank (e.g. Kuda, OPay, Palmpay, GTBank, Zenith), and enter your 10-digit NUBAN account number.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-purple-900/40 text-xs text-slate-300">
                Winnings are routed directly via NIBSS clearing to your account with automated transaction receipts and zero network fees!
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => { sound.playTap(); setActiveStep(2); }}
                className="px-4 py-2 rounded-xl bg-zinc-900 text-slate-300 hover:text-white text-xs"
              >
                Back
              </button>
              <button
                onClick={() => { sound.playTap(); setActiveStep(4); }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5"
              >
                <span>Try Practice Board</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: INTERACTIVE PRACTICE BOARD */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-medium">{practiceMessage}</span>
              <span className="font-mono-numbers text-xs font-bold text-emerald-400">
                Practice Score: ₦{practiceEarnings}
              </span>
            </div>

            {/* 4 Practice Cards */}
            <div className="grid grid-cols-4 gap-3">
              {practiceCards.map((card, idx) => {
                const isRevealed = card.flipped || card.matched;

                return (
                  <div
                    key={card.id}
                    onClick={() => handlePracticeCardClick(idx)}
                    className="aspect-[3/4] cursor-pointer perspective-1000 select-none"
                  >
                    <div
                      className={`relative w-full h-full rounded-xl transform-style-preserve-3d transition-transform duration-300 ${
                        isRevealed ? 'rotate-y-180' : ''
                      } ${card.matched ? 'ring-2 ring-emerald-400' : ''}`}
                    >
                      {/* Back */}
                      <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden bg-zinc-900 border border-purple-700/60 flex flex-col items-center justify-center p-2 text-center">
                        <span className="font-bold text-white text-sm">₦</span>
                        <span className="text-[9px] text-purple-300 mt-1">Tap to Flip</span>
                      </div>

                      {/* Front */}
                      <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 bg-zinc-950 border border-purple-500 p-1 flex flex-col items-center justify-between overflow-hidden">
                        <img 
                          src={card.sp.image} 
                          alt={card.sp.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-3/5 object-cover rounded-md"
                        />
                        <span className="text-[9px] font-bold text-white truncate w-full text-center">
                          {card.sp.name}
                        </span>
                        <span className="text-[8px] text-emerald-400 font-bold">
                          +₦500
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={resetPractice}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-slate-300 text-xs hover:text-white"
              >
                Reset Cards
              </button>

              <button
                onClick={() => {
                  onClose();
                  onStartRealMatch();
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-950/60"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Real Tournament</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
