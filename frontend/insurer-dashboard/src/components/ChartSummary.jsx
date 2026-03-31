import { claimsByTrigger, dailyClaimsTrend } from "../data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Unique gradient colors for each trigger bar
const TRIGGER_COLORS = {
  Rain: "#6366f1",
  AQI: "#f59e0b",
  Heat: "#ef4444",
  Waterlogging: "#0ea5e9",
  Closure: "#8b5cf6",
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: "14px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: 14 }}>
        {label}
      </p>
      <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: payload[0].color }}>
          {payload[0].value}
        </span>{" "}
        claims
      </p>
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.8)",
        borderRadius: "14px",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <p style={{ margin: 0, fontWeight: 700, color: "#1e293b", fontSize: 14 }}>
        {label}
      </p>
      <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
        <span style={{ fontWeight: 600, color: "#6366f1" }}>
          {payload[0].value}
        </span>{" "}
        claims
      </p>
    </div>
  );
};

// Custom bar shape with rounded tops
const RoundedBar = (props) => {
  const { x, y, width, height, fill } = props;
  if (height <= 0) return null;
  const radius = Math.min(8, width / 2);
  return (
    <g>
      <defs>
        <linearGradient id={`bar-${fill}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity={1} />
          <stop offset="100%" stopColor={fill} stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <path
        d={`M${x},${y + height} 
            L${x},${y + radius} 
            Q${x},${y} ${x + radius},${y} 
            L${x + width - radius},${y} 
            Q${x + width},${y} ${x + width},${y + radius} 
            L${x + width},${y + height} 
            Z`}
        fill={`url(#bar-${fill})`}
      />
    </g>
  );
};

export default function ChartSummary() {
  // Add color to each trigger entry for the bar chart
  const coloredTriggerData = claimsByTrigger.map((item) => ({
    ...item,
    fill: TRIGGER_COLORS[item.trigger] || "#94a3b8",
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* ── Claims by Trigger — Bar Chart ── */}
      <div
        className="rounded-2xl border border-white/60 p-6 flex flex-col"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="9" rx="1"/>
              <rect x="10" y="7" width="4" height="14" rx="1"/>
              <rect x="17" y="3" width="4" height="18" rx="1"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">Claims by Trigger</h3>
            <p className="text-xs text-slate-400 mt-0.5">Parametric trigger performance</p>
          </div>
        </div>

        <div className="flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={coloredTriggerData}
              margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
              barCategoryGap="28%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="trigger"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 8 }} />
              <Bar
                dataKey="claims"
                shape={<RoundedBar />}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {coloredTriggerData.map((entry, index) => (
                  <RoundedBar key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trigger legend pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
          {claimsByTrigger.map((item) => (
            <span
              key={item.trigger}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
              style={{
                background: `${TRIGGER_COLORS[item.trigger]}14`,
                color: TRIGGER_COLORS[item.trigger],
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: TRIGGER_COLORS[item.trigger] }}
              />
              {item.trigger}: {item.claims}
            </span>
          ))}
        </div>
      </div>

      {/* ── Daily Claims Trend — Area/Line Chart (30 days) ── */}
      <div
        className="rounded-2xl border border-white/60 p-6 flex flex-col"
        style={{
          background: "rgba(255,255,255,0.55)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #6366f1, #818cf8)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight">Daily Claims Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Last 30 days</p>
          </div>
        </div>

        <div className="flex-1 min-h-[280px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart
              data={dailyClaimsTrend}
              margin={{ top: 8, right: 12, left: -8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="claimsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                interval={4}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Area
                type="monotone"
                dataKey="claims"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#claimsGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
          {[
            {
              label: "Peak",
              value: Math.max(...dailyClaimsTrend.map((d) => d.claims)),
              color: "#ef4444",
            },
            {
              label: "Average",
              value: Math.round(
                dailyClaimsTrend.reduce((s, d) => s + d.claims, 0) /
                  dailyClaimsTrend.length
              ),
              color: "#6366f1",
            },
            {
              label: "Total",
              value: dailyClaimsTrend.reduce((s, d) => s + d.claims, 0),
              color: "#10b981",
            },
          ].map((stat) => (
            <div key={stat.label} className="flex-1 text-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className="text-xl font-extrabold mt-0.5"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
