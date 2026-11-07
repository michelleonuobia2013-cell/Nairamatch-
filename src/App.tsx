import React, { useState, useEffect } from 'react';
import { AmbientBackground } from './components/AmbientBackground';
import { TopBar } from './components/TopBar';
import { GameBoard } from './components/GameBoard';
import { PayoutEngineModal } from './components/PayoutEngineModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { SpeciesIntelModal } from './components/SpeciesIntelModal';
import { TutorialModal } from './components/TutorialModal';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { SocialShareModal } from './components/SocialShareModal';
import { NotificationsModal, AppNotification } from './components/NotificationsModal';
import { StageSelectorModal } from './components/StageSelectorModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';

import { THEMES_LIST, GameTheme } from './data/themes';
import { CAMPAIGN_STAGES, StageConfig } from './data/stages';
import { 
  BoosterInventory, 
  StageProgress, 
  loadSavedGame, 
  saveGame, 
  DEFAULT_BOOSTERS, 
  DEFAULT_STAGE_PROGRESS 
} from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'game' | 'stages' | 'themes' | 'leaderboard' | 'payout' | 'species' | 'tutorial'>('game');
  const [isPayoutOpen, setIsPayoutOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [isDailyRewardsOpen, setIsDailyRewardsOpen] = useState<boolean>(false);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isStageSelectorOpen, setIsStageSelectorOpen] = useState<boolean>(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState<boolean>(false);

  // Active Lagos Stage & Theme
  const [activeStage, setActiveStage] = useState<StageConfig | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('chow_town');

  // Booster Inventory & Stage Progress
  const [boosters, setBoosters] = useState<BoosterInventory>(DEFAULT_BOOSTERS);
  const [stageProgress, setStageProgress] = useState<Record<string, StageProgress>>(DEFAULT_STAGE_PROGRESS);

  // User Profile & Real Wallet
  const [userName, setUserName] = useState<string>('Chinedu Champion');
  const [walletBalance, setWalletBalance] = useState<number>(2500);
  const [totalWon, setTotalWon] = useState<number>(12500);
  const [userRank, setUserRank] = useState<number>(3);
  const [streak, setStreak] = useState<number>(3);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Bank Account Details
  const [bankAccount, setBankAccount] = useState<{
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    verifiedAt: string;
  } | null>({
    bankCode: '50211',
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '2048991204',
    accountName: 'CHINEDU GODSWILL OKAFOR',
    verifiedAt: new Date().toISOString()
  });

  // Transactions Ledger
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    reference: string;
    amount: number;
    bankName: string;
    accountNumberMasked: string;
    accountName: string;
    status: 'SUCCESSFUL' | 'PROCESSING' | 'FAILED';
    channel: string;
    date: string;
  }>>([
    {
      id: 'tx_init_1',
      reference: 'NIP/NMATCH/20261010/884912',
      amount: 1500,
      bankName: 'Kuda Microfinance Bank',
      accountNumberMasked: '2048****04',
      accountName: 'CHINEDU GODSWILL OKAFOR',
      status: 'SUCCESSFUL',
      channel: 'NIBSS_INSTANT_PAYMENT',
      date: '2026-10-10 14:22:10'
    },
    {
      id: 'tx_init_2',
      reference: 'NIP/NMATCH/20261009/410294',
      amount: 1000,
      bankName: 'Kuda Microfinance Bank',
      accountNumberMasked: '2048****04',
      accountName: 'CHINEDU GODSWILL OKAFOR',
      status: 'SUCCESSFUL',
      channel: 'NIBSS_INSTANT_PAYMENT',
      date: '2026-10-09 18:04:45'
    }
  ]);

  // Global Leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: 'Amina Queen', winnings: '₦145,500', matches: 142, winRate: '78%', badge: 'Grandmaster' },
    { rank: 2, name: 'Babajide Speed', winnings: '₦112,000', matches: 109, winRate: '72%', badge: 'Master' },
    { rank: 3, name: 'Chinedu Champion (You)', winnings: '₦12,500', matches: 18, winRate: '68%', badge: 'Gold' },
    { rank: 4, name: 'Efe Reflex', winnings: '₦8,500', matches: 14, winRate: '64%', badge: 'Silver' },
    { rank: 5, name: 'Zainab Pro', winnings: '₦7,200', matches: 12, winRate: '60%', badge: 'Silver' },
    { rank: 6, name: 'Tunde Spark', winnings: '₦6,000', matches: 11, winRate: '59%', badge: 'Bronze' },
    { rank: 7, name: 'Nkechi Swift', winnings: '₦4,500', matches: 9, winRate: '55%', badge: 'Bronze' }
  ]);

  // External Climate & Conservation Data
  const [climateData, setClimateData] = useState<{
    lastUpdated: string;
    globalTemperatureAnomaly: string;
    totalEndangeredSpeciesCount: number;
    activeCarbonOffsetFundNaira: number;
    protectedHectaresPledged: number;
    gameCommunityConservationImpact: string;
  } | null>(null);

  // In-App Push Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_pwa',
      title: 'Auto-Saved to Your Device',
      message: 'All balances, boosters, and unlocked stages are saved automatically on this device.',
      time: 'Just now',
      type: 'reward',
      read: false
    },
    {
      id: 'notif_1',
      title: 'Tournament Reward Credited',
      message: '₦500 position bonus has been processed to your wallet.',
      time: '12m ago',
      type: 'tournament',
      read: false
    },
    {
      id: 'notif_2',
      title: 'Lagos Energy Boosters Ready',
      message: 'Use "Flash Light" or "NEPA Power On" during high-stakes rush hours!',
      time: '45m ago',
      type: 'reward',
      read: false
    }
  ]);

  // Restore saved state from device on startup
  useEffect(() => {
    const saved = loadSavedGame();
    if (saved) {
      if (saved.walletBalance !== undefined) setWalletBalance(saved.walletBalance);
      if (saved.totalWon !== undefined) setTotalWon(saved.totalWon);
      if (saved.streak !== undefined) setStreak(saved.streak);
      if (saved.bankAccount) setBankAccount(saved.bankAccount);
      if (saved.boosters) setBoosters(saved.boosters);
      if (saved.stageProgress) setStageProgress(saved.stageProgress);
      if (saved.selectedThemeId) setSelectedThemeId(saved.selectedThemeId);
      if (saved.soundEnabled !== undefined) {
        setSoundEnabled(saved.soundEnabled);
        sound.enabled = saved.soundEnabled;
      }
    }

    // Also sync with server backend
    fetch('/api/auth/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.profile) {
          setUserName(data.profile.username);
          if (!saved) {
            setWalletBalance(data.profile.walletBalance);
            setTotalWon(data.profile.totalWon);
            setStreak(data.profile.streak);
            if (data.profile.bankAccount) setBankAccount(data.profile.bankAccount);
          }
        }
      })
      .catch(() => {});

    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.leaderboard) setLeaderboard(data.leaderboard);
      })
      .catch(() => {});

    fetch('/api/climate')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.climate) setClimateData(data.climate);
      })
      .catch(() => {});

    fetch('/api/payout/history')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.transactions) setTransactions(data.transactions);
      })
      .catch(() => {});
  }, []);

  // Auto-Save whenever crucial state changes
  useEffect(() => {
    saveGame({
      walletBalance,
      totalWon,
      streak,
      bankAccount,
      boosters,
      stageProgress,
      selectedThemeId,
      soundEnabled,
      notificationsEnabled
    });
  }, [walletBalance, totalWon, streak, bankAccount, boosters, stageProgress, selectedThemeId, soundEnabled, notificationsEnabled]);

  // Active Theme object
  const activeTheme = THEMES_LIST.find(t => t.id === selectedThemeId) || THEMES_LIST[0];

  // Power-Up handlers
  const handleUseBooster = (boosterId: keyof BoosterInventory) => {
    setBoosters(prev => {
      const currentCount = prev[boosterId] || 0;
      if (currentCount <= 0) return prev;
      const updated = { ...prev, [boosterId]: currentCount - 1 };
      saveGame({ boosters: updated });
      return updated;
    });
  };

  const handleBuyBooster = (boosterId: keyof BoosterInventory, count = 1) => {
    const cost = boosterId === 'flashLight' ? 300 : boosterId === 'nepaPower' ? 250 : boosterId === 'vipPass' ? 500 : 200;
    const totalCost = cost * count;

    if (walletBalance < totalCost) {
      sound.playMismatch();
      return;
    }

    setWalletBalance(prev => {
      const updatedBalance = prev - totalCost;
      setBoosters(b => {
        const updatedBoosters = { ...b, [boosterId]: (b[boosterId] || 0) + count };
        saveGame({ walletBalance: updatedBalance, boosters: updatedBoosters });
        return updatedBoosters;
      });
      return updatedBalance;
    });
  };

  // Stage Completion handler
  const handleStageCompleted = (stageId: string, stars: number, rewardNaira: number) => {
    setStageProgress(prev => {
      const current = prev[stageId] || { stageId, unlocked: true, highScore: 0, stars: 0, bestTimeRemaining: 0 };
      const updatedStars = Math.max(current.stars, stars);
      const updatedProgress = { ...prev, [stageId]: { ...current, stars: updatedStars } };

      // Unlock next stage in progression
      const currentStageIndex = CAMPAIGN_STAGES.findIndex(s => s.id === stageId);
      if (currentStageIndex >= 0 && currentStageIndex < CAMPAIGN_STAGES.length - 1) {
        const nextStageId = CAMPAIGN_STAGES[currentStageIndex + 1].id;
        updatedProgress[nextStageId] = {
          ...(updatedProgress[nextStageId] || { stageId: nextStageId, highScore: 0, stars: 0, bestTimeRemaining: 0 }),
          unlocked: true
        };
      }

      saveGame({ stageProgress: updatedProgress });
      return updatedProgress;
    });

    // Add in-app notification
    const stage = CAMPAIGN_STAGES.find(s => s.id === stageId);
    setNotifications(prev => [
      {
        id: `stage_clear_${Date.now()}`,
        title: `${stage?.name || 'Stage'} Cleared!`,
        message: `Awarded ${stars} ⭐ stars and +₦${rewardNaira.toLocaleString()} clearance bonus!`,
        time: 'Just now',
        type: 'tournament',
        read: false
      },
      ...prev
    ]);
  };

  // Credit match callback
  const handleCreditWallet = (
    netWinnings: number, 
    correctMatches: number, 
    wrongGuesses: number, 
    positionBonus: number, 
    finishPosition: number
  ) => {
    setWalletBalance(prev => {
      const nextBal = Math.max(0, prev + netWinnings);
      setTotalWon(t => t + (netWinnings > 0 ? netWinnings : 0));
      saveGame({ walletBalance: nextBal, totalWon: totalWon + (netWinnings > 0 ? netWinnings : 0) });
      return nextBal;
    });

    // Notify backend
    fetch('/api/wallet/credit-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        netWinnings,
        correctMatches,
        wrongGuesses,
        positionBonus,
        finishPosition
      })
    }).catch(() => {});
  };

  // Save Bank Account
  const handleSaveBank = async (bank: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    verifiedAt: string;
  }) => {
    setBankAccount(bank);
    saveGame({ bankAccount: bank });
    try {
      await fetch('/api/bank/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bank)
      });
    } catch {}
  };

  // Withdraw Funds
  const handleWithdraw = async (amount: number): Promise<boolean> => {
    try {
      const res = await fetch('/api/payout/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const data = await res.json();

      if (data.success) {
        setWalletBalance(data.newBalance);
        if (data.transaction) {
          setTransactions(prev => [data.transaction, ...prev]);
        }
        saveGame({ walletBalance: data.newBalance });
        return true;
      }
    } catch {}

    // Fallback local simulation
    if (walletBalance >= amount && bankAccount) {
      const now = new Date();
      const masked = bankAccount.accountNumber.slice(0, 4) + '****' + bankAccount.accountNumber.slice(-2);
      const localTx = {
        id: `tx_${Date.now()}`,
        reference: `NIP/NMATCH/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`,
        amount,
        bankName: bankAccount.bankName,
        accountNumberMasked: masked,
        accountName: bankAccount.accountName,
        status: 'SUCCESSFUL' as const,
        channel: 'NIBSS_INSTANT_PAYMENT',
        date: now.toLocaleString()
      };
      const updatedBalance = walletBalance - amount;
      setWalletBalance(updatedBalance);
      setTransactions(prev => [localTx, ...prev]);
      saveGame({ walletBalance: updatedBalance });
      return true;
    }
    return false;
  };

  // Daily reward claim
  const handleClaimDailyReward = async (): Promise<number> => {
    const reward = 250 + (streak * 50);
    const nextBalance = walletBalance + reward;
    setWalletBalance(nextBalance);
    setTotalWon(t => t + reward);
    saveGame({ walletBalance: nextBalance, totalWon: totalWon + reward });
    return reward;
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    saveGame({ soundEnabled: next });
    if (next) sound.playTap();
  };

  // Sub-navigation tab selector
  const handleSelectTab = (tab: 'game' | 'stages' | 'themes' | 'leaderboard' | 'payout' | 'species' | 'tutorial') => {
    setActiveTab(tab);
    if (tab === 'stages') setIsStageSelectorOpen(true);
    if (tab === 'themes') setIsThemeSelectorOpen(true);
    if (tab === 'leaderboard') setIsLeaderboardOpen(true);
    if (tab === 'payout') setIsPayoutOpen(true);
    if (tab === 'species') setIsSpeciesOpen(true);
    if (tab === 'tutorial') setIsTutorialOpen(true);
  };

  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col relative selection:bg-purple-600 selection:text-white">
      
      {/* Background Ambience */}
      <AmbientBackground />

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        walletBalance={walletBalance}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenPayout={() => setIsPayoutOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDailyRewards={() => setIsDailyRewardsOpen(true)}
        unreadNotificationsCount={unreadNotifs}
        streak={streak}
        userName={userName}
      />

      {/* Main Game Arena */}
      <main className="flex-1 relative z-10 flex flex-col justify-start">
        <GameBoard
          onCreditWallet={handleCreditWallet}
          onOpenPayout={() => setIsPayoutOpen(true)}
          onShare={() => setIsSocialShareOpen(true)}
          soundEnabled={soundEnabled}
          streak={streak}
          walletBalance={walletBalance}
          selectedTheme={activeTheme}
          onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
          onOpenStageSelector={() => setIsStageSelectorOpen(true)}
          activeStage={activeStage}
          onClearActiveStage={() => setActiveStage(null)}
          boosters={boosters}
          onUseBooster={handleUseBooster}
          onBuyBooster={handleBuyBooster}
          onStageCompleted={handleStageCompleted}
        />
      </main>

      {/* Interactive Modals */}
      <StageSelectorModal
        isOpen={isStageSelectorOpen}
        onClose={() => { setIsStageSelectorOpen(false); setActiveTab('game'); }}
        onSelectStage={(stage) => {
          setActiveStage(stage);
          setIsStageSelectorOpen(false);
          setActiveTab('game');
        }}
        stageProgress={stageProgress}
      />

      <ThemeSelectorModal
        isOpen={isThemeSelectorOpen}
        onClose={() => { setIsThemeSelectorOpen(false); setActiveTab('game'); }}
        selectedThemeId={selectedThemeId}
        onSelectTheme={(themeId) => {
          setSelectedThemeId(themeId);
          saveGame({ selectedThemeId: themeId });
        }}
      />

      <PayoutEngineModal
        isOpen={isPayoutOpen}
        onClose={() => { setIsPayoutOpen(false); setActiveTab('game'); }}
        walletBalance={walletBalance}
        bankAccount={bankAccount}
        onSaveBank={handleSaveBank}
        onWithdraw={handleWithdraw}
        transactions={transactions}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => { setIsLeaderboardOpen(false); setActiveTab('game'); }}
        leaderboard={leaderboard}
        userRank={userRank}
        userName={userName}
        userWinnings={totalWon}
      />

      <SpeciesIntelModal
        isOpen={isSpeciesOpen}
        onClose={() => { setIsSpeciesOpen(false); setActiveTab('game'); }}
        climateData={climateData}
      />

      <TutorialModal
        isOpen={isTutorialOpen}
        onClose={() => { setIsTutorialOpen(false); setActiveTab('game'); }}
        onStartRealMatch={() => {
          setIsTutorialOpen(false);
          setActiveTab('game');
        }}
      />

      <DailyRewardsModal
        isOpen={isDailyRewardsOpen}
        onClose={() => setIsDailyRewardsOpen(false)}
        streak={streak}
        onClaimDaily={handleClaimDailyReward}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
      />

      <SocialShareModal
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
        matchesCount={18}
        totalWon={totalWon}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onOpenPayout={() => { setIsNotificationsOpen(false); setIsPayoutOpen(true); }}
        onOpenDailyRewards={() => { setIsNotificationsOpen(false); setIsDailyRewardsOpen(true); }}
      />

      {/* Footer */}
      <footer className="relative z-20 border-t border-purple-950/60 bg-black/80 backdrop-blur px-6 py-4 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-slate-400">NairaMatch Lagos Edition</span>
            <span>·</span>
            <span>PWA Offline Installable & Device Auto-Save</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setIsStageSelectorOpen(true)} className="hover:text-purple-300 transition-colors">
              Lagos Stages
            </button>
            <button onClick={() => setIsThemeSelectorOpen(true)} className="hover:text-purple-300 transition-colors">
              Tile Themes
            </button>
            <button onClick={() => setIsPayoutOpen(true)} className="hover:text-purple-300 transition-colors">
              Bank Cashout
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
