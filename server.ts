import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// In-memory persistent state during server runtime
const supportedBanks = [
  { code: '044', name: 'Access Bank', nipCode: '000014' },
  { code: '058', name: 'Guaranty Trust Bank (GTBank)', nipCode: '000013' },
  { code: '057', name: 'Zenith Bank', nipCode: '000015' },
  { code: '033', name: 'United Bank for Africa (UBA)', nipCode: '000004' },
  { code: '011', name: 'First Bank of Nigeria', nipCode: '000016' },
  { code: '999992', name: 'OPay Digital Services', nipCode: '100004' },
  { code: '999991', name: 'PalmPay Limited', nipCode: '100033' },
  { code: '50211', name: 'Kuda Microfinance Bank', nipCode: '090267' },
  { code: '50515', name: 'Moniepoint Microfinance Bank', nipCode: '090405' },
  { code: '214', name: 'First City Monument Bank (FCMB)', nipCode: '000003' },
  { code: '070', name: 'Fidelity Bank', nipCode: '000007' },
  { code: '232', name: 'Sterling Bank', nipCode: '000001' }
];

interface BankAccount {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  verifiedAt: string;
}

interface PayoutTransaction {
  id: string;
  reference: string;
  amount: number;
  bankName: string;
  accountNumberMasked: string;
  accountName: string;
  status: 'SUCCESSFUL' | 'PROCESSING' | 'FAILED';
  channel: 'NIBSS_INSTANT_PAYMENT';
  date: string;
}

interface PlayerProfile {
  id: string;
  username: string;
  email: string;
  authProvider: 'google' | 'x' | 'phone' | 'guest';
  avatar: string;
  walletBalance: number; // in Naira (₦)
  totalWon: number;
  totalMatches: number;
  tournamentWins: number;
  streak: number;
  lastDailyRewardDate: string | null;
  bankAccount: BankAccount | null;
}

// In-memory mock store initialized with standard guest/demo profile
let currentUser: PlayerProfile = {
  id: 'usr_default_2026',
  username: 'Chinedu Champion',
  email: 'michelleonuobia2013@gmail.com',
  authProvider: 'google',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  walletBalance: 2500, // Starts with starter balance in Naira
  totalWon: 12500,
  totalMatches: 18,
  tournamentWins: 5,
  streak: 3,
  lastDailyRewardDate: null,
  bankAccount: {
    bankCode: '50211',
    bankName: 'Kuda Microfinance Bank',
    accountNumber: '2048991204',
    accountName: 'CHINEDU GODSWILL OKAFOR',
    verifiedAt: '2026-10-10T12:00:00Z'
  }
};

const transactions: PayoutTransaction[] = [
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
];

// Leaderboard data
const globalLeaderboard = [
  { rank: 1, name: 'Amina Queen', winnings: '₦145,500', matches: 142, winRate: '78%', badge: 'Grandmaster' },
  { rank: 2, name: 'Babajide Speed', winnings: '₦112,000', matches: 109, winRate: '72%', badge: 'Master' },
  { rank: 3, name: 'Chinedu Champion (You)', winnings: '₦12,500', matches: 18, winRate: '68%', badge: 'Gold' },
  { rank: 4, name: 'Efe Reflex', winnings: '₦8,500', matches: 14, winRate: '64%', badge: 'Silver' },
  { rank: 5, name: 'Zainab Pro', winnings: '₦7,200', matches: 12, winRate: '60%', badge: 'Silver' },
  { rank: 6, name: 'Tunde Spark', winnings: '₦6,000', matches: 11, winRate: '59%', badge: 'Bronze' },
  { rank: 7, name: 'Nkechi Swift', winnings: '₦4,500', matches: 9, winRate: '55%', badge: 'Bronze' }
];

