import { analytics } from "../data/mockData";

const cards = [
  {
    id: "active-policies",
    label: "Total Policies Active",
    value: analytics.activePolicies.toLocaleString("en-IN"),
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
    shadowColor: "rgba(99,102,241,0.25)",
    bgTint: "rgba(99,102,241,0.08)",
  },
  {
    id: "claims-today",
    label: "Total Claims Today",
    value: analytics.totalClaimsToday,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    shadowColor: "rgba(245,158,11,0.25)",
    bgTint: "rgba(245,158,11,0.08)",
  },
  {
    id: "total-payout",
    label: "Total Payout (₹)",
    value: `₹${analytics.totalPayoutToday.toLocaleString("en-IN")}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #10b981, #34d399)",
    shadowColor: "rgba(16,185,129,0.25)",
    bgTint: "rgba(16,185,129,0.08)",
  },
  {
    id: "avg-premium",
    label: "Avg Premium (₹)",
    value: `₹${analytics.avgPremium.toLocaleString("en-IN")}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #ec4899, #f472b6)",
    shadowColor: "rgba(236,72,153,0.25)",
    bgTint: "rgba(236,72,153,0.08)",
  },
];

export default function AnalyticsSummary() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="group relative overflow-hidden rounded-2xl border border-white/60 transition-all duration-300 hover:-translate-y-1"
            style={{
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(16px)",
              boxShadow: `0 4px 24px ${card.shadowColor}, 0 1px 3px rgba(0,0,0,0.04)`,
              animationDelay: `${idx * 80}ms`,
            }}
          >
            {/* Accent bar top */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ background: card.gradient }}
            />

            <div className="p-5 pt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {card.label}
                </span>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: card.gradient,
                    boxShadow: `0 4px 12px ${card.shadowColor}`,
                  }}
                >
                  {card.icon}
                </div>
              </div>
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                {card.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .grid > div {
          animation: cardFadeUp 0.5s ease-out both;
        }
      `}</style>
    </>
  );
}
