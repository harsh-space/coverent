import { useDashboard } from "../context/DashboardContext";
import { dailyClaimsTrend } from "../data/mockData"; // kept as baseline fallback
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
} from "recharts";

// Cleaner modern palette matching PWA
const TRIGGER_COLORS = {
  Rain: "#F7C600",
  Rainfall: "#F7C600",
  Aqi: "#FF8C00",
  Heat: "#FF3B30",
  "Extreme Heat": "#FF3B30",
  Waterlogging: "#333333",
  Closure: "#000000",
};

const getColor = (trigger) => {
  for (const key of Object.keys(TRIGGER_COLORS)) {
    if (trigger.toLowerCase().includes(key.toLowerCase())) return TRIGGER_COLORS[key];
  }
  return "#333333";
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ui-white border-2 border-ui-gray-light rounded-xl p-4">
      <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: payload[0].fill || payload[0].color }} />
        <span className="text-xl font-black text-ui-black tracking-tight">{payload[0].value}</span>
        <span className="text-xs font-bold text-ui-gray-dark uppercase tracking-widest">Claims</span>
      </div>
    </div>
  );
};

export default function ChartSummary() {
  const { claims } = useDashboard();

  // Derive bar chart data from live claims — aggregate by trigger type
  const liveClaimsByTrigger = claims.reduce((acc, claim) => {
    const key = claim.trigger
      ? claim.trigger.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const coloredTriggerData = Object.entries(liveClaimsByTrigger).map(([trigger, count]) => ({
    trigger,
    claims: count,
    fill: getColor(trigger),
  }));

  // Fallback to mock data if no live claims yet
  const barData = coloredTriggerData.length > 0
    ? coloredTriggerData
    : [
        { trigger: "Rain", claims: 128, fill: "#F7C600" },
        { trigger: "AQI", claims: 87, fill: "#FF8C00" },
        { trigger: "Heat", claims: 64, fill: "#FF3B30" },
        { trigger: "Waterlogging", claims: 43, fill: "#333333" },
        { trigger: "Closure", claims: 21, fill: "#000000" },
      ];

  // Derive daily trend from live claims — group by date
  const liveDailyTrend = claims.reduce((acc, claim) => {
    // claims from context have a 'time' field (HH:MM). We need to group by day.
    // The raw payout from backend has a timestamp field - use entity as fallback
    const dateKey = claim.date || claim.time || "Today";
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.keys(liveDailyTrend).length >= 3
    ? Object.entries(liveDailyTrend).map(([date, count]) => ({ date, claims: count }))
    : dailyClaimsTrend;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-ui-black font-sans">
      {/* ── Claims by Trigger — Bar Chart ── */}
      <div className="glass-card p-8 bg-ui-white/80 overflow-hidden flex flex-col shadow-none hover:shadow-none">
        <div className="flex flex-col mb-8">
            <h3 className="text-2xl font-black text-ui-black tracking-tight mb-2">Impact Distribution</h3>
            <p className="text-sm font-bold text-ui-gray-dark">
              {coloredTriggerData.length > 0 ? "Live Data — Aggregate Volume By Parametric Trigger" : "Aggregate Volume By Parametric Trigger"}
            </p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
              <XAxis 
                dataKey="trigger" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#333333", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }} 
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 10, fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F9FAFB", radius: 8 }} />
              <Bar dataKey="claims" radius={[6, 6, 0, 0]} barSize={40}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Daily Claims Trend — Area Chart ── */}
      <div className="glass-card p-8 bg-ui-white/80 overflow-hidden flex flex-col shadow-none hover:shadow-none">
        <div className="flex flex-col mb-8">
            <h3 className="text-2xl font-black text-ui-black tracking-tight mb-2">Time Sequence Tracker</h3>
            <p className="text-sm font-bold text-ui-gray-dark">30-Day Aggregation of Triggered Payouts</p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFDE00" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#FFDE00" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#333333", fontSize: 10, fontWeight: 700 }} 
                interval={5}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#333333", fontSize: 10, fontWeight: 700 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="claims" 
                stroke="#FFDE00" 
                strokeWidth={4} 
                fill="transparent" 
                dot={false}
                activeDot={{ r: 6, fill: "#FFDE00", stroke: "#FFFFFF", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
