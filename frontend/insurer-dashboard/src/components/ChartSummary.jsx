import { claims } from "../data/mockData";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TRIGGER_COLORS = ['#f59e0b', '#d97706', '#b45309', '#78350f', '#fbbf24'];
const REGION_COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#38bdf8', '#7dd3fc'];

export default function ChartSummary() {
  const triggerCounts = claims.reduce((acc, c) => {
    acc[c.trigger] = (acc[c.trigger] || 0) + 1;
    return acc;
  }, {});

  const regionCounts = claims.reduce((acc, c) => {
    acc[c.location] = (acc[c.location] || 0) + 1;
    return acc;
  }, {});

  const triggerData = Object.entries(triggerCounts).map(([trigger, count]) => ({
    name: trigger.charAt(0).toUpperCase() + trigger.slice(1),
    value: count
  }));

  const regionData = Object.entries(regionCounts).map(([region, count]) => ({
    name: region,
    value: count
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Trigger Chart */}
      <div className="p-6 bg-white/50 border border-white/60 rounded-2xl shadow-sm h-full min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Claims by Trigger Type</h3>
        <div className="flex-1 min-h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={triggerData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {triggerData.map((entry, index) => (
                  <Cell key={"trigger-cell-" + index} fill={TRIGGER_COLORS[index % TRIGGER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.9)' }}
                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Region Chart */}
      <div className="p-6 bg-white/50 border border-white/60 rounded-2xl shadow-sm h-full min-h-[400px] flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Claims by Region</h3>
        <div className="flex-1 min-h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={"region-cell-" + index} fill={REGION_COLORS[index % REGION_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.9)' }}
                itemStyle={{ color: '#1e293b', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
