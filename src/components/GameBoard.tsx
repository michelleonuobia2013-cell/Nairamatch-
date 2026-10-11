import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Users, Trophy, Clock, Zap, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck, Flame } from 'lucide-react';
import { SPECIES_LIST, RareSpecies } from '../data/species';
import { sound } from '../utils/audio';

export interface CardItem {
  uid: string;
  species: RareSpecies;
  isFlipped: boolean;
  isMatched: boolean;
}

interface TournamentPlayer {
  id: string;
  name: string;
  location: string;
  avatar: string;
  score: number;
  matches: number;
  isHuman: boolean;
}

interface GameBoardProps {
  onCreditWallet: (netWinnings: number, correctMatches: number, wrongGuesses: number, positionBonus: number, finishPosition: number) => void;
  onOpenPayout: () => void;
  onShare: (score: number, amount: number) => void;
  soundEnabled: boolean;
  streak: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onCreditWallet,
  onOpenPayout,
  onShare,
  streak
}) => {
  // Game session states
  const [gameMode, setGameMode] = useState<'online' | 'offline'>('online');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'standard' | 'blitz'>('standard'); // 12 cards (6 pairs) or 16 cards (8 pairs)

  // 10-Minute Precision Timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cards deck
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Match statistics for current game
  const [roundEarnings, setRoundEarnings] = useState<number>(0);
  const [correctMatchesCount, setCorrectMatchesCount] = useState<number>(0);
  const [wrongGuessesCount, setWrongGuessesCount] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const lastMatchTimeRef = useRef<number>(0);

  // Floating notifications
  const [actionAlert, setActionAlert] = useState<{ text: string; type: 'success' | 'penalty'; id: number } | null>(null);

  // 4-Player Tournament Table
  const [players, setPlayers] = useState<TournamentPlayer[]>([
    {
      id: 'p1',
      name: 'You (Chinedu)',
      location: 'Lagos, NG',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      score: 0,
      matches: 0,
      isHuman: true
    },
    {
      id: 'p2',
      name: 'Amina Queen',
      location: 'Abuja, NG',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      score: 0,
      matches: 0,
      isHuman: false
    },
    {
      id: 'p3',
      name: 'Babajide Speed',
      location: 'Ibadan, NG',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      score: 0,
      matches: 0,
      isHuman: false
    },
    {
      id: 'p4',
      name: 'Tunde Spark',
      location: 'Port Harcourt, NG',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      score: 0,
      matches: 0,
      isHuman: false
    }
  ]);

  // Generate Deck
  const generateDeck = () => {
    // Select pairs from our rare species list
    const pairCount = difficulty === 'standard' ? 6 : 8;
    const pool = [...SPECIES_LIST];
    const chosenSpecies: RareSpecies[] = [];

    for (let i = 0; i < pairCount; i++) {
      chosenSpecies.push(pool[i % pool.length]);
    }

    // Duplicate to form pairs
    const deckItems: CardItem[] = [];
    chosenSpecies.forEach((sp, idx) => {
      deckItems.push({
        uid: `${sp.id}_a_${idx}_${Math.random()}`,
        species: sp,
        isFlipped: false,
        isMatched: false
      });
      deckItems.push({
        uid: `${sp.id}_b_${idx}_${Math.random()}`,
        species: sp,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle using Fisher-Yates
    for (let i = deckItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deckItems[i], deckItems[j]] = [deckItems[j], deckItems[i]];
    }

    return deckItems;
  };

  // Start new match
  const startMatch = () => {
    sound.playTap();
    const newDeck = generateDeck();
    setCards(newDeck);
    setSelectedCards([]);
    setIsProcessing(false);
    setTimeLeft(600); // 10 minutes (600 seconds)
    setIsPlaying(true);
    setIsFinished(false);
    setRoundEarnings(0);
    setCorrectMatchesCount(0);
    setWrongGuessesCount(0);
    setComboStreak(0);
    setHighestCombo(0);

    // Reset competitors scores
    setPlayers(prev => prev.map(p => ({
      ...p,
      score: 0,
      matches: 0
    })));
  };

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishMatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished]);

  // Simulated AI/Online opponents action loop
  useEffect(() => {
    if (!isPlaying || isFinished) return;

    const botInterval = setInterval(() => {
      // Pick random bot
      const botIndex = Math.floor(Math.random() * 3) + 1; // index 1, 2, or 3
      const willMatch = Math.random() > 0.45; // 55% success rate

      setPlayers(currentPlayers => {
        const next = [...currentPlayers];
        const bot = { ...next[botIndex] };

        if (willMatch) {
          bot.matches += 1;
          bot.score += 500;
        } else {
          bot.score = Math.max(0, bot.score - 1);
        }

        next[botIndex] = bot;
        return next;
      });
    }, 4500);

    return () => clearInterval(botInterval);
  }, [isPlaying, isFinished]);

  // Handle Card Click
  const handleCardClick = (index: number) => {
    if (!isPlaying || isProcessing || isFinished) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length >= 2) return;

    sound.playCardFlip();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].isFlipped = true;
    setCards(updatedCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const card1 = updatedCards[firstIdx];
      const card2 = updatedCards[secondIdx];

      if (card1.species.id === card2.species.id) {
        // MATCH SUCCESS: +₦500
        const now = Date.now();
        const timeDiff = (now - lastMatchTimeRef.current) / 1000;
        lastMatchTimeRef.current = now;

        const isQuickCombo = timeDiff > 0 && timeDiff < 4.0;
        const currentCombo = isQuickCombo ? comboStreak + 1 : 1;
        setComboStreak(currentCombo);
        setHighestCombo(h => Math.max(h, currentCombo));

        setTimeout(() => {
          sound.playMatchSuccess();
          updatedCards[firstIdx].isMatched = true;
          updatedCards[secondIdx].isMatched = true;
          setCards([...updatedCards]);
          setSelectedCards([]);
          setIsProcessing(false);

          setCorrectMatchesCount(c => c + 1);
          setRoundEarnings(e => e + 500);

          // Update human player in tournament standings
          setPlayers(current => {
            const next = [...current];
            next[0] = {
              ...next[0],
              score: next[0].score + 500,
              matches: next[0].matches + 1
            };
            return next;
          });

          // Show floating visual alert
          setActionAlert({
            text: `+₦500 Matched ${card1.species.name}!`,
            type: 'success',
            id: Date.now()
          });

          // Check if board completed
          const remainingUnmatched = updatedCards.filter(c => !c.isMatched);
          if (remainingUnmatched.length === 0) {
            // Deck cleared! Reload fresh deck so player can keep building earnings within the 10-minute timer!
            setTimeout(() => {
              const freshDeck = generateDeck();
              setCards(freshDeck);
              setActionAlert({
                text: 'Board Cleared! Fresh Species Deck Deployed!',
                type: 'success',
                id: Date.now()
              });
            }, 800);
          }
        }, 500);

      } else {
        // MISMATCH: -₦1 PENALTY
        setTimeout(() => {
          sound.playMismatch();
          setWrongGuessesCount(w => w + 1);
          setRoundEarnings(e => Math.max(0, e - 1));
          setComboStreak(0);

          // Deduct 1 naira from tournament score
          setPlayers(current => {
            const next = [...current];
            next[0] = {
              ...next[0],
              score: Math.max(0, next[0].score - 1)
            };
            return next;
          });

          setActionAlert({
            text: `-₦1 Mismatch Deduction`,
            type: 'penalty',
            id: Date.now()
          });

          // Flip back
          updatedCards[firstIdx].isFlipped = false;
          updatedCards[secondIdx].isFlipped = false;
          setCards([...updatedCards]);
          setSelectedCards([]);
          setIsProcessing(false);
        }, 850);
      }
    }
  };

  // Finish match calculation
  const finishMatch = () => {
    setIsPlaying(false);
    setIsFinished(true);

    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate final standings
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const humanPosition = sorted.findIndex(p => p.isHuman) + 1; // 1, 2, 3, or 4

    // 1st and 2nd positions win +₦500 tournament position prize!
    const positionPrize = (humanPosition === 1 || humanPosition === 2) ? 500 : 0;
    const finalNet = roundEarnings + positionPrize;

    if (positionPrize > 0) {
      sound.playCashout();
    }

    // Credit to real account wallet
    onCreditWallet(finalNet, correctMatchesCount, wrongGuessesCount, positionPrize, humanPosition);
  };

  // Sort players by score for live table
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const userCurrentRank = sortedPlayers.findIndex(p => p.isHuman) + 1;

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6">

      {/* Floating Action Feedback Banner */}
      {actionAlert && (
        <div 
          key={actionAlert.id}
          className={`fixed top-20 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-xl border shadow-xl flex items-center gap-2 backdrop-blur-md transition-all animate-bounce ${
            actionAlert.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' 
              : 'bg-rose-950/90 border-rose-500/50 text-rose-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-semibold text-xs sm:text-sm">{actionAlert.text}</span>
        </div>
      )}

      {/* Hero Stats & Mode Controls HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
        
        {/* Left: Tournament & Game Status Overview */}
        <div className="lg:col-span-8 rounded-2xl bg-zinc-950/80 border border-purple-900/50 p-4 sm:p-5 backdrop-blur-md shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-900/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-display font-semibold text-sm sm:text-base text-white">
                10-Minute Reaction Tournament
              </span>
              <span className="text-xs text-purple-400">·</span>
              <span className="text-xs text-purple-300">
                1st & 2nd Prize: ₦500 each
              </span>
            </div>

            {/* Mode & Deck Toggles */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-zinc-900 rounded-lg border border-purple-900/40">
                <button
                  onClick={() => setGameMode('online')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${gameMode === 'online' ? 'bg-purple-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Online Match
                </button>
                <button
                  onClick={() => setGameMode('offline')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${gameMode === 'offline' ? 'bg-purple-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Offline Bot
                </button>
              </div>

              {!isPlaying && (
                <button
                  onClick={startMatch}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Match</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            {/* 10-Minute Precision Timer */}
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${timeLeft <= 60 && isPlaying ? 'bg-rose-950/60 border-rose-600/50 animate-pulse' : 'bg-purple-950/30 border-purple-900/40'}`}>
              <div className="w-9 h-9 rounded-lg bg-purple-900/50 border border-purple-700/50 flex items-center justify-center shrink-0">
                <Clock className={`w-5 h-5 ${timeLeft <= 60 && isPlaying ? 'text-rose-400' : 'text-purple-300'}`} />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Session Clock</span>
                <span className={`font-mono-numbers text-lg sm:text-xl font-bold ${timeLeft <= 60 && isPlaying ? 'text-rose-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Current Match Earnings */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center shrink-0">
                <span className="text-emerald-400 font-bold text-base">₦</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Current Match Earnings</span>
                <span className="font-mono-numbers text-lg sm:text-xl font-bold text-emerald-400">
                  +₦{roundEarnings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Match / Mismatch Ratio */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Pairs / Mismatches</span>
                <div className="flex items-center gap-2 font-mono-numbers text-sm sm:text-base font-bold">
                  <span className="text-emerald-400">+{correctMatchesCount}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-rose-400">-{wrongGuessesCount}</span>
                </div>
              </div>
            </div>

            {/* Live Projected Position */}
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-700/50 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">Position Standing</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono-numbers text-lg sm:text-xl font-bold text-amber-300">
                    {userCurrentRank}{userCurrentRank === 1 ? 'st' : userCurrentRank === 2 ? 'nd' : userCurrentRank === 3 ? 'rd' : 'th'}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${userCurrentRank <= 2 ? 'bg-emerald-900/70 text-emerald-300' : 'bg-zinc-800 text-slate-400'}`}>
                    {userCurrentRank <= 2 ? '+₦500 Prize' : '₦0 Prize'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live 4-Player Standing Table (Tournament Board) */}
        <div className="lg:col-span-4 rounded-2xl bg-zinc-950/80 border border-purple-900/50 p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-purple-900/30 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="font-display font-semibold text-sm text-white">4-Player Live Table</h3>
              </div>
              <span className="text-[11px] text-purple-400">
                {gameMode === 'online' ? 'Lagos Matchmaking Room' : 'Local Offline Table'}
              </span>
            </div>

            {/* Standings list */}
            <div className="space-y-2">
              {sortedPlayers.map((player, idx) => {
                const rank = idx + 1;
                const isUser = player.isHuman;
                const getsPrize = rank === 1 || rank === 2;

                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                      isUser 
                        ? 'bg-purple-900/40 border border-purple-500/50 shadow' 
                        : 'bg-zinc-900/50 border border-purple-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        rank === 1 ? 'bg-amber-400 text-black' :
                        rank === 2 ? 'bg-slate-300 text-black' :
                        rank === 3 ? 'bg-amber-800 text-white' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {rank}
                      </div>

                      <img 
                        src={player.avatar} 
                        alt={player.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                      />

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-semibold ${isUser ? 'text-white' : 'text-slate-300'}`}>
                            {player.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-none">
                          {player.location}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono-numbers text-xs font-bold text-emerald-400 block leading-tight">
                        ₦{player.score.toLocaleString()}
                      </span>
                      <span className={`text-[10px] font-medium leading-none ${getsPrize ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {getsPrize ? '₦500 Prize' : '₦0'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table Footer Rule Reminder */}
          <div className="mt-3 pt-2.5 border-t border-purple-900/30 flex items-center justify-between text-[11px] text-slate-400">
            <span>Match: +₦500</span>
            <span aria-hidden="true">·</span>
            <span>Mismatch: -₦1</span>
            <span aria-hidden="true">·</span>
            <span className="text-purple-300 font-semibold">1st & 2nd: +₦500</span>
          </div>
        </div>

      </div>

      {/* Main Playing Cards Arena */}
      <div className="relative rounded-3xl bg-zinc-950/70 border border-purple-800/40 p-4 sm:p-6 md:p-8 backdrop-blur-md shadow-2xl">
        
        {/* Combo Multiplier Alert */}
        {comboStreak >= 2 && (
          <div className="absolute top-4 right-4 sm:right-8 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold shadow-lg shadow-orange-950/50 animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>{comboStreak}x Speed Combo Active!</span>
          </div>
        )}

        {!isPlaying && !isFinished ? (
          /* Pre-Game Lobby State */
          <div className="py-12 px-4 text-center max-w-xl mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-900 p-1 shadow-2xl shadow-purple-900/60 mb-6 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-black/50 backdrop-blur flex items-center justify-center">
                <span className="font-display font-black text-white text-3xl">₦500</span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to Win Real Naira?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
              Find matching pairs of rare species cards. Earn <span className="text-emerald-400 font-semibold">+₦500 for every match</span>, lose <span className="text-rose-400 font-semibold">₦1 per fail</span>. Finish in 1st or 2nd position in the 10-minute tournament to claim another <span className="text-emerald-400 font-semibold">+₦500 directly into your bank account</span>!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startMatch}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-base shadow-xl shadow-purple-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Start 10-Minute Tournament
              </button>
              <button
                onClick={onOpenPayout}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-slate-200 border border-purple-800/40 text-sm font-semibold transition-all"
              >
                Assert Bank Account Details
              </button>
            </div>
          </div>
        ) : (
          /* Active Cards Grid */
          <div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {cards.map((card, index) => {
                const isSelected = selectedCards.includes(index);
                const isRevealed = card.isFlipped || card.isMatched;

                return (
                  <div
                    key={card.uid}
                    onClick={() => handleCardClick(index)}
                    className="relative aspect-[3/4] cursor-pointer perspective-1000 select-none group"
                  >
                    <div
                      className={`relative w-full h-full rounded-2xl transform-style-preserve-3d transition-transform duration-300 ease-out shadow-lg ${
                        isRevealed ? 'rotate-y-180' : ''
                      } ${
                        card.isMatched 
                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-black' 
                          : isSelected 
                            ? 'ring-2 ring-purple-400' 
                            : 'hover:scale-[1.03]'
                      }`}
                    >
                      {/* CARD BACK (FACED DOWNWARD) */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden bg-gradient-to-br from-zinc-900 via-purple-950 to-black border-2 border-purple-800/60 flex flex-col items-center justify-between p-3 overflow-hidden shadow-xl">
                        
                        {/* Decorative card corner emblems */}
                        <div className="w-full flex justify-between items-center text-[11px] font-bold text-purple-400">
                          <span>₦</span>
                          <span>★</span>
                        </div>

                        {/* Center Cosmic Pattern */}
                        <div className="relative flex flex-col items-center justify-center">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shadow-inner group-hover:border-purple-400 group-hover:scale-105 transition-all">
                            <span className="font-display font-extrabold text-white text-xl sm:text-2xl drop-shadow">
                              ₦
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300/80 mt-1.5">
                            Match
                          </span>
                        </div>

                        {/* Bottom Reward Marker */}
                        <div className="w-full flex justify-between items-center text-[10px] font-bold text-purple-400">
                          <span>+₦500</span>
                          <span>-₦1</span>
                        </div>
                      </div>

                      {/* CARD FRONT (REVEALED RARE SPECIES) */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 bg-zinc-950 border-2 border-purple-500/70 flex flex-col p-2 overflow-hidden shadow-2xl">
                        {/* Image Frame */}
                        <div className="relative w-full h-3/5 rounded-xl overflow-hidden bg-purple-950/60">
                          <img
                            src={card.species.image}
                            alt={card.species.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-bold text-emerald-400">
                            +₦500
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between pt-1.5 text-center">
                          <div>
                            <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate leading-tight">
                              {card.species.name}
                            </h4>
                            <span className="text-[10px] text-purple-300 italic truncate block">
                              {card.species.scientificName}
                            </span>
                          </div>

                          <div className="flex items-center justify-center">
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${card.species.statusColor}`}>
                              {card.species.status}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Footer during active game */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-900/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Reaction Rule: Match = +₦500</span>
                <span aria-hidden="true">·</span>
                <span>Mismatch = -₦1</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startMatch}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-slate-300 border border-purple-900/40 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Shuffle Deck</span>
                </button>
                <button
                  onClick={finishMatch}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  Finish & Tally Payout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* VICTORY & SUMMARY MODAL */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-purple-600/60 p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            
            {/* Header Glow */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />

            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-950/60 mb-4">
              <Trophy className="w-8 h-8 text-black" />
            </div>

            <h3 className="font-display text-2xl font-extrabold text-white mb-1">
              {userCurrentRank === 1 ? '1st Place Champion!' : userCurrentRank === 2 ? '2nd Place Winner!' : 'Match Completed!'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-6">
              {userCurrentRank <= 2 
                ? 'Congratulations! You secured top tier and won the ₦500 position bonus directly to your real account!'
                : 'Good effort! Third and fourth place receive ₦0 tournament bonus, but you keep all card match earnings!'}
            </p>

            {/* Earnings Breakdown Ledger */}
            <div className="rounded-2xl bg-purple-950/40 border border-purple-800/40 p-4 mb-6 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Correct Card Matches ({correctMatchesCount} × ₦500)</span>
                <span className="font-mono-numbers font-bold text-emerald-400">
                  +₦{(correctMatchesCount * 500).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Wrong Guesses Deduction ({wrongGuessesCount} × -₦1)</span>
                <span className="font-mono-numbers font-bold text-rose-400">
                  -₦{wrongGuessesCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Tournament Rank ({userCurrentRank}{userCurrentRank === 1 ? 'st' : userCurrentRank === 2 ? 'nd' : userCurrentRank === 3 ? 'rd' : 'th'} Position Bonus)</span>
                <span className={`font-mono-numbers font-bold ${userCurrentRank <= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {userCurrentRank <= 2 ? '+₦500' : '₦0'}
                </span>
              </div>

              <div className="border-t border-purple-800/50 pt-2 flex justify-between items-center font-bold text-sm sm:text-base">
                <span className="text-white">Net Credited to Real Wallet</span>
                <span className="font-mono-numbers text-emerald-400 text-lg">
                  ₦{(roundEarnings + (userCurrentRank <= 2 ? 500 : 0)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={startMatch}
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Play Again
              </button>

              <button
                onClick={() => {
                  setIsFinished(false);
                  onOpenPayout();
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition-all"
              >
                Cashout to Bank
              </button>

              <button
                onClick={() => onShare(correctMatchesCount, roundEarnings + (userCurrentRank <= 2 ? 500 : 0))}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-purple-800/40 font-semibold text-xs sm:text-sm transition-all"
              >
                Share Result
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
