import { useState } from "react";
import { claims } from "../data/mockData";

export default function ClaimsDashboard() {
  const [search, setSearch] = useState("");

  const filteredClaims = claims.filter(c =>
    c.rider_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search strictly by Rider ID (e.g., R-1234)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white/70 border border-slate-200/60 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-sm transition-all"
      />
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white/50">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100/60 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Rider ID</th>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Trigger</th>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Payout</th>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-sm uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/40">
            {filteredClaims.map((c, i) => (
              <tr key={i} className="hover:bg-white/80 transition-colors">
                <td className="px-6 py-4 font-semibold text-amber-700">{c.rider_id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{c.rider}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md capitalize text-sm">{c.trigger}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">₹{c.payout}</td>
                <td className="px-6 py-4">
                  <span className={"px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide " + (
                    c.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                    c.status === "flagged" ? "bg-rose-100 text-rose-700" :
                    c.status === "rejected" ? "bg-slate-200 text-slate-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{c.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