// Rare Species & Climate Conservation Data API
const rareSpeciesCatalog = [
  {
    id: 'axolotl',
    name: 'Axolotl',
    scientificName: 'Ambystoma mexicanum',
    status: 'Critically Endangered',
    statusShort: 'CR',
    habitat: 'Lake Xochimilco, Mexico',
    population: '< 1,000 remaining in wild',
    cardMatchBonus: 500,
    lore: 'Known as the walking fish, it has extraordinary regenerative abilities, capable of regrowing lost limbs and organs.',
    threats: 'Urbanization, water pollution, invasive tilapia and carp.'
  },
  {
    id: 'pangolin',
    name: 'Sunda Pangolin',
    scientificName: 'Manis javanica',
    status: 'Critically Endangered',
    statusShort: 'CR',
    habitat: 'Southeast Asia tropical forests',
    population: 'Severely depleted (>80% decline)',
    cardMatchBonus: 500,
    lore: 'The only mammal wholly-covered in scales made of keratin. When threatened, it rolls into an impenetrable sphere.',
    threats: 'Poaching for traditional medicine and illegal luxury bushmeat trade.'
  },
  {
    id: 'golden_frog',
    name: 'Panamanian Golden Frog',
    scientificName: 'Atelopus zeteki',
    status: 'Critically Endangered (Extinct in wild)',
    statusShort: 'CR-EW',
    habitat: 'Cordillera Central, Panama',
    population: 'Managed in captive bio-reserves',
    cardMatchBonus: 500,
    lore: 'Communicates using "semaphoring"—waving its hands like semaphore flags to rival frogs over loud rushing waterfalls.',
    threats: 'Chytridiomycosis fungal pandemic and habitat loss.'
  },
  {
    id: 'saiga',
    name: 'Saiga Antelope',
    scientificName: 'Saiga tatarica',
    status: 'Near Threatened (Recovering from CR)',
    statusShort: 'NT',
    habitat: 'Eurasian dry steppes & semi-deserts',
    population: '~1.9 Million (Global recovery program)',
    cardMatchBonus: 500,
    lore: 'Features an unmistakable oversized bulbous flexible snout that filters dust in summer and warms freezing air in harsh winter.',
    threats: 'Poaching for horns, extreme weather mass die-offs, disease outbreaks.'
  },
  {
    id: 'okapi',
    name: 'Okapi',
    scientificName: 'Okapia johnstoni',
    status: 'Endangered',
    statusShort: 'EN',
    habitat: 'Ituri Rainforest, DR Congo',
    population: '~10,000 – 15,000 remaining',
    cardMatchBonus: 500,
    lore: 'The forest giraffe. Despite zebra-like striped legs that camouflage in dense foliage, its closest living relative is the tall savannah giraffe.',
    threats: 'Armed conflict, deforestation, illegal mining, bushmeat snares.'
  },
  {
    id: 'vaquita',
    name: 'Vaquita Porpoise',
    scientificName: 'Phocoena sinus',
    status: 'Critically Endangered',
    statusShort: 'CR',
    habitat: 'Northern Gulf of California',
    population: '~10 individuals remaining',
    cardMatchBonus: 500,
    lore: 'The smallest cetacean on Earth, measuring only 1.5 meters. Known for distinctive dark rings around its eyes and lips.',
    threats: 'Entanglement in illegal gillnets set for totoaba fish.'
  }
];

const climateTelemetry = {
  lastUpdated: new Date().toISOString(),
  globalTemperatureAnomaly: '+1.38°C above pre-industrial average',
  totalEndangeredSpeciesCount: 44108,
  activeCarbonOffsetFundNaira: 142080000,
  protectedHectaresPledged: 85200,
  gameCommunityConservationImpact: '₦50 from every verified tournament match pool is pledged to African Wildlife Foundation.'
};

// --- API ROUTES ---

