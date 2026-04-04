import { useDashboard } from "../context/DashboardContext";

const TRIGGER_BADGE = {
  TRIGGERED: "bg-status-red/10 text-status-red border-status-red",
  MONITORING: "bg-status-green/10 text-status-green border-status-green",
};

export default function TriggerLogPage() {
  const { triggers } = useDashboard();

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
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Triggered Logs</p>
           <p className="text-2xl font-black text-status-red tracking-tight">{triggers.filter(t => t.status === "TRIGGERED").length}</p>
        </div>
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Monitoring Active</p>
           <p className="text-2xl font-black text-status-green tracking-tight">{triggers.filter(t => t.status === "MONITORING").length}</p>
        </div>
        <div className="bg-ui-white border border-ui-gray-light p-5 rounded-2xl shadow-sm">
           <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Impacted Personnel</p>
           <p className="text-2xl font-black text-ui-black tracking-tight">{triggers.reduce((a, b) => a + (b.affected_riders || 0), 0)}</p>
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
              {triggers.map((row) => (
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
