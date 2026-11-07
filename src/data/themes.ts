import { SPECIES_LIST } from './species';

export interface ThemeTileItem {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  trivia: string;
  image?: string;
  accentBg: string;
  accentBorder: string;
}

export interface GameTheme {
  id: 'chow_town' | 'vibe_check' | 'gidi_landmarks' | 'rare_species';
  name: string;
  culturalName: string;
  description: string;
  soundType: 'sizzle' | 'afrobeat' | 'danfo' | 'standard';
  badgeColor: string;
  items: ThemeTileItem[];
}

export const THEMES_LIST: GameTheme[] = [
  {
    id: 'chow_town',
    name: 'Street Food & Delicacies',
    culturalName: 'Chow Town',
    description: 'Iconic Lagos street grills, smoky party jollof, and sweet delicacies.',
    soundType: 'sizzle',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    items: [
      {
        id: 'jollof',
        name: 'Party Jollof Pot',
        subtitle: 'Smoky Firewood Jollof',
        emoji: '🥘',
        trivia: 'The golden bottom burn ("bottom pot") is considered the most treasured bite in Lagos parties.',
        accentBg: 'from-orange-950 via-amber-950 to-black',
        accentBorder: 'border-orange-500/50'
      },
      {
        id: 'suya',
        name: 'Suya Skewer',
        subtitle: 'Yaji-Spiced Beef',
        emoji: '🍢',
        trivia: 'Cooked on open mesh charcoal grills, coated with crushed kuli-kuli peanuts and fiery yaji pepper.',
        accentBg: 'from-red-950 via-amber-950 to-black',
        accentBorder: 'border-red-500/50'
      },
      {
        id: 'dodo',
        name: 'Fried Dodo',
        subtitle: 'Golden Ripe Plantain',
        emoji: '🍌',
        trivia: 'Cut diagonally and deep-fried till golden caramel; pairs with eggs, stew, or eaten solo as a snack.',
        accentBg: 'from-yellow-950 via-amber-950 to-black',
        accentBorder: 'border-yellow-500/50'
      },
      {
        id: 'puffpuff',
        name: 'Puff-Puff',
        subtitle: 'Sweet Yeast Dumplings',
        emoji: '🥯',
        trivia: 'Spongy, sweet fried dough balls with nutmeg essence, scooped deftly by street vendors.',
        accentBg: 'from-amber-950 via-yellow-950 to-black',
        accentBorder: 'border-amber-500/50'
      },
      {
        id: 'meatpie',
        name: 'Lagos Meatpie',
        subtitle: 'Flaky Golden Pastry',
        emoji: '🥟',
        trivia: 'Stuffed with minced beef, potatoes, and carrots. A midday fuel staple across busy Lagos offices.',
        accentBg: 'from-amber-950 via-stone-950 to-black',
        accentBorder: 'border-amber-400/50'
      },
      {
        id: 'zobo',
        name: 'Cold Zobo Bottle',
        subtitle: 'Chilled Hibiscus Brew',
        emoji: '🍷',
        trivia: 'Brewed from dried roselle calyces infused with ginger, cloves, and pineapple skins for sweet zest.',
        accentBg: 'from-rose-950 via-purple-950 to-black',
        accentBorder: 'border-rose-500/50'
      },
      {
        id: 'corn_ube',
        name: 'Roasted Corn & Ube',
        subtitle: 'Charcoal Street Combo',
        emoji: '🌽',
        trivia: 'Freshly roasted sweet corn paired with buttery purple bush pear (ube), typical rainy season fuel.',
        accentBg: 'from-emerald-950 via-yellow-950 to-black',
        accentBorder: 'border-emerald-500/50'
      },
      {
        id: 'akara',
        name: 'Hot Akara',
        subtitle: 'Fried Bean Cakes',
        emoji: '🧆',
        trivia: 'Whipped black-eyed pea puree fried light and airy; the ultimate Saturday morning breakfast with agege bread.',
        accentBg: 'from-amber-950 via-orange-950 to-black',
        accentBorder: 'border-orange-400/50'
      },
      {
        id: 'shawarma',
        name: 'Lagos Shawarma',
        subtitle: 'Extra Sausage Wrap',
        emoji: '🌯',
        trivia: 'Famous for the Nigerian touch: sweet cream dressing and two full grilled sausages wrapped tightly inside.',
        accentBg: 'from-stone-950 via-amber-950 to-black',
        accentBorder: 'border-stone-400/50'
      },
      {
        id: 'asun',
        name: 'Spicy Asun',
        subtitle: 'Peppered Goat Meat',
        emoji: '🍖',
        trivia: 'Flame-roasted goat meat diced and tossed in charred scotch bonnet habaneros and diced onions.',
        accentBg: 'from-red-950 via-stone-950 to-black',
        accentBorder: 'border-red-600/50'
      },
      {
        id: 'kilishi',
        name: 'Crispy Kilishi',
        subtitle: 'Sun-Dried Beef Jerky',
        emoji: '🥓',
        trivia: 'Thin sheet jerky infused with peanut paste, dried in the sun, and flash-roasted on mesh wire.',
        accentBg: 'from-amber-950 via-red-950 to-black',
        accentBorder: 'border-amber-600/50'
      },
      {
        id: 'boli',
        name: 'Roasted Boli',
        subtitle: 'Grilled Plantain & Groundnut',
        emoji: '🥖',
        trivia: 'Charcoal-grilled semi-ripe plantain paired with crunchy roasted groundnuts or pepper sauce.',
        accentBg: 'from-yellow-950 via-amber-950 to-black',
        accentBorder: 'border-yellow-600/50'
      },
      {
        id: 'chin_chin',
        name: 'Crispy Chin-Chin',
        subtitle: 'Crunchy Fried Dough',
        emoji: '🥨',
        trivia: 'Diced pastry cubes deep fried crunchy with cinnamon, nutmeg, and butter.',
        accentBg: 'from-amber-950 via-orange-950 to-black',
        accentBorder: 'border-amber-500/50'
      },
      {
        id: 'agege_bread',
        name: 'Agege Bread',
        subtitle: 'Dense Stretchy Loaf',
        emoji: '🍞',
        trivia: 'Famous soft, chewy bread baked without yeast preservative, perfect for tearing and dipping into spicy beans.',
        accentBg: 'from-stone-950 via-amber-950 to-black',
        accentBorder: 'border-yellow-400/50'
      },
      {
        id: 'fura_dano',
        name: 'Fura da Nono',
        subtitle: 'Millet Milk Delight',
        emoji: '🥛',
        trivia: 'Spiced millet dough balls mashed inside creamy fermented milk, sweetened to taste.',
        accentBg: 'from-blue-950 via-stone-950 to-black',
        accentBorder: 'border-blue-400/50'
      }
    ]
  },
  {
    id: 'vibe_check',
    name: 'Afrobeats & Lagos Nightlife',
    culturalName: 'Vibe Check',
    description: 'Electric soundscapes, DJ decks, concert lights, and infectious Afro-fusion rhythms.',
    soundType: 'afrobeat',
    badgeColor: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30',
    items: [
      {
        id: 'vinyl',
        name: 'Vintage Vinyl',
        subtitle: 'Fela Afrobeat Classic',
        emoji: '📻',
        trivia: 'The spinning heartbeat of Lagos groove since the 1970s Shrine sessions.',
        accentBg: 'from-purple-950 via-indigo-950 to-black',
        accentBorder: 'border-purple-500/50'
      },
      {
        id: 'studio_mic',
        name: 'Studio Mic',
        subtitle: 'Hitmaker Vocals',
        emoji: '🎙️',
        trivia: 'Where global anthems by Burna, Wizkid, and Asake are voiced into reality.',
        accentBg: 'from-fuchsia-950 via-purple-950 to-black',
        accentBorder: 'border-fuchsia-500/50'
      },
      {
        id: 'saxophone',
        name: 'Brass Saxophone',
        subtitle: 'Afro-Jazz Horns',
        emoji: '🎷',
        trivia: 'Lead brass melody that drives iconic Afrobeat arrangements and highlife swing.',
        accentBg: 'from-amber-950 via-yellow-950 to-black',
        accentBorder: 'border-amber-500/50'
      },
      {
        id: 'stage_lights',
        name: 'Concert Lasers',
        subtitle: 'Eko Hotel Stage',
        emoji: '💡',
        trivia: 'Beams pulsating to 110 BPM log drums during December concert rushes.',
        accentBg: 'from-cyan-950 via-blue-950 to-black',
        accentBorder: 'border-cyan-500/50'
      },
      {
        id: 'dj_turntables',
        name: 'DJ Turntables',
        subtitle: 'Club Mashup Controller',
        emoji: '🎛️',
        trivia: 'Lagos DJs command the dancefloor with live hype-man whistles and amapiano transitions.',
        accentBg: 'from-indigo-950 via-purple-950 to-black',
        accentBorder: 'border-indigo-500/50'
      },
      {
        id: 'vip_wristband',
        name: 'VIP Wristband',
        subtitle: 'Front Row Access',
        emoji: '🎫',
        trivia: 'The coveted wristband for all-night festive December raves in Victoria Island.',
        accentBg: 'from-emerald-950 via-teal-950 to-black',
        accentBorder: 'border-emerald-500/50'
      },
      {
        id: 'headphones',
        name: 'Wireless Studio Beats',
        subtitle: 'Noise-Cancelling Can',
        emoji: '🎧',
        trivia: 'Crucial accessory for commuter survival on congested Lagos highways.',
        accentBg: 'from-violet-950 via-purple-950 to-black',
        accentBorder: 'border-violet-500/50'
      },
      {
        id: 'talking_drum',
        name: 'Talking Drum (Gangan)',
        subtitle: 'Yoruba Percussion',
        emoji: '🪘',
        trivia: 'Squeezed beneath the arm to mimic tones and pitches of human Yoruba speech.',
        accentBg: 'from-amber-950 via-orange-950 to-black',
        accentBorder: 'border-amber-400/50'
      },
      {
        id: 'shekere',
        name: 'Beaded Shekere',
        subtitle: 'Rhythmic Shaker',
        emoji: '🪇',
        trivia: 'Gourd wrapped in a woven net of cowrie shells or beads, providing crisp polyrhythms.',
        accentBg: 'from-yellow-950 via-amber-950 to-black',
        accentBorder: 'border-yellow-500/50'
      },
      {
        id: 'amplifier',
        name: 'Club Stack Amp',
        subtitle: 'Heavy Bass Subwoofer',
        emoji: '🔊',
        trivia: 'Rattles car windows across Admiralty Way when the clock strikes midnight.',
        accentBg: 'from-stone-950 via-purple-950 to-black',
        accentBorder: 'border-purple-400/50'
      },
      {
        id: 'hype_whistle',
        name: 'Hype Man Whistle',
        subtitle: 'Crowd Energizer',
        emoji: '🎺',
        trivia: 'Piercing stadium whistle that cues the bass drop and gets party crowds bouncing.',
        accentBg: 'from-teal-950 via-emerald-950 to-black',
        accentBorder: 'border-teal-400/50'
      },
      {
        id: 'sunglasses',
        name: 'Nocturnal Shades',
        subtitle: 'Club Steeze Eyewear',
        emoji: '🕶️',
        trivia: 'Worn inside dark Lagos clubs as standard "steeze" and personal flair.',
        accentBg: 'from-neutral-950 via-stone-950 to-black',
        accentBorder: 'border-neutral-400/50'
      },
      {
        id: 'disco_ball',
        name: 'Mirror Disco Ball',
        subtitle: 'Retro Lounge Sparkle',
        emoji: '🪩',
        trivia: 'Spinning above rooftop lounges overlooking the Atlantic coastline.',
        accentBg: 'from-slate-950 via-purple-950 to-black',
        accentBorder: 'border-slate-400/50'
      },
      {
        id: 'boombox',
        name: 'Street Boombox',
        subtitle: 'Block Party Sound',
        emoji: '📻',
        trivia: 'Portable sound system for spontaneous neighborhood block parties.',
        accentBg: 'from-purple-950 via-pink-950 to-black',
        accentBorder: 'border-pink-500/50'
      },
      {
        id: 'sparkler',
        name: 'Champagne Sparkler',
        subtitle: 'Nightclub Train',
        emoji: '✨',
        trivia: 'Illuminates bottle processions marching across Lagos VIP lounges.',
        accentBg: 'from-amber-950 via-yellow-950 to-black',
        accentBorder: 'border-amber-300/50'
      }
    ]
  },
  {
    id: 'gidi_landmarks',
    name: 'Lagos Transit & City Landmarks',
    culturalName: 'Gidi Landmarks',
    description: 'Iconic yellow buses, iconic suspension bridges, and bustling street icons.',
    soundType: 'danfo',
    badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    items: [
      {
        id: 'danfo',
        name: 'Yellow Danfo Bus',
        subtitle: 'Lagos City Cruiser',
        emoji: '🚌',
        trivia: 'The legendary yellow and black-striped Volkswagen bus that keeps Lagos moving 24/7.',
        accentBg: 'from-yellow-950 via-amber-950 to-black',
        accentBorder: 'border-yellow-400/50'
      },
      {
        id: 'keke',
        name: 'Keke Napep',
        subtitle: 'Tricycle Commuter',
        emoji: '🛺',
        trivia: 'Three-wheeled green or yellow auto-rickshaw adept at slicing through tight street traffic.',
        accentBg: 'from-emerald-950 via-yellow-950 to-black',
        accentBorder: 'border-emerald-400/50'
      },
      {
        id: 'lekki_bridge',
        name: 'Lekki-Ikoyi Bridge',
        subtitle: 'Cable Suspension Marvel',
        emoji: '🌉',
        trivia: 'The premier cable-stayed bridge in West Africa; popular running and fitness landmark.',
        accentBg: 'from-blue-950 via-indigo-950 to-black',
        accentBorder: 'border-blue-400/50'
      },
      {
        id: 'national_theatre',
        name: 'National Arts Theatre',
        subtitle: 'Military Cap Monument',
        emoji: '🏛️',
        trivia: 'Shaped like a general\'s military cap, built in Iganmu for the historic FESTAC \'77 festival.',
        accentBg: 'from-purple-950 via-stone-950 to-black',
        accentBorder: 'border-purple-400/50'
      },
      {
        id: 'eyo_statue',
        name: 'Eyo Masquerade Statue',
        subtitle: 'White Adimu Staff',
        emoji: '🎭',
        trivia: 'Towering white-robed statue greeting travelers arriving through Idumota and CMS.',
        accentBg: 'from-slate-950 via-zinc-950 to-black',
        accentBorder: 'border-slate-300/50'
      },
      {
        id: 'traffic_warden',
        name: 'Yellow Fever Warden',
        subtitle: 'Traffic Commander',
        emoji: '👮',
        trivia: 'Directing crazy Lagos roundabouts with theatrical hand choreography and sharp whistles.',
        accentBg: 'from-yellow-950 via-orange-950 to-black',
        accentBorder: 'border-yellow-500/50'
      },
      {
        id: 'train',
        name: 'Red Line Light Rail',
        subtitle: 'Modern Metro Rail',
        emoji: '🚆',
        trivia: 'Sleek intra-city train running across mainland corridors to bypass road bottlenecks.',
        accentBg: 'from-red-950 via-blue-950 to-black',
        accentBorder: 'border-red-400/50'
      },
      {
        id: 'third_mainland',
        name: 'Third Mainland Bridge',
        subtitle: '11.8km Lagoon Highway',
        emoji: '🛣️',
        trivia: 'One of the longest bridges in Africa, connecting Lagos Island to the Mainland across the lagoon.',
        accentBg: 'from-teal-950 via-blue-950 to-black',
        accentBorder: 'border-teal-400/50'
      },
      {
        id: 'brt_bus',
        name: 'Blue BRT Bus',
        subtitle: 'Dedicated Transit Lane',
        emoji: '🚎',
        trivia: 'High-capacity blue buses cruising along barricaded corridors free of typical gridlock.',
        accentBg: 'from-blue-950 via-cyan-950 to-black',
        accentBorder: 'border-blue-500/50'
      },
      {
        id: 'ferry',
        name: 'Lagferry Boat',
        subtitle: 'Lagoon Water Taxi',
        emoji: '⛴️',
        trivia: 'Passenger catamarans sailing between Ikorodu, Marina, and Falomo avoiding highway traffic.',
        accentBg: 'from-cyan-950 via-blue-950 to-black',
        accentBorder: 'border-cyan-400/50'
      },
      {
        id: 'marina_clock',
        name: 'Marina Waterfront',
        subtitle: 'Financial District Tower',
        emoji: '🏙️',
        trivia: 'Lined with high-rise banking headquarters overlooking the historic colonial harbor.',
        accentBg: 'from-indigo-950 via-slate-950 to-black',
        accentBorder: 'border-indigo-400/50'
      },
      {
        id: 'fela_shrine',
        name: 'New Afrika Shrine',
        subtitle: 'Afrobeat Sanctuary',
        emoji: '🎪',
        trivia: 'Cultural open-air temple in Ikeja where Femi and Seun Kuti perform historic sets.',
        accentBg: 'from-orange-950 via-red-950 to-black',
        accentBorder: 'border-orange-500/50'
      },
      {
        id: 'idumota_clock',
        name: 'Idumota Market Clock',
        subtitle: 'Historic Trade Center',
        emoji: '⏰',
        trivia: 'The pulse of commerce in Lagos Island, bustling with textile and spice traders.',
        accentBg: 'from-amber-950 via-stone-950 to-black',
        accentBorder: 'border-amber-400/50'
      },
      {
        id: 'tarkwa_bay',
        name: 'Tarkwa Bay Beach',
        subtitle: 'Island Surf Haven',
        emoji: '🏖️',
        trivia: 'Sheltered beach accessible only by watercraft, favored by swimmers and surfers.',
        accentBg: 'from-yellow-950 via-teal-950 to-black',
        accentBorder: 'border-yellow-400/50'
      },
      {
        id: 'okada',
        name: 'Commercial Bike (Okada)',
        subtitle: 'Bypass Express',
        emoji: '🏍️',
        trivia: 'Two-wheeled express bikes famous for squeezing through narrow gaps during rush hour.',
        accentBg: 'from-red-950 via-amber-950 to-black',
        accentBorder: 'border-red-400/50'
      }
    ]
  },
  {
    id: 'rare_species',
    name: 'Cosmic Rare Species',
    culturalName: 'Wildlife Guardians',
    description: 'Bioluminescent endangered wildlife from around the globe.',
    soundType: 'standard',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    items: SPECIES_LIST.map(sp => ({
      id: sp.id,
      name: sp.name,
      subtitle: sp.scientificName,
      emoji: '🦎',
      trivia: sp.fact,
      image: sp.image,
      accentBg: 'from-purple-950 via-zinc-950 to-black',
      accentBorder: 'border-purple-500/50'
    }))
  }
];
