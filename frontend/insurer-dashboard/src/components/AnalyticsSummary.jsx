import { analytics } from "../data/mockData";

export default function AnalyticsSummary() {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h3 className="text-lg font-bold mb-2">Summary</h3>
      <p>Total Claims Today: {analytics.totalClaimsToday}</p>
      <p>Total Payout Today: ₹{analytics.totalPayoutToday}</p>
      <p>Active Policies: {analytics.activePolicies}</p>
    </div>
  );
}
