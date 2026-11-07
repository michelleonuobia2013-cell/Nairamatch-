export interface StageConfig {
  id: string;
  stageNumber: number;
  name: string;
  culturalLocation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  gridCols: number;
  gridRows: number;
  totalCards: number;
  pairCount: number;
  timeLimitSeconds: number;
  hasTrafficReshuffle: boolean; // Ojuelegba Rush
  trafficIntervalSeconds?: number;
  hasFuelGauge: boolean; // Third Mainland Sprint
  initialFuel?: number;
  hasMarketDistraction: boolean; // Balogun Market Hustle
  distractionIntervalSeconds?: number;
  description: string;
  mechanicSummary: string;
  targetStarScore: [number, number, number]; // threshold for 1, 2, 3 stars
  completionNairaReward: number;
}

export const CAMPAIGN_STAGES: StageConfig[] = [
  {
    id: 'stage_1',
    stageNumber: 1,
    name: 'Lekki Smooth Drive',
    culturalLocation: 'Lekki Phase 1 Corridor',
    difficulty: 'Easy',
    gridCols: 4,
    gridRows: 4,
    totalCards: 16,
    pairCount: 8,
    timeLimitSeconds: 60,
    hasTrafficReshuffle: false,
    hasFuelGauge: false,
    hasMarketDistraction: false,
    description: 'Cruising down Admiralty Way on a calm Sunday morning. Clear roads, zero traffic.',
    mechanicSummary: 'Standard matching with generous 60-second timer. Perfect warm-up to build speed streaks and earn starting Naira.',
    targetStarScore: [1000, 2500, 4000],
    completionNairaReward: 1000
  },
  {
    id: 'stage_2',
    stageNumber: 2,
    name: 'Ojuelegba Rush',
    culturalLocation: 'Ojuelegba Under-Bridge',
    difficulty: 'Medium',
    gridCols: 5,
    gridRows: 4,
    totalCards: 20,
    pairCount: 10,
    timeLimitSeconds: 55,
    hasTrafficReshuffle: true,
    trafficIntervalSeconds: 15,
    hasFuelGauge: false,
    hasMarketDistraction: false,
    description: 'Unpredictable lane switching under the bridge. Watch out for shifting yellow Danfos!',
    mechanicSummary: 'Moving Traffic: Every 15 seconds, unmatched cards reshuffle positions horizontally within their rows. Tests short-term spatial memory.',
    targetStarScore: [1500, 3500, 5000],
    completionNairaReward: 1500
  },
  {
    id: 'stage_3',
    stageNumber: 3,
    name: 'Third Mainland Sprint',
    culturalLocation: 'Third Mainland Lagoon Expressway',
    difficulty: 'Hard',
    gridCols: 6,
    gridRows: 4,
    totalCards: 24,
    pairCount: 12,
    timeLimitSeconds: 45,
    hasTrafficReshuffle: false,
    hasFuelGauge: true,
    initialFuel: 100,
    hasMarketDistraction: false,
    description: 'High-speed evening rush hour across the lagoon. Keep the engine fueled or get stranded!',
    mechanicSummary: 'Fuel Gauge: Clock ticks down with an active Fuel Tank. Incorrect matches drain -6% fuel. Correct matches refuel +10%!',
    targetStarScore: [2000, 4500, 6000],
    completionNairaReward: 2000
  },
  {
    id: 'stage_4',
    stageNumber: 4,
    name: 'Balogun Market Hustle',
    culturalLocation: 'Balogun Island Market',
    difficulty: 'Expert',
    gridCols: 6,
    gridRows: 5,
    totalCards: 30,
    pairCount: 15,
    timeLimitSeconds: 65,
    hasTrafficReshuffle: false,
    hasFuelGauge: false,
    hasMarketDistraction: true,
    distractionIntervalSeconds: 7,
    description: 'Vibrant shouting, colorful market awnings, and hawker trays in the heart of Lagos trade.',
    mechanicSummary: 'Market Banter & Obstructions: Colorful umbrellas and hawker trays temporarily obscure 2–3 cards at random intervals. Maintain sharp focus!',
    targetStarScore: [3000, 6000, 8500],
    completionNairaReward: 3000
  }
];

export interface BoosterConfig {
  id: 'flashLight' | 'nepaPower' | 'vipPass' | 'noWahala';
  culturalName: string;
  genericName: string;
  description: string;
  priceNaira: number;
  iconName: string;
  badgeBg: string;
}

export const BOOSTERS_CONFIG: Record<string, BoosterConfig> = {
  flashLight: {
    id: 'flashLight',
    culturalName: 'Flash Light',
    genericName: 'X-Ray Vision',
    description: 'Turns all cards face-up for 2.5 seconds so you can memorize all pairs at a glance.',
    priceNaira: 300,
    iconName: 'Eye',
    badgeBg: 'from-amber-600 to-yellow-600'
  },
  nepaPower: {
    id: 'nepaPower',
    culturalName: 'NEPA Power On',
    genericName: 'Time Extension',
    description: 'Up NEPA! Instantly injects +15 seconds to your remaining stage timer.',
    priceNaira: 250,
    iconName: 'Zap',
    badgeBg: 'from-blue-600 to-cyan-600'
  },
  vipPass: {
    id: 'vipPass',
    culturalName: 'VIP Pass',
    genericName: 'Auto-Match',
    description: 'Bypasses the queue and immediately finds and clears 1 matching pair from the board.',
    priceNaira: 500,
    iconName: 'Sparkles',
    badgeBg: 'from-purple-600 to-fuchsia-600'
  },
  noWahala: {
    id: 'noWahala',
    culturalName: 'No Wahala',
    genericName: 'Mistake Shield',
    description: 'Shields against combo loss, penalty deductions, and fuel drain for your next 3 mistakes.',
    priceNaira: 200,
    iconName: 'Shield',
    badgeBg: 'from-emerald-600 to-teal-600'
  }
};
