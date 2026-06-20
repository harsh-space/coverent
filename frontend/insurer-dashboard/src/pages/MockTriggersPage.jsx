import { useState, useCallback, useEffect, useRef } from "react";
import { useDashboard } from "../context/DashboardContext";

const ZONES = [
  { name: "Andheri West", pin: "400053", city: "Mumbai" },
  { name: "Connaught Place", pin: "110001", city: "Delhi" },
  { name: "MG Road", pin: "560001", city: "Bangalore" },
  { name: "Parrys", pin: "600001", city: "Chennai" },
  { name: "BBD Bagh", pin: "700001", city: "Kolkata" },
  { name: "Sahar/Airport", pin: "400099", city: "Mumbai" },
  { name: "Gurgaon", pin: "122018", city: "" },
  { name: "Pune Camp", pin: "411001", city: "" },
  { name: "Ahmedabad", pin: "380001", city: "Khadia" },
];

const TRIGGERS = ["Rainfall", "AQI", "Heatwave", "Waterlogging"];
const INTENSITIES = ["Moderate", "High", "Severe", "Critical"];

/**
 * Custom Stylized Dropdown Component
 */
function StylizedDropdown({ value, options, onChange, label, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt =>
    typeof opt === 'string' ? opt === value : `${opt.name} (${opt.pin})` === value
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest pl-1 mb-2 block">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-ui-white border-2 rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-300 ${isOpen ? "border-brand-yellow shadow-lg shadow-brand-yellow/10" : "border-ui-gray-light hover:border-ui-gray-dark/30"
          }`}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-ui-gray-dark">{icon}</span>}
          <span className="font-black text-sm text-ui-black tracking-tight tracking-tight">
            {typeof selectedOption === 'string' ? selectedOption : `${selectedOption.name} (${selectedOption.pin})`}
          </span>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-ui-white border border-ui-gray-light rounded-2xl shadow-2xl overflow-hidden py-2 animate-slide-in">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option, idx) => {
              const optValue = typeof option === 'string' ? option : `${option.name} (${option.pin})`;
              const isSelected = optValue === value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-all flex items-center justify-between group ${isSelected ? "bg-brand-yellow/10 text-ui-black" : "hover:bg-ui-gray-light/30 text-ui-gray-dark hover:text-ui-black"
                    }`}
                >
                  <div className="flex flex-col">
                    <span className={isSelected ? "font-black" : "font-bold"}>{typeof option === 'string' ? option : option.name}</span>
                    {typeof option !== 'string' && <span className="text-[10px] opacity-60 uppercase tracking-tighter">{option.pin} {option.city ? `• ${option.city}` : ""}</span>}
                  </div>
                  {isSelected && (
                    <svg className="w-5 h-5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockTriggersPage() {
  const { fireTrigger, analytics, isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState("single");

  // Single Trigger State
  const [selectedTrigger, setSelectedTrigger] = useState(TRIGGERS[0]);
  const [selectedZone, setSelectedZone] = useState(ZONES[0]);
  const [selectedIntensity, setSelectedIntensity] = useState(INTENSITIES[2]);

  // Stress Test State
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressProgress, setStressProgress] = useState(0);
  const stressIntervalRef = useRef(null);

  const handleFireSingle = () => {
    let value = "";
    let threshold = "";
    if (selectedTrigger === "Rainfall") {
      value = selectedIntensity === "Severe" ? "82 mm" : "45 mm";
      threshold = "> 64.5 mm";
    } else if (selectedTrigger === "AQI") {
      value = "410";
      threshold = "> 300";
    } else {
      value = "42°C";
      threshold = "> 45°C";
    }

    fireTrigger({
      type: selectedTrigger,
      zone: `${selectedZone.name} (${selectedZone.pin})`,
      value,
      threshold,
      affectedRiders: Math.floor(Math.random() * 20) + 10
    });
  };

  const startStressTest = () => {
    setIsStressTesting(true);
    setStressProgress(1);

    stressIntervalRef.current = setInterval(() => {
      setStressProgress(prev => {
        if (prev >= 14) {
          clearInterval(stressIntervalRef.current);
          setIsStressTesting(false);
          return 14;
        }

        // Randomly pick 1-2 trigger events per "day" to make it feel busy
        const fireCount = Math.random() > 0.6 ? 2 : 1;

        for (let i = 0; i < fireCount; i++) {
          const type = TRIGGERS[Math.floor(Math.random() * TRIGGERS.length)];
          // Increased probability for demo zone 110001
          const demoZone = ZONES.find(z => z.pin === "110001") || ZONES[0];
          const zone = Math.random() > 0.4 ? demoZone : ZONES[Math.floor(Math.random() * ZONES.length)];

          fireTrigger({
            type,
            zone: `${zone.name} (${zone.pin})`,
            value: `${Math.floor(Math.random() * 30) + 60}${type === "AQI" ? "" : " mm"}`,
            threshold: "DYNAMIC",
            affectedRiders: Math.floor(Math.random() * 25) + 5
          });
        }

        return prev + 1;
      });
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (stressIntervalRef.current) clearInterval(stressIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-10 text-ui-black font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Mock Triggers</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Simulation Control Center</p>
          </div>
        </div>
      </div>

      <div className="glass-card bg-ui-white/80 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Tab Sidebar */}
        <div className="w-full md:w-72 border-r border-ui-gray-light bg-ui-gray-light/20 p-6 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-4 px-5 py-5 rounded-2xl transition-all font-black text-sm tracking-wide ${activeTab === "single" ? "bg-brand-yellow text-ui-black" : "hover:bg-ui-gray-light/40 text-ui-gray-dark"
              }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Single Trigger
          </button>

          <button
            onClick={() => setActiveTab("stress")}
            className={`flex items-center gap-4 px-5 py-5 rounded-2xl transition-all font-black text-sm tracking-wide ${activeTab === "stress" ? "bg-brand-yellow text-ui-black" : "hover:bg-ui-gray-light/40 text-ui-gray-dark"
              }`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Stress Test
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-10 animate-fade-in relative overflow-hidden">
          {activeTab === "single" ? (
            <div className="max-w-xl flex flex-col gap-10">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black tracking-tight">Manual Incident Dispatch</h3>
                <span className="text-[10px] bg-status-red text-white font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">Live</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <StylizedDropdown
                  label="Trigger Type"
                  value={selectedTrigger}
                  options={TRIGGERS}
                  onChange={setSelectedTrigger}
                  icon={<svg className="w-5 h-5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.74 4.74l1.06 1.06M18.2 18.2l1.06 1.06M3 12h1.5M19.5 12H21M4.74 19.26l1.06-1.06M18.2 5.8l1.06-1.06M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg>}
                />

                <StylizedDropdown
                  label="Target Zone"
                  value={`${selectedZone.name} (${selectedZone.pin})`}
                  options={ZONES}
                  onChange={setSelectedZone}
                  icon={<svg className="w-5 h-5 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>}
                />
              </div>

              <div>
                <label className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-4 block pl-1">Threshold Intensity</label>
                <div className="flex bg-ui-gray-light/30 p-2 rounded-2xl gap-2">
                  {INTENSITIES.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedIntensity(level)}
                      className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${selectedIntensity === level ? "bg-ui-white text-ui-black" : "text-ui-gray-dark hover:text-ui-black"
                        }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 relative">
                <button
                  onClick={handleFireSingle}
                  disabled={isLoading}
                  className={`btn-primary w-full py-5 text-lg flex gap-3 transition-all ${isLoading ? "opacity-50 grayscale cursor-not-allowed" : "hover:translate-y-[-2px] hover:scale-[1.01]"}`}
                >
                  {isLoading ? (
                    <><div className="w-6 h-6 border-4 border-ui-black border-t-transparent rounded-full animate-spin"></div> Syncing with Firebase...</>
                  ) : (
                    <>Authorize Manual Trigger <span className="ml-1 opacity-50">→</span></>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black tracking-tight">System Stress Test</h3>
                {isStressTesting && <span className="text-[10px] bg-status-orange text-white font-black px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">Running</span>}
              </div>

              <div className="bg-ui-gray-light/20 border-2 border-ui-gray-light border-dashed p-8 rounded-3xl flex flex-col gap-8 border-opacity-50">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-2 block">Simulation Model</p>
                    <p className="text-xl font-black tracking-tight text-ui-black">14-Day Monsoon Cycle</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-2 block">Region Profile</p>
                    <p className="text-xl font-black tracking-tight text-ui-black">Delhi NCR Megacity</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest block">Stress Deployment Progress</p>
                    <p className="text-xs font-black tabular-nums">{stressProgress}/14 Continuous Cycles</p>
                  </div>
                  <div className="relative">
                    <div className="h-4 bg-ui-gray-light/40 rounded-full overflow-hidden border border-ui-gray-light">
                      <div
                        className="h-full bg-brand-yellow transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(247,198,0,0.4)]"
                        style={{ width: `${(stressProgress / 14) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-ui-white border-2 border-ui-gray-light p-6 rounded-2xl flex flex-col items-center group hover:border-brand-yellow transition-colors">
                  <span className="text-[10px] font-black uppercase text-ui-gray-dark tracking-widest mb-1">BCR Buffer</span>
                  <span className="text-3xl font-black tracking-tighter">0.71</span>
                </div>
                <div className="bg-ui-white border-2 border-ui-gray-light p-6 rounded-2xl flex flex-col items-center group hover:border-brand-yellow transition-colors">
                  <span className="text-[10px] font-black uppercase text-ui-gray-dark tracking-widest mb-1">Loss Ratio</span>
                  <span className={`text-3xl font-black tracking-tighter ${analytics.lossRatio > 85 ? "text-status-red" : ""}`}>{analytics.lossRatio.toFixed(0)}%</span>
                </div>
                <div className="bg-ui-white border-2 border-ui-gray-light p-6 rounded-2xl flex flex-col items-center group hover:border-brand-yellow transition-colors">
                  <span className="text-[10px] font-black uppercase text-ui-gray-dark tracking-widest mb-1">Risk Status</span>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full mt-1 ${analytics.lossRatio > 85 ? "bg-status-red text-ui-white" : "bg-status-yellow/20 text-status-yellow"}`}>
                    {analytics.lossRatio > 85 ? "CRITICAL" : "CAUTION"}
                  </span>
                </div>
              </div>

              {analytics.lossRatio > 85 && (
                <div className="bg-status-red text-white p-5 rounded-2xl text-center flex flex-col gap-1 shadow-xl animate-bounce">
                  <p className="font-black uppercase tracking-[0.2em] text-sm">System Conflict Detected</p>
                  <p className="text-xs font-bold text-white/90">New enrolments suspended — Loss ratio exceeded risk threshold (85%)</p>
                </div>
              )}

              <div className="mt-4">
                <button
                  disabled={isStressTesting}
                  onClick={startStressTest}
                  className={`btn-primary w-full py-5 text-lg tracking-wider ${isStressTesting ? "opacity-50 cursor-not-allowed shadow-none" : "hover:translate-y-[-2px] active:scale-[0.98]"}`}
                >
                  {isStressTesting ? `DAY ${stressProgress} SIMULATION ACTIVE` : "DISPATCH STRESS TEST"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
