import { claimsByTrigger, dailyClaimsTrend } from "../data/mockData";
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
} from "recharts";

// Cleaner modern palette matching PWA
const TRIGGER_COLORS = {
  Rain: "#F7C600", // brand-yellow
  AQI: "#FF8C00",  // status-orange
  Heat: "#FF3B30", // status-red
  Waterlogging: "#333333", // ui-gray-dark
  Closure: "#000000",      // ui-black
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
  const coloredTriggerData = claimsByTrigger.map((item) => ({
    ...item,
    fill: TRIGGER_COLORS[item.trigger] || "#333333",
  }));

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-ui-black font-sans">
      {/* ── Claims by Trigger — Bar Chart ── */}
      <div className="glass-card p-8 bg-ui-white/80 overflow-hidden flex flex-col shadow-none hover:shadow-none">
        <div className="flex flex-col mb-8">
            <h3 className="text-2xl font-black text-ui-black tracking-tight mb-2">Impact Distribution</h3>
            <p className="text-sm font-bold text-ui-gray-dark">Aggregate Volume By Parametric Trigger</p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coloredTriggerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                {coloredTriggerData.map((entry, index) => (
                  <Bar key={index} dataKey="claims" fill={entry.fill} />
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
            <AreaChart data={dailyClaimsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
