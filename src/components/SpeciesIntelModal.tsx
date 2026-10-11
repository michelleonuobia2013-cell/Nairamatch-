import React, { useState } from 'react';
import { X, Globe2, ShieldAlert, Sparkles, Leaf, Info, Thermometer, ShieldCheck } from 'lucide-react';
import { SPECIES_LIST, RareSpecies } from '../data/species';
import { sound } from '../utils/audio';

interface ClimateTelemetry {
  lastUpdated: string;
  globalTemperatureAnomaly: string;
  totalEndangeredSpeciesCount: number;
  activeCarbonOffsetFundNaira: number;
  protectedHectaresPledged: number;
  gameCommunityConservationImpact: string;
}

interface SpeciesIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
  climateData?: ClimateTelemetry | null;
}

export const SpeciesIntelModal: React.FC<SpeciesIntelModalProps> = ({
  isOpen,
  onClose,
  climateData
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<RareSpecies>(SPECIES_LIST[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-zinc-950 border border-purple-800/60 shadow-2xl p-5 sm:p-7 relative my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-900 text-slate-400 hover:text-white hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Rare Species & Climate Conservation Telemetry
            </h2>
            <span className="text-xs text-purple-300">
              Live biodiversity intelligence & planetary habitat monitoring
            </span>
          </div>
        </div>

        {/* Climate Telemetry Header Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 shrink-0">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Global Temp Delta</span>
            <span className="font-mono-numbers text-xs sm:text-sm font-bold text-amber-400">
              {climateData?.globalTemperatureAnomaly || '+1.38°C Anomaly'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">IUCN Red List</span>
            <span className="font-mono-numbers text-xs sm:text-sm font-bold text-rose-400">
              {climateData?.totalEndangeredSpeciesCount?.toLocaleString() || '44,108'} Species
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Conservation Pool</span>
            <span className="font-mono-numbers text-xs sm:text-sm font-bold text-emerald-400">
              ₦{climateData?.activeCarbonOffsetFundNaira?.toLocaleString() || '142,080,000'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/40">
            <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider">Protected Habitat</span>
            <span className="font-mono-numbers text-xs sm:text-sm font-bold text-purple-300">
              {climateData?.protectedHectaresPledged?.toLocaleString() || '85,200'} Hectares
            </span>
          </div>
        </div>

        {/* Main Content: Split Master-Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
          
          {/* Left Species Selector Column */}
          <div className="md:col-span-5 space-y-2">
            <span className="block text-xs font-semibold text-slate-400 mb-1">
              Select Endangered Species Card:
            </span>
            {SPECIES_LIST.map((sp) => {
              const isSelected = sp.id === selectedSpecies.id;

              return (
                <button
                  key={sp.id}
                  onClick={() => { sound.playTap(); setSelectedSpecies(sp); }}
                  className={`w-full p-2.5 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    isSelected 
                      ? 'bg-purple-900/50 border-purple-500 shadow-md' 
                      : 'bg-zinc-900/60 border-purple-900/30 hover:border-purple-700/60'
                  }`}
                >
                  <img
                    src={sp.image}
                    alt={sp.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-purple-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                        {sp.name}
                      </h4>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono-numbers">
                        +₦500
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-300 italic truncate block">
                      {sp.scientificName}
                    </span>
                    <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.2 rounded ${sp.statusColor}`}>
                      {sp.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Selected Species Spotlight */}
          <div className="md:col-span-7 rounded-2xl bg-zinc-900/80 border border-purple-900/50 p-5 flex flex-col justify-between">
            <div>
              {/* Species Banner */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 border border-purple-700/40 shadow-lg">
                <img
                  src={selectedSpecies.image}
                  alt={selectedSpecies.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    Game Match Reward: +₦500
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                    {selectedSpecies.name}
                  </h3>
                  <span className="text-xs text-purple-200 italic">
                    {selectedSpecies.scientificName}
                  </span>
                </div>
              </div>

              {/* Bio & Conservation Facts */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                    Habitat & Range
                  </span>
                  <p className="text-slate-200 font-medium mt-0.5">
                    {selectedSpecies.habitat}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                    Estimated Wild Population
                  </span>
                  <p className="text-slate-200 font-medium mt-0.5">
                    {selectedSpecies.population}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                    Ecological Wonder
                  </span>
                  <p className="text-slate-300 text-xs mt-0.5 leading-relaxed">
                    {selectedSpecies.fact}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                    Critical Threats
                  </span>
                  <p className="text-slate-300 text-xs mt-0.5">
                    {selectedSpecies.threats}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Impact Note */}
            <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center gap-2 text-[11px] text-purple-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Playing NairaMatch directly contributes to rare species awareness and local conservation initiatives.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
