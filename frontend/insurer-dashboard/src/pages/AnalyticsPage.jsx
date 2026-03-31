import AnalyticsSummary from "../components/AnalyticsSummary";
import ChartSummary from "../components/ChartSummary";

export default function AnalyticsPage() {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-amber-900/5 shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics Overview</h2>
        <p className="text-slate-500 mt-1">Key metrics and visualizations</p>
        <div className="mt-6">
          <AnalyticsSummary />
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-amber-900/5 flex-1 overflow-auto">
        <ChartSummary />
      </div>
    </div>
  );
}
