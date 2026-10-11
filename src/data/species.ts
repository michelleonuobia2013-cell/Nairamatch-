import axolotlImg from '../assets/images/species_axolotl_1791727951364.jpg';
import pangolinImg from '../assets/images/species_pangolin_1791727961507.jpg';
import goldenFrogImg from '../assets/images/species_golden_frog_1791727973183.jpg';
import saigaImg from '../assets/images/species_saiga_antelope_1791727983460.jpg';
import okapiImg from '../assets/images/species_okapi_1791727992805.jpg';

export interface RareSpecies {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  status: string;
  statusColor: string;
  habitat: string;
  population: string;
  threats: string;
  fact: string;
  matchValueNaira: number;
}

export const SPECIES_LIST: RareSpecies[] = [
  {
    id: 'axolotl',
    name: 'Mexican Axolotl',
    scientificName: 'Ambystoma mexicanum',
    image: axolotlImg,
    status: 'Critically Endangered',
    statusColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    habitat: 'Lake Xochimilco canal wetlands, Mexico',
    population: '< 1,000 in natural wild waters',
    threats: 'Urban wastewater runoff and predatory non-native carp.',
    fact: 'Axolotls possess near-mythical regenerative traits—they can regrow spine, heart, and limbs without scarring.',
    matchValueNaira: 500
  },
  {
    id: 'pangolin',
    name: 'Sunda Pangolin',
    scientificName: 'Manis javanica',
    image: pangolinImg,
    status: 'Critically Endangered',
    statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    habitat: 'Primary & secondary rainforests of Southeast Asia',
    population: 'Steep >80% collapse in 20 years',
    threats: 'Rampant illegal trafficking for luxury scales and bushmeat.',
    fact: 'The only true scaled mammal in existence; an adult consumes up to 70 million ants and termites per year.',
    matchValueNaira: 500
  },
  {
    id: 'golden_frog',
    name: 'Panamanian Golden Frog',
    scientificName: 'Atelopus zeteki',
    image: goldenFrogImg,
    status: 'Critically Endangered (Wild Extinct)',
    statusColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    habitat: 'Fast-flowing montane streams, Central Panama',
    population: 'Preserved exclusively in conservation facilities',
    threats: 'Fungal chytridiomycosis epidemic across amphibian clades.',
    fact: 'Because raging waterfalls drown out mating calls, this frog developed sign-language hand waves to communicate.',
    matchValueNaira: 500
  },
  {
    id: 'saiga',
    name: 'Saiga Antelope',
    scientificName: 'Saiga tatarica',
    image: saigaImg,
    status: 'Near Threatened (Recovering)',
    statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    habitat: 'Arid grasslands & steppes of Kazakhstan and Mongolia',
    population: 'Estimated ~1.9 million after conservation resurgence',
    threats: 'Unregulated horn trade and pasture fragmentation.',
    fact: 'Its bulbous trunk-like snout acts as a natural air filter and temperature regulator for extreme continental weather.',
    matchValueNaira: 500
  },
  {
    id: 'okapi',
    name: 'Congo Okapi',
    scientificName: 'Okapia johnstoni',
    image: okapiImg,
    status: 'Endangered',
    statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    habitat: 'Ituri rainforest canopy, Democratic Republic of Congo',
    population: '~10,000 – 15,000 individuals',
    threats: 'Deforestation, artisanal coltan mining camps, and wire snares.',
    fact: 'Known as the "ghost of the forest", it has an 18-inch bluish prehensile tongue long enough to clean its own eyelids.',
    matchValueNaira: 500
  }
];
