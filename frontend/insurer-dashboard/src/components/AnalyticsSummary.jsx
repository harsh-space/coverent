import { analytics } from "../data/mockData";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#31f500", "#74aca1", "#FFBB28"];

export default function AnalyticsSummary() {
  const data = [
    { name: "Claims Today", value: analytics.totalClaimsToday },
    { name: "Payout Today", value: analytics.totalPayoutToday },
    { name: "Active Policies", value: analytics.activePolicies },
  ];

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Analytics Summary</h2>
      <div className="flex justify-between">
        <div>
          <p>Total Claims Today: {analytics.totalClaimsToday}</p>
          <p>Total Payout Today: ₹{analytics.totalPayoutToday}</p>
          <p>Active Policies: {analytics.activePolicies}</p>
        </div>
        <PieChart width={200} height={200}>
          <Pie data={data} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
