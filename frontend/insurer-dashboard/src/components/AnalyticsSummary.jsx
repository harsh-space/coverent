import { useDashboard } from "../context/DashboardContext";

export default function AnalyticsSummary() {
  const { analytics } = useDashboard();

  const cards = [
    {
      id: "active-policies",
      label: "Active Policies",
      value: analytics.activePolicies.toLocaleString("en-IN"),
      icon: <span className="text-3xl mb-2 block text-ui-black/20 font-black">#</span>,
    },
    {
      id: "claims-today",
      label: "Total Claims",
      value: analytics.totalClaims,
      icon: <span className="text-3xl mb-2 block text-ui-black/20 font-black">!</span>,
    },
    {
      id: "avg-premium",
      label: "Avg. Premium",
      value: `₹${analytics.avgPremium.toLocaleString("en-IN")}`,
      icon: <span className="text-3xl mb-2 block text-ui-black/20 font-black">₹</span>,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="glass-card p-6 bg-ui-white transition-all hover:translate-y-[-4px]"
        >
          <div className="flex justify-between items-start">
             <div>
               <h2 className="text-3xl font-black mb-1 leading-tight text-ui-black tracking-tighter">{card.value}</h2>
               <p className="text-[11px] font-black text-ui-black/60 uppercase tracking-widest">{card.label}</p>
             </div>
             {card.icon}
          </div>
        </div>
      ))}
      <div className="glass-card p-6 bg-ui-white">
        <h3 className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Total Claimed Amount</h3>
        <p className="text-3xl font-black text-ui-black tracking-tight">₹{((analytics.totalPayout || 0) / 1000).toFixed(1)}k</p>
      </div>

      <div className="glass-card p-6 bg-ui-white">
        <h3 className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Disrupted Riders</h3>
        <p className="text-3xl font-black text-ui-black tracking-tight">{analytics.disruptedRiders || 0}</p>
      </div>

      <div className="glass-card p-6 bg-ui-white">
        <h3 className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Zone Risk Level</h3>
        <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
          analytics.lossRatio > 85 ? "bg-status-red/10 text-status-red" :
          analytics.lossRatio > 60 ? "bg-status-orange/10 text-status-orange" :
          "bg-status-green/10 text-status-green"
        }`}>
          {analytics.lossRatio > 85 ? "CRITICAL" : analytics.lossRatio > 60 ? "HIGH" : "NORMAL"}
        </span>
      </div>
    </div>
  );
}
