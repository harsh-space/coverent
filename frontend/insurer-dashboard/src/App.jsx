import ClaimsDashboard from "./components/ClaimsDashboard";
import AnalyticsSummary from "./components/AnalyticsSummary";
import TriggerLog from "./components/TriggerLog";

export default function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <ClaimsDashboard />
      <TriggerLog />
      <AnalyticsSummary />
    </div>
  );
}
