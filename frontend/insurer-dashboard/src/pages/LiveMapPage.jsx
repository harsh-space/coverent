import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';

// Topological abstract nodes for map view
const ZONES = [
  { id: "delhi-ncr", name: "Delhi NCR", pin: "110001", x: 30, y: 30, riders: 4250, risk: "CRITICAL" },
  { id: "mumbai-andheri", name: "Andheri West", pin: "400053", x: 70, y: 60, riders: 3120, risk: "MODERATE" },
  { id: "blr-mg", name: "MG Road (BLR)", pin: "560001", x: 50, y: 80, riders: 2890, risk: "LOW" },
  { id: "chennai-parrys", name: "Parrys", pin: "600001", x: 65, y: 90, riders: 1540, risk: "LOW" },
  { id: "kolkata-bbd", name: "BBD Bagh", pin: "700001", x: 85, y: 45, riders: 2100, risk: "MODERATE" },
  { id: "gurgaon", name: "Gurgaon", pin: "122018", x: 25, y: 35, riders: 1850, risk: "HIGH" },
  { id: "pune-camp", name: "Pune Camp", pin: "411001", x: 60, y: 65, riders: 1100, risk: "LOW" },
];

export default function LiveMapPage() {
  const { triggers } = useDashboard();
  const [activeZone, setActiveZone] = useState(ZONES[0]);

  // Combine live trigger data with static map zones
  const mappedZones = ZONES.map(zone => {
    const activeTrigger = triggers.find(t => t.zone.includes(zone.pin) && t.status === "TRIGGERED");
    return {
      ...zone,
      isTriggered: !!activeTrigger,
      triggerType: activeTrigger ? activeTrigger.trigger : null,
      value: activeTrigger ? activeTrigger.value : null
    };
  });

  return (
    <div className="flex flex-col gap-8 pb-10 font-sans text-ui-black animate-fade-in w-full px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Live Trigger Map</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Topological Event Overlays</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map Container */}
        <div className="lg:w-2/3 glass-card p-6 h-[600px] flex flex-col relative overflow-hidden bg-ui-white/50">
          <div className="flex justify-between items-center mb-6 z-10 relative">
            <h3 className="font-black tracking-tight text-xl">National Grid</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-red animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Active Disruption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-status-green"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Clear</span>
              </div>
            </div>
          </div>

          {/* Stylized Topology Map */}
          <div className="flex-1 relative z-10 w-full h-full bg-transparent border-2 border-ui-gray-light/30 rounded-xl overflow-hidden mt-2 p-4 bg-[#fafafa]">

            {/* Stylized Grid Background & Abstract Map Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                {/* Detailed radar grid */}
                <defs>
                  <pattern id="radarGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="4 4" />
                    <rect x="0" y="0" width="60" height="60" fill="none" stroke="#e4e4e7" strokeWidth="0.5" />
                    <circle cx="0" cy="0" r="2" fill="#a1a1aa" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#radarGrid)" />
              </svg>
            </div>

            {mappedZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => setActiveZone(zone)}
                className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeZone.id === zone.id ? 'ring-4 ring-brand-yellow/50 scale-125' : 'hover:scale-110'}`}>
                  {zone.isTriggered ? (
                    <>
                      <div className="absolute w-12 h-12 bg-status-red/30 rounded-full animate-ping"></div>
                      <div className="relative w-full h-full bg-status-red rounded-full shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-ui-black rounded-full border-2 border-ui-white shadow-md"></div>
                  )}
                </div>
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-lg text-xs font-black whitespace-nowrap transition-all ${activeZone.id === zone.id ? 'opacity-100 bg-ui-black text-ui-white' : 'opacity-0 group-hover:opacity-100 bg-ui-white text-ui-black border border-ui-gray-light shadow-sm'}`}>
                  {zone.name}
                </div>
              </div>
            ))}

            {/* Fake connectivity lines between major nodes */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ opacity: 0.15 }}>
              <path d="M 30% 30% L 25% 35% L 70% 60% L 60% 65% L 50% 80% L 65% 90%" fill="none" stroke="#18181b" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 30% 30% L 85% 45% L 70% 60%" fill="none" stroke="#18181b" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        {/* Zone Details Panel */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="glass-card p-6 flex-1 bg-ui-white">
            <div className="mb-6 pb-6 border-b border-ui-gray-light">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{activeZone.name}</h3>
                  <p className="text-sm font-bold text-ui-gray-dark tracking-wide">PIN: {activeZone.pin}</p>
                </div>
                {mappedZones.find(z => z.id === activeZone.id)?.isTriggered ? (
                  <span className="bg-status-red text-ui-white text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-lg animate-pulse">
                    Disrupted
                  </span>
                ) : (
                  <span className="bg-status-green/20 text-status-green text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-lg">
                    Operational
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase text-ui-gray-dark tracking-widest mb-1.5">Active Riders (Pool)</p>
                <p className="text-3xl font-black tracking-tighter">{activeZone.riders.toLocaleString()}</p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase text-ui-gray-dark tracking-widest mb-1.5">Historical Risk Level</p>
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${activeZone.risk === 'CRITICAL' ? 'bg-status-red/10 text-status-red' :
                    activeZone.risk === 'HIGH' ? 'bg-status-orange/10 text-status-orange' :
                      'bg-status-green/10 text-status-green'
                  }`}>
                  {activeZone.risk}
                </span>
              </div>

              {mappedZones.find(z => z.id === activeZone.id)?.isTriggered && (
                <div className="mt-8 bg-status-red/5 border-l-4 border-status-red p-4 rounded-r-xl">
                  <p className="text-[10px] font-black uppercase text-status-red tracking-widest mb-1">Live Event Active</p>
                  <p className="text-lg font-black tracking-tight text-ui-black mb-1">
                    {mappedZones.find(z => z.id === activeZone.id)?.triggerType}
                  </p>
                  <p className="text-sm font-bold text-ui-gray-dark">
                    Reading: {mappedZones.find(z => z.id === activeZone.id)?.value}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