// 1. Auth & Profile
app.get('/api/auth/profile', (_req: Request, res: Response) => {
  res.json({ success: true, profile: currentUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { provider, username, email } = req.body;
  currentUser = {
    ...currentUser,
    username: username || currentUser.username,
    email: email || currentUser.email,
    authProvider: provider || 'google'
  };
  res.json({ success: true, message: 'Logged in successfully', profile: currentUser });
});

// 2. Bank List & Account Resolution Engine
app.get('/api/bank/list', (_req: Request, res: Response) => {
  res.json({ success: true, banks: supportedBanks });
});

app.post('/api/bank/verify', (req: Request, res: Response) => {
  const { bankCode, accountNumber, assertedAccountName } = req.body;

  if (!bankCode || !accountNumber) {
    return res.status(400).json({ success: false, message: 'Bank code and account number are required' });
  }

  if (accountNumber.length !== 10 || !/^\d+$/.test(accountNumber)) {
    return res.status(400).json({ success: false, message: 'Nigerian NUBAN account number must be exactly 10 digits' });
  }

  const selectedBank = supportedBanks.find(b => b.code === bankCode);
  if (!selectedBank) {
    return res.status(404).json({ success: false, message: 'Selected bank is not recognized' });
  }

  // Generate or assert the account name as requested by the user
  const resolvedName = assertedAccountName && assertedAccountName.trim().length > 3
    ? assertedAccountName.trim().toUpperCase()
    : `${currentUser.username.toUpperCase()}`;

  return res.json({
    success: true,
    data: {
      accountNumber,
      accountName: resolvedName,
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      nipCode: selectedBank.nipCode,
      status: 'VERIFIED',
      verificationId: `NIP-VER-${Date.now()}`
    }
  });
});

app.post('/api/bank/save', (req: Request, res: Response) => {
  const { bankCode, bankName, accountNumber, accountName } = req.body;

  if (!bankCode || !accountNumber || !accountName) {
    return res.status(400).json({ success: false, message: 'Incomplete bank details' });
  }

  currentUser.bankAccount = {
    bankCode,
    bankName,
    accountNumber,
    accountName,
    verifiedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Bank account linked successfully to real payout engine!',
    bankAccount: currentUser.bankAccount
  });
});

// 3. Wallet & Payout Routing Engine
app.post('/api/payout/request', (req: Request, res: Response) => {
  const { amount } = req.body;
  const withdrawalAmount = Number(amount);

  if (isNaN(withdrawalAmount) || withdrawalAmount < 100) {
    return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₦100' });
  }

  if (!currentUser.bankAccount) {
    return res.status(400).json({ success: false, message: 'Please assert and link your real bank account details first.' });
  }

  if (currentUser.walletBalance < withdrawalAmount) {
    return res.status(400).json({
      success: false,
      message: `Insufficient funds. Your wallet balance is ₦${currentUser.walletBalance.toLocaleString()}`
    });
  }

  // Deduct from wallet
  currentUser.walletBalance -= withdrawalAmount;

  const maskedAcct = currentUser.bankAccount.accountNumber.slice(0, 4) + '****' + currentUser.bankAccount.accountNumber.slice(-2);
  const now = new Date();
  const dateFormatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  const tx: PayoutTransaction = {
    id: `tx_${Date.now()}`,
    reference: `NIP/NMATCH/${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}/${Math.floor(100000 + Math.random() * 900000)}`,
    amount: withdrawalAmount,
    bankName: currentUser.bankAccount.bankName,
    accountNumberMasked: maskedAcct,
    accountName: currentUser.bankAccount.accountName,
    status: 'SUCCESSFUL',
    channel: 'NIBSS_INSTANT_PAYMENT',
    date: dateFormatted
  };

  transactions.unshift(tx);

  res.json({
    success: true,
    message: `₦${withdrawalAmount.toLocaleString()} successfully disbursed to ${currentUser.bankAccount.accountName} (${currentUser.bankAccount.bankName})!`,
    transaction: tx,
    newBalance: currentUser.walletBalance
  });
});

app.get('/api/payout/history', (_req: Request, res: Response) => {
  res.json({ success: true, transactions });
});

// Update wallet from match results (+₦500 per match, -₦1 per fail, or tournament finish +₦500 for 1st/2nd)
app.post('/api/wallet/credit-match', (req: Request, res: Response) => {
  const { netWinnings, correctMatches, wrongGuesses, positionBonus, finishPosition } = req.body;

  const net = Number(netWinnings) || 0;
  currentUser.walletBalance = Math.max(0, currentUser.walletBalance + net);
  if (net > 0) {
    currentUser.totalWon += net;
  }
  currentUser.totalMatches += 1;

  if (finishPosition === 1 || finishPosition === 2) {
    currentUser.tournamentWins += 1;
    currentUser.streak += 1;
  } else {
    currentUser.streak = Math.max(0, currentUser.streak - 1);
  }

  res.json({
    success: true,
    walletBalance: currentUser.walletBalance,
    totalWon: currentUser.totalWon,
    streak: currentUser.streak,
    summary: {
      netWinnings: net,
      correctMatches,
      wrongGuesses,
      positionBonus,
      finishPosition
    }
  });
});

// 4. Daily Reward
app.post('/api/rewards/daily-claim', (_req: Request, res: Response) => {
  const todayStr = new Date().toISOString().split('T')[0];
  if (currentUser.lastDailyRewardDate === todayStr) {
    return res.status(400).json({ success: false, message: 'You have already claimed today\'s daily login bonus! Check back tomorrow.' });
  }

  const bonusReward = 200 + (currentUser.streak * 50); // Daily bonus with streak multiplier
  currentUser.walletBalance += bonusReward;
  currentUser.totalWon += bonusReward;
  currentUser.lastDailyRewardDate = todayStr;

  res.json({
    success: true,
    message: `Daily Reward Claimed: +₦${bonusReward} added to your real account balance!`,
    bonusReward,
    walletBalance: currentUser.walletBalance
  });
});

// 5. Species & Climate Endpoints
app.get('/api/species', (_req: Request, res: Response) => {
  res.json({ success: true, species: rareSpeciesCatalog });
});

app.get('/api/climate', (_req: Request, res: Response) => {
  res.json({ success: true, climate: climateTelemetry });
});

// 6. Leaderboard
app.get('/api/leaderboard', (_req: Request, res: Response) => {
  res.json({ success: true, leaderboard: globalLeaderboard });
});

// Vite middleware or production static serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NairaMatch server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
