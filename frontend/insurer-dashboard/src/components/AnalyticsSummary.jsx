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
    {
      id: "total-payout",
      label: "Total Payout",
      value: `₹${analytics.totalPayout.toLocaleString("en-IN")}`,
      icon: <span className="text-3xl mb-2 block text-ui-black/20 font-black">$</span>,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-brand-yellow rounded-2xl p-6 shadow-sm border-2 border-transparent transition-all hover:translate-y-[-4px]"
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
    </div>
  );
}
