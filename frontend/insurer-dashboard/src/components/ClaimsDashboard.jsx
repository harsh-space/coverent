import { useState } from "react";
import { useDashboard } from "../context/DashboardContext";

const STATUS_COLORS = {
  APPROVED: "text-status-green border-status-green bg-status-green/10",
  PROCESSING: "text-status-orange border-status-orange bg-status-orange/10",
  FLAGGED: "text-status-red border-status-red bg-status-red/10",
};

export default function ClaimsDashboard() {
  const [search, setSearch] = useState("");
  const { claims } = useDashboard();

  const filteredClaims = claims.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.entity.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 font-sans text-ui-black">
      {/* Search Input styled as cleanly as PWA inputs */}
      <div>
        <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Protocol Search</label>
        <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-ui-gray-dark/50" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by ID or Rider..."
              className="clean-input !pl-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* Modern Clean Table Wrapper */}
      <div className="bg-ui-white border border-ui-gray-light rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ui-gray-light/30 border-b border-ui-gray-light">
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Protocol ID</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Entity</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Trigger</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Settlement</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-gray-light/50">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-ui-gray-light/10 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-black text-ui-black tracking-tight">{claim.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-ui-gray-dark tracking-tight">{claim.entity}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black text-ui-gray-dark uppercase tracking-widest px-3 py-1.5 rounded-full bg-ui-gray-light/30 border border-ui-gray-light">
                      {claim.trigger}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-ui-black tabular-nums">₹{claim.settlement}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[claim.status]}`}>
                        {claim.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-[11px] font-bold text-ui-gray-dark tabular-nums tracking-wider">{claim.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
