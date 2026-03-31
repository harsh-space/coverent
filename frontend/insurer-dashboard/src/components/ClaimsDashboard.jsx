import { claims } from "../data/mockData";

export default function ClaimsDashboard() {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Claims Dashboard</h2>
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Rider</th>
            <th className="px-4 py-2">Trigger</th>
            <th className="px-4 py-2">Payout</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="px-4 py-2">{c.rider}</td>
              <td className="px-4 py-2">{c.trigger}</td>
              <td className="px-4 py-2">₹{c.payout}</td>
              <td className={`px-4 py-2 ${c.status === "approved" ? "text-green-600" : "text-red-600"}`}>
                {c.status}
              </td>
              <td className="px-4 py-2">{c.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
