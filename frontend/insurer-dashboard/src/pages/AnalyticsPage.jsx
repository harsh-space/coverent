import { useState, useEffect } from "react";
import AnalyticsSummary from "../components/AnalyticsSummary";
import ChartSummary from "../components/ChartSummary";

const API_BASE = (import.meta.env.VITE_API_URL || "https://coverent-api.onrender.com").replace(/\/$/, "") + "/api/triggers";

export default function AnalyticsPage() {
  const [forecast, setForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch(`${API_BASE}/forecast`);
        if (res.ok) {
          const data = await res.json();
          setForecast(data);
        }
      } catch (err) {
        console.warn("Forecast fetch failed:", err);
      } finally {
        setForecastLoading(false);
      }
    };
    fetchForecast();
  }, []);

  return (
    <div className="flex flex-col gap-10 font-sans text-ui-black pb-8 animate-fade-in custom-scrollbar overflow-y-auto w-full px-1">
      
      {/* Refined Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
             </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Analytics Trace</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Live Settlement Distribution Ledger</p>
          </div>
        </div>
      </div>

      <AnalyticsSummary />
      <ChartSummary />

      {/* ── 7-Day Payout Liability Forecast ── */}
      <div className="glass-card overflow-hidden bg-ui-white">
        <div className="p-6 border-b border-ui-gray-light flex justify-between items-center bg-ui-white/50">
          <div>
            <h3 className="text-xl font-black tracking-tight">7-Day Liability Forecast</h3>
            <p className="text-xs font-bold text-ui-gray-dark mt-0.5">Powered by LSTM Disruption Forecaster — Model 3</p>
          </div>
          {forecast && (
            <div className="text-right">
              <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-0.5">Total Projected Liability</p>
              <p className="text-2xl font-black text-status-orange tracking-tight">
                ₹{(forecast.total_estimated_liability / 1000).toFixed(1)}k
              </p>
            </div>
          )}
        </div>

        {forecastLoading ? (
          <div className="p-10 flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-ui-gray-dark">Running LSTM forecaster...</p>
          </div>
        ) : forecast ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-ui-gray-light/20 border-b border-ui-gray-light">
                  <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Zone</th>
                  <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Active Riders</th>
                  <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Est. Claims (7d)</th>
                  <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Est. Liability</th>
                  <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-gray-light/50">
                {forecast.zones.map((zone, i) => {
                  const riskPct = zone.active_riders > 0 ? (zone.estimated_claims / zone.active_riders) * 100 : 0;
                  const riskLabel = riskPct > 5 ? "HIGH" : riskPct > 2 ? "MODERATE" : "LOW";
                  const riskColor = riskPct > 5 ? "bg-status-red/10 text-status-red border-status-red/20" : riskPct > 2 ? "bg-status-orange/10 text-status-orange border-status-orange/20" : "bg-status-green/10 text-status-green border-status-green/20";
                  return (
                    <tr key={i} className="hover:bg-ui-gray-light/10 transition-colors duration-200">
                      <td className="px-6 py-5 text-sm font-black text-ui-black tracking-tight">{zone.zone}</td>
                      <td className="px-6 py-5 text-sm font-bold text-ui-gray-dark text-center">{zone.active_riders.toLocaleString()}</td>
                      <td className="px-6 py-5 text-sm font-black text-ui-black text-center">{zone.estimated_claims}</td>
                      <td className="px-6 py-5 text-sm font-black text-status-orange text-right">₹{zone.estimated_liability.toLocaleString()}</td>
                      <td className="px-6 py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${riskColor}`}>
                          {riskLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-ui-black text-ui-white">
                  <td className="px-6 py-4 text-sm font-black" colSpan={2}>All Zones Combined</td>
                  <td className="px-6 py-4 text-sm font-black text-center">{forecast.total_estimated_claims}</td>
                  <td className="px-6 py-4 text-sm font-black text-brand-yellow text-right">₹{forecast.total_estimated_liability.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] font-black text-ui-white/60 uppercase tracking-widest">{forecast.forecast_window_days}d Window</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <p className="text-sm font-bold text-ui-gray-dark opacity-60">Forecast unavailable — backend may be offline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
