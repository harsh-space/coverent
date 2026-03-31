import AnalyticsSummary from "../components/AnalyticsSummary";
import ChartSummary from "../components/ChartSummary";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Page Header */}
      <div
        className="rounded-3xl border border-white/40 p-8 shrink-0"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(180,130,30,0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              boxShadow: "0 4px 14px rgba(245,158,11,0.3)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
              <path d="M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
              Analytics Overview
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Key metrics, triggers &amp; trends at a glance
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6">
          <AnalyticsSummary />
        </div>
      </div>

      {/* Charts Section */}
      <ChartSummary />
    </div>
  );
}
