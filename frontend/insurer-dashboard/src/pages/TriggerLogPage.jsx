import { useState, useCallback } from "react";

const INITIAL_TRIGGERS = [
  { id: "TRG-001", trigger: "Rainfall", zone: "Rohini (110085)", value: "72 mm", threshold: "> 64.5 mm", status: "TRIGGERED", affected_riders: 23, time: "2:10 PM" },
  { id: "TRG-002", trigger: "AQI", zone: "Dwarka (110075)", value: "410", threshold: "> 300", status: "TRIGGERED", affected_riders: 15, time: "6:40 PM" },
  { id: "TRG-003", trigger: "Temperature", zone: "Noida (201301)", value: "42°C", threshold: "> 45°C", status: "MONITORING", affected_riders: 0, time: "1:00 PM" },
  { id: "TRG-004", trigger: "Rainfall", zone: "Gurgaon (122001)", value: "81 mm", threshold: "> 64.5 mm", status: "TRIGGERED", affected_riders: 31, time: "3:25 PM" },
];

const SIM_ZONES = ["Connaught Place (110001)", "Hauz Khas (110016)", "Vasant Kunj (110070)", "Janakpuri (110058)"];

const TRIGGER_BADGE = {
  TRIGGERED: "bg-status-red/10 text-status-red border-status-red",
  MONITORING: "bg-status-green/10 text-status-green border-status-green",
};

export default function TriggerLogPage() {
  const [triggerRows, setTriggerRows] = useState(INITIAL_TRIGGERS);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = useCallback(() => {
    setSimulating(true);
    setTimeout(() => {
      const zone = SIM_ZONES[Math.floor(Math.random() * SIM_ZONES.length)];
      const rainfall = Math.floor(Math.random() * 40) + 60;
      const riders = Math.floor(Math.random() * 30) + 5;
      const hour = Math.floor(Math.random() * 12) + 1;
      const min = Math.floor(Math.random() * 60);
      const ampm = Math.random() > 0.5 ? "PM" : "AM";
      const newTrigger = {
        id: `TRG-${String(triggerRows.length + 1).padStart(3, "0")}`,
        trigger: "Rainfall",
        zone,
        value: `${rainfall} mm`,
        threshold: "> 64.5 mm",
        status: rainfall > 64.5 ? "TRIGGERED" : "MONITORING",
        affected_riders: rainfall > 64.5 ? riders : 0,
        time: `${hour}:${String(min).padStart(2, "0")} ${ampm}`,
      };
      setTriggerRows((prev) => [newTrigger, ...prev]);
      setSimulating(false);
    }, 600);
  }, [triggerRows.length]);

  return (
    <div className="flex flex-col gap-8 pb-10 text-ui-black font-sans">
      
      {/* Refined Header - Exact PWA Font sizing and spacing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Active Triggers</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Live Environmental Tracking</p>
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={simulating}
          className={`${simulating ? "opacity-50 grayscale cursor-not-allowed shadow-none" : ""} btn-primary shrink-0`}
        >
          {simulating ? "Simulating..." : (<>Fire Simulator <span className="ml-1">→</span></>)}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Triggered Logs</p>
           <p className="text-2xl font-black text-status-red tracking-tight">{triggerRows.filter(t => t.status === "TRIGGERED").length}</p>
        </div>
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Monitoring Active</p>
           <p className="text-2xl font-black text-status-green tracking-tight">{triggerRows.filter(t => t.status === "MONITORING").length}</p>
        </div>
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Impacted Personnel</p>
           <p className="text-2xl font-black text-ui-black tracking-tight">{triggerRows.reduce((a, b) => a + b.affected_riders, 0)}</p>
        </div>
      </div>

      {/* Clean Modern Table - Solid White, Minimal Shadows */}
      <div className="bg-ui-white border border-ui-gray-light rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ui-gray-light/30 border-b border-ui-gray-light">
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Trigger Event</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Monitoring Zone</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Reading</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Riders</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-gray-light/50">
              {triggerRows.map((row) => (
                <tr key={row.id} className="hover:bg-ui-gray-light/10 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-black text-ui-black tracking-tight">{row.trigger}</td>
                  <td className="px-6 py-4 text-sm font-bold text-ui-gray-dark tracking-tight">{row.zone}</td>
                  <td className="px-6 py-4 text-center font-bold text-ui-black text-sm">{row.value}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${TRIGGER_BADGE[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-ui-gray-dark tracking-tight">{row.affected_riders || "--"}</td>
                  <td className="px-6 py-4 text-right text-[11px] font-bold text-ui-gray-dark tabular-nums tracking-wider">{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
