import { analytics } from "../data/mockData";

const cards = [
  {
    id: "active-policies",
    label: "Active Policies",
    value: analytics.activePolicies.toLocaleString("en-IN"),
    icon: (
      <span className="text-3xl mb-2 block">📄</span>
    ),
  },
  {
    id: "claims-today",
    label: "Total Claims",
    value: analytics.totalClaimsToday,
    icon: (
      <span className="text-3xl mb-2 block">🎯</span>
    ),
  },
  {
    id: "avg-premium",
    label: "Avg. Premium",
    value: `₹${analytics.avgPremium.toLocaleString("en-IN")}`,
    icon: (
      <span className="text-3xl mb-2 block">💳</span>
    ),
  },
  {
    id: "total-payout",
    label: "Total Payout",
    value: `₹${analytics.totalPayoutToday.toLocaleString("en-IN")}`,
    icon: (
      <span className="text-3xl mb-2 block">💵</span>
    ),
  },
];

export default function AnalyticsSummary() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-brand-yellow rounded-2xl p-6 shadow-sm border-2 border-transparent transition-all hover:bg-brand-dark"
        >
          {card.icon}
          <h2 className="text-2xl font-black mb-1 leading-tight text-ui-black tracking-tight">{card.value}</h2>
          <p className="text-[11px] font-black text-ui-black/80 uppercase tracking-widest">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
