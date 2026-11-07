// LocalStorage persistence engine for Nairamatch

export interface BoosterInventory {
  flashLight: number; // "Flash Light" (X-Ray Vision)
  nepaPower: number;  // "NEPA Power On" (Time Extension +15s)
  vipPass: number;    // "VIP Pass" (Auto-Match one pair)
  noWahala: number;   // "No Wahala" (Mistake Shield 3 charges)
}

export interface StageProgress {
  stageId: string;
  unlocked: boolean;
  highScore: number;
  stars: number; // 0 to 3 stars
  bestTimeRemaining: number;
}

export interface SavedGameState {
  walletBalance: number;
  totalWon: number;
  streak: number;
  bankAccount: {
    bankCode: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    verifiedAt: string;
  } | null;
  boosters: BoosterInventory;
  stageProgress: Record<string, StageProgress>;
  selectedThemeId: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  lastDailyRewardDate: string | null;
}

const STORAGE_KEY = 'nairamatch_state_v2';

export const DEFAULT_STAGE_PROGRESS: Record<string, StageProgress> = {
  stage_1: {
    stageId: 'stage_1',
    unlocked: true,
    highScore: 0,
    stars: 0,
    bestTimeRemaining: 0
  },
  stage_2: {
    stageId: 'stage_2',
    unlocked: false,
    highScore: 0,
    stars: 0,
    bestTimeRemaining: 0
  },
  stage_3: {
    stageId: 'stage_3',
    unlocked: false,
    highScore: 0,
    stars: 0,
    bestTimeRemaining: 0
  },
  stage_4: {
    stageId: 'stage_4',
    unlocked: false,
    highScore: 0,
    stars: 0,
    bestTimeRemaining: 0
  }
};

export const DEFAULT_BOOSTERS: BoosterInventory = {
  flashLight: 2,
  nepaPower: 2,
  vipPass: 1,
  noWahala: 2
};

export const loadSavedGame = (): SavedGameState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      boosters: { ...DEFAULT_BOOSTERS, ...(parsed.boosters || {}) },
      stageProgress: { ...DEFAULT_STAGE_PROGRESS, ...(parsed.stageProgress || {}) }
    };
  } catch {
    return null;
  }
};

export const saveGame = (state: Partial<SavedGameState>): void => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadSavedGame() || {
      walletBalance: 2500,
      totalWon: 12500,
      streak: 3,
      bankAccount: null,
      boosters: DEFAULT_BOOSTERS,
      stageProgress: DEFAULT_STAGE_PROGRESS,
      selectedThemeId: 'chow_town',
      soundEnabled: true,
      notificationsEnabled: true,
      lastDailyRewardDate: null
    };

    const merged = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
};
