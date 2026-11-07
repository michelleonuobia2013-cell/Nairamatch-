import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, RotateCcw, Users, Trophy, Clock, Zap, Sparkles, 
  AlertCircle, CheckCircle2, ChevronRight, ShieldCheck, 
  Flame, Fuel, MapPin, Palette, Volume2, Shield, Eye, Star
} from 'lucide-react';
import { THEMES_LIST, GameTheme, ThemeTileItem } from '../data/themes';
import { CAMPAIGN_STAGES, StageConfig } from '../data/stages';
import { BoosterDock } from './BoosterDock';
import { BoosterInventory } from '../utils/storage';
import { sound } from '../utils/audio';

export interface CardItem {
  uid: string;
  item: ThemeTileItem;
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
  walletBalance: number;
  selectedTheme: GameTheme;
  onOpenThemeSelector: () => void;
  onOpenStageSelector: () => void;
  activeStage: StageConfig | null;
  onClearActiveStage: () => void;
  boosters: BoosterInventory;
  onUseBooster: (boosterId: keyof BoosterInventory) => void;
  onBuyBooster: (boosterId: keyof BoosterInventory, count: number) => void;
  onStageCompleted: (stageId: string, stars: number, rewardNaira: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  onCreditWallet,
  onOpenPayout,
  onShare,
  streak,
  walletBalance,
  selectedTheme,
  onOpenThemeSelector,
  onOpenStageSelector,
  activeStage,
  onClearActiveStage,
  boosters,
  onUseBooster,
  onBuyBooster,
  onStageCompleted
}) => {
  // Mode: Classic 10-Minute Tournament vs Lagos Environmental Stage
  const isCampaign = !!activeStage;

  // Session state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [stageCleared, setStageCleared] = useState<boolean>(false);
  const [starsEarned, setStarsEarned] = useState<number>(0);

  // Deck state
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Timers
  const initialDuration = isCampaign ? activeStage.timeLimitSeconds : 600;
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Environmental Mechanics State
  // 1. Third Mainland Fuel Tank
  const [fuelGauge, setFuelGauge] = useState<number>(100);

  // 2. Ojuelegba Traffic Reshuffle Countdown
  const [trafficCountdown, setTrafficCountdown] = useState<number>(15);
  const trafficIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 3. Balogun Market Distractions (Obscured indices)
  const [obscuredCardIndices, setObscuredCardIndices] = useState<number[]>([]);
  const marketIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Power-Ups Active Modifiers
  const [activeShieldCharges, setActiveShieldCharges] = useState<number>(0);
  const [isFlashLightActive, setIsFlashLightActive] = useState<boolean>(false);

  // Current session match counters
  const [roundEarnings, setRoundEarnings] = useState<number>(0);
  const [correctMatchesCount, setCorrectMatchesCount] = useState<number>(0);
  const [wrongGuessesCount, setWrongGuessesCount] = useState<number>(0);
  const [comboStreak, setComboStreak] = useState<number>(0);
  const lastMatchTimeRef = useRef<number>(0);

  // Floating notifications
  const [actionAlert, setActionAlert] = useState<{ text: string; type: 'success' | 'penalty' | 'info'; id: number } | null>(null);

  // 4-Player Tournament Table (Active during Classic Tournament mode)
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

  // Generate Deck based on current active stage grid size or classic mode
  const generateDeck = () => {
    const pairCount = isCampaign ? activeStage.pairCount : 6;
    const themePool = selectedTheme.items;
    const chosenItems: ThemeTileItem[] = [];

    for (let i = 0; i < pairCount; i++) {
      chosenItems.push(themePool[i % themePool.length]);
    }

    const deckItems: CardItem[] = [];
    chosenItems.forEach((item, idx) => {
      deckItems.push({
        uid: `${item.id}_a_${idx}_${Math.random()}`,
        item,
        isFlipped: false,
        isMatched: false
      });
      deckItems.push({
        uid: `${item.id}_b_${idx}_${Math.random()}`,
        item,
        isFlipped: false,
        isMatched: false
      });
    });

    // Fisher-Yates Shuffle
    for (let i = deckItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deckItems[i], deckItems[j]] = [deckItems[j], deckItems[i]];
    }

    return deckItems;
  };

  // Start / Restart Match
  const startMatch = () => {
    sound.playTap();
    const newDeck = generateDeck();
    setCards(newDeck);
    setSelectedCards([]);
    setIsProcessing(false);
    setTimeLeft(isCampaign ? activeStage.timeLimitSeconds : 600);
    setFuelGauge(100);
    setTrafficCountdown(15);
    setObscuredCardIndices([]);
    setActiveShieldCharges(0);
    setIsFlashLightActive(false);

    setIsPlaying(true);
    setIsFinished(false);
    setStageCleared(false);
    setStarsEarned(0);
    setRoundEarnings(0);
    setCorrectMatchesCount(0);
    setWrongGuessesCount(0);
    setComboStreak(0);

    // Reset tournament opponents
    setPlayers(prev => prev.map(p => ({
      ...p,
      score: 0,
      matches: 0
    })));
  };

  // Main countdown timer
  useEffect(() => {
    if (!isPlaying || isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSessionEnd(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isFinished, isCampaign]);

  // Stage Mechanic: Ojuelegba Traffic Reshuffle loop
  useEffect(() => {
    if (!isPlaying || isFinished || !isCampaign || !activeStage?.hasTrafficReshuffle) {
      if (trafficIntervalRef.current) clearInterval(trafficIntervalRef.current);
      return;
    }

    trafficIntervalRef.current = setInterval(() => {
      setTrafficCountdown(prev => {
        if (prev <= 1) {
          // Trigger Row Traffic Reshuffle!
          sound.playTrafficReshuffle();
          sound.playDanfoHorn();

          setCards(currentCards => {
            const cols = activeStage.gridCols;
            const updated = [...currentCards];

            // Reshuffle unmatched cards horizontally in their rows
            for (let row = 0; row < activeStage.gridRows; row++) {
              const startIdx = row * cols;
              const endIdx = startIdx + cols;
              const rowCards = updated.slice(startIdx, endIdx);

              // Gather indices of unmatched cards in this row
              const unmatchedIndices: number[] = [];
              const unmatchedItems: CardItem[] = [];

              rowCards.forEach((c, i) => {
                const globalIndex = startIdx + i;
                if (!c.isMatched && !c.isFlipped) {
                  unmatchedIndices.push(globalIndex);
                  unmatchedItems.push(c);
                }
              });

              // Shuffle row cards
              for (let i = unmatchedItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [unmatchedItems[i], unmatchedItems[j]] = [unmatchedItems[j], unmatchedItems[i]];
              }

              unmatchedIndices.forEach((globalIndex, i) => {
                updated[globalIndex] = unmatchedItems[i];
              });
            }

            return updated;
          });

          setActionAlert({
            text: 'Ojuelegba Traffic Shuffled Unmatched Cards!',
            type: 'info',
            id: Date.now()
          });

          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (trafficIntervalRef.current) clearInterval(trafficIntervalRef.current);
    };
  }, [isPlaying, isFinished, isCampaign, activeStage]);

  // Stage Mechanic: Balogun Market Distractions loop
  useEffect(() => {
    if (!isPlaying || isFinished || !isCampaign || !activeStage?.hasMarketDistraction) {
      if (marketIntervalRef.current) clearInterval(marketIntervalRef.current);
      return;
    }

    marketIntervalRef.current = setInterval(() => {
      // Pick 2-3 random cards to obscure with market canopies / hawker trays
      const randomIndices: number[] = [];
      const total = cards.length || 30;
      for (let i = 0; i < 3; i++) {
        randomIndices.push(Math.floor(Math.random() * total));
      }
      setObscuredCardIndices(randomIndices);

      // Clear obscuration after 2.8 seconds
      setTimeout(() => {
        setObscuredCardIndices([]);
      }, 2800);

    }, 7000);

    return () => {
      if (marketIntervalRef.current) clearInterval(marketIntervalRef.current);
    };
  }, [isPlaying, isFinished, isCampaign, activeStage, cards.length]);

  // Simulated tournament opponents loop (for classic 10-minute tournament)
  useEffect(() => {
    if (!isPlaying || isFinished || isCampaign) return;

    const botInterval = setInterval(() => {
      const botIndex = Math.floor(Math.random() * 3) + 1;
      const willMatch = Math.random() > 0.45;

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
  }, [isPlaying, isFinished, isCampaign]);

  // Card click handler
  const handleCardClick = (index: number) => {
    if (!isPlaying || isProcessing || isFinished) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length >= 2) return;

    sound.playCardFlip();

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newSelected;
      const card1 = updated[firstIdx];
      const card2 = updated[secondIdx];

      if (card1.item.id === card2.item.id) {
        // MATCH SUCCESS!
        const now = Date.now();
        const timeDiff = (now - lastMatchTimeRef.current) / 1000;
        lastMatchTimeRef.current = now;

        const isQuick = timeDiff > 0 && timeDiff < 3.5;
        const currentCombo = isQuick ? comboStreak + 1 : 1;
        setComboStreak(currentCombo);

        setTimeout(() => {
          // Play thematic audio
          if (selectedTheme.soundType === 'sizzle') sound.playSizzle();
          else if (selectedTheme.soundType === 'afrobeat') sound.playAfrobeatDrop();
          else if (selectedTheme.soundType === 'danfo') sound.playDanfoHorn();
          else sound.playMatchSuccess();

          updated[firstIdx].isMatched = true;
          updated[secondIdx].isMatched = true;
          setCards([...updated]);
          setSelectedCards([]);
          setIsProcessing(false);

          setCorrectMatchesCount(c => c + 1);
          const earned = 500;
          setRoundEarnings(e => e + earned);

          // If Fuel Gauge is active, replenish +10% fuel
          if (isCampaign && activeStage?.hasFuelGauge) {
            setFuelGauge(f => Math.min(100, f + 10));
          }

          // Update tournament standings
          if (!isCampaign) {
            setPlayers(current => {
              const next = [...current];
              next[0] = {
                ...next[0],
                score: next[0].score + earned,
                matches: next[0].matches + 1
              };
              return next;
            });
          }

          setActionAlert({
            text: `+₦500 Matched ${card1.item.name}!`,
            type: 'success',
            id: Date.now()
          });

          // Check if board cleared
          const remainingUnmatched = updated.filter(c => !c.isMatched);
          if (remainingUnmatched.length === 0) {
            if (isCampaign) {
              handleSessionEnd(true);
            } else {
              // Classic Mode: Deploy fresh deck to keep stacking Naira in remaining session clock!
              setTimeout(() => {
                const fresh = generateDeck();
                setCards(fresh);
                setActionAlert({
                  text: 'Deck Cleared! Fresh Round Deployed!',
                  type: 'success',
                  id: Date.now()
                });
              }, 800);
            }
          }
        }, 500);

      } else {
        // MISMATCH!
        setTimeout(() => {
          // Check if "No Wahala" Mistake Shield is active
          if (activeShieldCharges > 0) {
            setActiveShieldCharges(s => s - 1);
            setActionAlert({
              text: `No Wahala Shield Absorbed Mistake! (${activeShieldCharges - 1} left)`,
              type: 'info',
              id: Date.now()
            });
          } else {
            sound.playMismatch();
            setWrongGuessesCount(w => w + 1);
            setRoundEarnings(e => Math.max(0, e - 1));
            setComboStreak(0);

            // Drains fuel in Third Mainland Sprint
            if (isCampaign && activeStage?.hasFuelGauge) {
              setFuelGauge(f => {
                const nextFuel = Math.max(0, f - 6);
                if (nextFuel <= 0) {
                  // Car stalled out!
                  handleSessionEnd(false);
                }
                return nextFuel;
              });
            }

            if (!isCampaign) {
              setPlayers(current => {
                const next = [...current];
                next[0] = { ...next[0], score: Math.max(0, next[0].score - 1) };
                return next;
              });
            }

            setActionAlert({
              text: `-₦1 Mismatch Deduction`,
              type: 'penalty',
              id: Date.now()
            });
          }

          // Flip back
          updated[firstIdx].isFlipped = false;
          updated[secondIdx].isFlipped = false;
          setCards([...updated]);
          setSelectedCards([]);
          setIsProcessing(false);
        }, 850);
      }
    }
  };

  // Power-Up Activation Dispatcher
  const handleActivateBooster = (boosterId: keyof BoosterInventory) => {
    onUseBooster(boosterId);

    if (boosterId === 'flashLight') {
      // Reveal all cards for 2.5 seconds
      setIsFlashLightActive(true);
      setCards(prev => prev.map(c => ({ ...c, isFlipped: true })));

      setActionAlert({
        text: 'Flash Light: All Cards Revealed for 2.5s!',
        type: 'info',
        id: Date.now()
      });

      setTimeout(() => {
        setIsFlashLightActive(false);
        setCards(prev => prev.map(c => ({ ...c, isFlipped: c.isMatched ? true : false })));
      }, 2500);

    } else if (boosterId === 'nepaPower') {
      // Add +15 seconds
      setTimeLeft(t => t + 15);
      setActionAlert({
        text: 'Up NEPA! +15 Seconds Injected!',
        type: 'success',
        id: Date.now()
      });

    } else if (boosterId === 'vipPass') {
      // Auto-match one pair
      const unmatched = cards.filter(c => !c.isMatched);
      if (unmatched.length >= 2) {
        // Find matching pair
        const targetId = unmatched[0].item.id;
        const matchingIndices: number[] = [];
        cards.forEach((c, idx) => {
          if (!c.isMatched && c.item.id === targetId && matchingIndices.length < 2) {
            matchingIndices.push(idx);
          }
        });

        if (matchingIndices.length === 2) {
          const [i1, i2] = matchingIndices;
          const next = [...cards];
          next[i1].isMatched = true;
          next[i1].isFlipped = true;
          next[i2].isMatched = true;
          next[i2].isFlipped = true;
          setCards(next);

          setCorrectMatchesCount(c => c + 1);
          setRoundEarnings(e => e + 500);
          sound.playMatchSuccess();

          setActionAlert({
            text: `VIP Pass Auto-Matched ${next[i1].item.name}! (+₦500)`,
            type: 'success',
            id: Date.now()
          });

          // Check if cleared
          if (next.filter(c => !c.isMatched).length === 0) {
            if (isCampaign) handleSessionEnd(true);
          }
        }
      }

    } else if (boosterId === 'noWahala') {
      // Grant 3 shield charges
      setActiveShieldCharges(3);
      setActionAlert({
        text: 'No Wahala Shield Activated! 3 Mistakes Blocked.',
        type: 'success',
        id: Date.now()
      });
    }
  };

  // End session calculation
  const handleSessionEnd = (completedAllPairs: boolean) => {
    setIsPlaying(false);
    setIsFinished(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (trafficIntervalRef.current) clearInterval(trafficIntervalRef.current);
    if (marketIntervalRef.current) clearInterval(marketIntervalRef.current);

    if (isCampaign) {
      // Campaign Stage completion
      const cleared = completedAllPairs;
      setStageCleared(cleared);

      // Star calculation
      let stars = 0;
      if (cleared) {
        stars = 1;
        const score = roundEarnings;
        if (score >= activeStage.targetStarScore[1]) stars = 2;
        if (score >= activeStage.targetStarScore[2] || timeLeft > 15) stars = 3;
      }
      setStarsEarned(stars);

      const stageReward = cleared ? activeStage.completionNairaReward : 0;
      const totalNet = roundEarnings + stageReward;

      if (cleared) {
        sound.playCashout();
        onStageCompleted(activeStage.id, stars, stageReward);
      }

      onCreditWallet(totalNet, correctMatchesCount, wrongGuessesCount, stageReward, cleared ? 1 : 4);

    } else {
      // Classic 10-Minute Tournament calculation
      const sorted = [...players].sort((a, b) => b.score - a.score);
      const userRank = sorted.findIndex(p => p.isHuman) + 1;
      const positionPrize = (userRank === 1 || userRank === 2) ? 500 : 0;
      const finalNet = roundEarnings + positionPrize;

      if (positionPrize > 0) sound.playCashout();

      onCreditWallet(finalNet, correctMatchesCount, wrongGuessesCount, positionPrize, userRank);
    }
  };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const userCurrentRank = sortedPlayers.findIndex(p => p.isHuman) + 1;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
  };

  // Calculate dynamic grid column class
  const getGridColsClass = () => {
    if (!isCampaign) return 'grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6';
    if (activeStage.gridCols === 4) return 'grid-cols-4';
    if (activeStage.gridCols === 5) return 'grid-cols-4 sm:grid-cols-5';
    if (activeStage.gridCols === 6) return 'grid-cols-3 sm:grid-cols-6';
    return 'grid-cols-4 sm:grid-cols-6';
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">

      {/* Floating Action Feedback Banner */}
      {actionAlert && (
        <div 
          key={actionAlert.id}
          className={`fixed top-16 sm:top-20 right-3 sm:right-8 z-50 px-4 py-2 rounded-xl border shadow-xl flex items-center gap-2 backdrop-blur-md transition-all animate-bounce ${
            actionAlert.type === 'success' 
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200' 
              : actionAlert.type === 'penalty'
                ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
                : 'bg-indigo-950/95 border-indigo-500/50 text-indigo-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : actionAlert.type === 'penalty' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          )}
          <span className="font-semibold text-xs sm:text-sm">{actionAlert.text}</span>
        </div>
      )}

      {/* Top Game Controls / Mode Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur-md">
        
        <div className="flex items-center gap-2">
          {/* Active Mode Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-700/50">
            {isCampaign ? (
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
            )}
            <span className="font-display font-bold text-xs sm:text-sm text-white">
              {isCampaign ? activeStage.name : '10-Min Tournament Table'}
            </span>
            <span className="text-xs text-purple-400">·</span>
            <span className="text-[11px] text-purple-300 hidden sm:inline">
              {isCampaign ? `${activeStage.difficulty} Mode` : '1st & 2nd Prize ₦500'}
            </span>
          </div>

          {isCampaign && (
            <button
              onClick={onClearActiveStage}
              className="text-xs text-purple-300 hover:text-white underline underline-offset-2 ml-1"
            >
              Switch to Tournament
            </button>
          )}
        </div>

        {/* Theme and Stage Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenThemeSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-purple-900/40 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">Theme:</span>
            <span className="text-purple-300">{selectedTheme.culturalName}</span>
          </button>

          <button
            onClick={onOpenStageSelector}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 border border-purple-600/50 text-xs font-semibold text-white shadow-md transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Lagos Stage</span>
          </button>

          {!isPlaying && (
            <button
              onClick={startMatch}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start</span>
            </button>
          )}
        </div>
      </div>

      {/* Main HUD Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mb-4">
        
        {/* Timer */}
        <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
          timeLeft <= 15 && isPlaying 
            ? 'bg-rose-950/60 border-rose-600 animate-pulse' 
            : 'bg-zinc-950/80 border-purple-900/40 backdrop-blur'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-700/50 flex items-center justify-center shrink-0">
            <Clock className={`w-5 h-5 ${timeLeft <= 15 && isPlaying ? 'text-rose-400' : 'text-purple-300'}`} />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">Time Clock</span>
            <span className={`font-mono-numbers text-lg sm:text-xl font-bold ${timeLeft <= 15 && isPlaying ? 'text-rose-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Current Match Earnings */}
        <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-700/50 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-black text-base">₦</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">Match Earnings</span>
            <span className="font-mono-numbers text-lg sm:text-xl font-bold text-emerald-400">
              +₦{roundEarnings.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Combo & Match Stats */}
        <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center shrink-0">
            {comboStreak >= 2 ? (
              <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
            ) : (
              <Zap className="w-5 h-5 text-indigo-400" />
            )}
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400">
              {comboStreak >= 2 ? `${comboStreak}x Streak!` : 'Pairs / Fails'}
            </span>
            <div className="flex items-center gap-1.5 font-mono-numbers text-base sm:text-lg font-bold">
              <span className="text-emerald-400">+{correctMatchesCount}</span>
              <span className="text-slate-500">/</span>
              <span className="text-rose-400">-{wrongGuessesCount}</span>
            </div>
          </div>
        </div>

        {/* Environmental Mechanic Gauge OR Tournament Rank */}
        {isCampaign && activeStage.hasFuelGauge ? (
          /* Third Mainland Fuel Tank Meter */
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              fuelGauge <= 25 ? 'bg-rose-950 text-rose-400 border border-rose-600 animate-pulse' : 'bg-amber-950/60 text-amber-400 border border-amber-700/50'
            }`}>
              <Fuel className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400 uppercase">Engine Fuel</span>
                <span className="font-mono-numbers text-amber-300">{fuelGauge}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden mt-1 border border-zinc-800">
                <div 
                  className={`h-full transition-all duration-300 ${
                    fuelGauge <= 25 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                  }`} 
                  style={{ width: `${fuelGauge}%` }}
                />
              </div>
            </div>
          </div>
        ) : isCampaign && activeStage.hasTrafficReshuffle ? (
          /* Ojuelegba Traffic Reshuffle Clock */
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-950/60 border border-yellow-700/50 flex items-center justify-center shrink-0 text-yellow-400">
              <RotateCcw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Traffic Shift In</span>
              <span className="font-mono-numbers text-lg sm:text-xl font-bold text-yellow-300">
                {trafficCountdown}s
              </span>
            </div>
          </div>
        ) : (
          /* Classic Tournament Rank */
          <div className="p-3 rounded-2xl bg-zinc-950/80 border border-purple-900/40 backdrop-blur flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-700/50 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-slate-400">Standing</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono-numbers text-lg sm:text-xl font-bold text-amber-300">
                  {userCurrentRank}{userCurrentRank === 1 ? 'st' : userCurrentRank === 2 ? 'nd' : userCurrentRank === 3 ? 'rd' : 'th'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${userCurrentRank <= 2 ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-slate-400'}`}>
                  {userCurrentRank <= 2 ? '+₦500 Prize' : '₦0'}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* In-Game Power-Ups Booster Dock */}
      <div className="mb-4">
        <BoosterDock
          boosters={boosters}
          walletBalance={walletBalance}
          onUseBooster={handleActivateBooster}
          onBuyBooster={onBuyBooster}
          activeShieldCharges={activeShieldCharges}
          isFlashLightActive={isFlashLightActive}
          disabled={!isPlaying || isFinished}
        />
      </div>

      {/* Main Playing Cards Arena */}
      <div className="relative rounded-3xl bg-zinc-950/80 border border-purple-800/40 p-3 sm:p-6 backdrop-blur-md shadow-2xl min-h-[420px] flex flex-col justify-center">
        
        {!isPlaying && !isFinished ? (
          /* Pre-Game Lobby Card */
          <div className="py-8 px-4 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-900 p-1 shadow-2xl shadow-purple-900/60 mb-5 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-black/50 backdrop-blur flex items-center justify-center">
                <span className="font-display font-black text-white text-3xl">₦500</span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {isCampaign ? activeStage.name : '10-Minute Reaction Tournament'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-6 leading-relaxed">
              {isCampaign 
                ? activeStage.description 
                : 'Match identical rare species and Lagos icons. Win +₦500 for every match, lose ₦1 per mistake. 1st & 2nd position claim ₦500 directly into their bank account!'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={startMatch}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Start Challenge
              </button>
              <button
                onClick={onOpenStageSelector}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-purple-800/40 text-xs sm:text-sm font-semibold transition-all"
              >
                Browse Lagos Stages
              </button>
            </div>
          </div>
        ) : (
          /* Active Playing Grid */
          <div>
            <div className={`grid ${getGridColsClass()} gap-2.5 sm:gap-3.5`}>
              {cards.map((card, index) => {
                const isSelected = selectedCards.includes(index);
                const isRevealed = card.isFlipped || card.isMatched;
                const isObscured = obscuredCardIndices.includes(index);

                return (
                  <div
                    key={card.uid}
                    onClick={() => handleCardClick(index)}
                    className="relative aspect-[3/4] cursor-pointer perspective-1000 select-none group"
                  >
                    {/* Balogun Market Distraction Overlay */}
                    {isObscured && (
                      <div className="absolute inset-0 z-30 rounded-2xl bg-gradient-to-t from-amber-900/90 via-yellow-950/80 to-transparent backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center pointer-events-none animate-pulse border border-yellow-500/60">
                        <span className="text-2xl">⛱️</span>
                        <span className="text-[9px] font-bold text-yellow-300 mt-1 uppercase tracking-tight">
                          Market Banter!
                        </span>
                      </div>
                    )}

                    <div
                      className={`relative w-full h-full rounded-2xl transform-style-preserve-3d transition-transform duration-300 ease-out shadow-lg ${
                        isRevealed ? 'rotate-y-180' : ''
                      } ${
                        card.isMatched 
                          ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-black' 
                          : isSelected 
                            ? 'ring-2 ring-purple-400' 
                            : 'hover:scale-[1.02]'
                      }`}
                    >
                      {/* CARD BACK (FACED DOWNWARD) */}
                      <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden bg-gradient-to-br from-zinc-900 via-purple-950 to-black border-2 border-purple-800/60 flex flex-col items-center justify-between p-2.5 overflow-hidden shadow-xl">
                        
                        <div className="w-full flex justify-between items-center text-[10px] font-bold text-purple-400">
                          <span>₦</span>
                          <span>★</span>
                        </div>

                        {/* Center Pattern */}
                        <div className="relative flex flex-col items-center justify-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center shadow-inner group-hover:border-purple-400 transition-all">
                            <span className="font-display font-black text-white text-lg drop-shadow">
                              ₦
                            </span>
                          </div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-purple-300/80 mt-1">
                            {selectedTheme.culturalName}
                          </span>
                        </div>

                        <div className="w-full flex justify-between items-center text-[9px] font-bold text-purple-400">
                          <span>+₦500</span>
                          <span>-₦1</span>
                        </div>
                      </div>

                      {/* CARD FRONT (REVEALED ITEM) */}
                      <div className={`absolute inset-0 w-full h-full rounded-2xl backface-hidden rotate-y-180 bg-zinc-950 border-2 ${card.item.accentBorder} flex flex-col p-2 overflow-hidden shadow-2xl`}>
                        
                        {/* Image or Large Emoji Display */}
                        <div className={`relative w-full h-3/5 rounded-xl overflow-hidden bg-gradient-to-br ${card.item.accentBg} flex items-center justify-center`}>
                          {card.item.image ? (
                            <img
                              src={card.item.image}
                              alt={card.item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl sm:text-4xl filter drop-shadow">
                              {card.item.emoji}
                            </span>
                          )}

                          <div className="absolute top-1 right-1 px-1.5 py-0.2 rounded bg-black/75 backdrop-blur text-[8px] font-bold text-emerald-400">
                            +₦500
                          </div>
                        </div>

                        {/* Text info */}
                        <div className="flex-1 flex flex-col justify-between pt-1 text-center">
                          <div>
                            <h4 className="font-display font-bold text-[11px] sm:text-xs text-white truncate leading-tight">
                              {card.item.name}
                            </h4>
                            <span className="text-[9px] text-purple-300 truncate block">
                              {card.item.subtitle}
                            </span>
                          </div>

                          <span className="text-[8px] text-slate-400 truncate block">
                            {card.item.trivia}
                          </span>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom In-Match Controls */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-purple-900/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Rules: Correct = +₦500</span>
                <span aria-hidden="true">·</span>
                <span>Wrong = -₦1</span>
                {activeShieldCharges > 0 && (
                  <span className="text-emerald-400 font-semibold">
                    (Shield Active: {activeShieldCharges} left)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={startMatch}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-slate-300 text-xs font-medium transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart</span>
                </button>
                <button
                  onClick={() => handleSessionEnd(cards.filter(c => !c.isMatched).length === 0)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-colors"
                >
                  Finish & Tally
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* SUMMARY / STAGE CLEAR MODAL */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-purple-600/60 p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg mb-4 text-black">
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="font-display text-2xl font-extrabold text-white mb-1">
              {isCampaign 
                ? (stageCleared ? `${activeStage.name} Cleared!` : 'Stage Incomplete!') 
                : (userCurrentRank <= 2 ? `${userCurrentRank === 1 ? '1st' : '2nd'} Position Winner!` : 'Tournament Completed!')}
            </h3>

            {isCampaign && stageCleared && (
              <div className="flex items-center justify-center gap-1.5 my-3">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    className={`w-6 h-6 ${s <= starsEarned ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                  />
                ))}
              </div>
            )}

            <p className="text-slate-300 text-xs sm:text-sm mb-5">
              {isCampaign
                ? (stageCleared 
                    ? `Brilliant focus! You navigated ${activeStage.culturalLocation} and claimed your clearance Naira reward!` 
                    : `Time or fuel ran out! Use "NEPA Power On" or "No Wahala" booster on your next attempt.`)
                : (userCurrentRank <= 2 
                    ? 'Congratulations! You secured top tier and won the ₦500 position bonus directly to your real account!'
                    : 'Good hustle! You keep all card match earnings.')}
            </p>

            {/* Financial Ledger */}
            <div className="rounded-2xl bg-purple-950/40 border border-purple-800/40 p-4 mb-5 text-left space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span>Card Matches ({correctMatchesCount} × ₦500)</span>
                <span className="font-mono-numbers font-bold text-emerald-400">
                  +₦{(correctMatchesCount * 500).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Mistake Deductions ({wrongGuessesCount} × -₦1)</span>
                <span className="font-mono-numbers font-bold text-rose-400">
                  -₦{wrongGuessesCount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>{isCampaign ? 'Stage Clear Bounty' : 'Position Prize (1st & 2nd)'}</span>
                <span className="font-mono-numbers font-bold text-emerald-400">
                  +₦{(isCampaign ? (stageCleared ? activeStage.completionNairaReward : 0) : (userCurrentRank <= 2 ? 500 : 0)).toLocaleString()}
                </span>
              </div>

              <div className="border-t border-purple-800/50 pt-2 flex justify-between items-center font-bold text-sm sm:text-base">
                <span className="text-white">Net Credited to Real Wallet</span>
                <span className="font-mono-numbers text-emerald-400 text-lg">
                  ₦{(roundEarnings + (isCampaign ? (stageCleared ? activeStage.completionNairaReward : 0) : (userCurrentRank <= 2 ? 500 : 0))).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action buttons */}
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
                onClick={() => onShare(correctMatchesCount, roundEarnings)}
                className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-purple-800/40 font-semibold text-xs sm:text-sm transition-all"
              >
                Share Score
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
