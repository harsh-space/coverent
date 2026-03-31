import ClaimsDashboard from "../components/ClaimsDashboard";

export default function ClaimsPage() {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-amber-900/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Claims Dashboard</h2>
          <p className="text-slate-500 mt-1">Manage and search through all submitted claims</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white/50 rounded-2xl p-4 border border-white/60">
        <ClaimsDashboard />
      </div>
    </div>
  );
}
