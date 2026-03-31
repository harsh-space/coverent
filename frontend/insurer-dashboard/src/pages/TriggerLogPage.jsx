import { triggers } from "../data/mockData";

export default function TriggerLogPage() {
  const unapproved = triggers.filter(t => !t.approved);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl shadow-amber-900/5 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Trigger Log</h2>
        <p className="text-slate-500 mt-1">Review unapproved and critical system triggers</p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="space-y-3">
          {unapproved.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/60 hover:bg-white/90 border border-white/80 rounded-2xl shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{t.type}</h4>
                  <p className="text-sm text-slate-500">{t.location} — {t.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {t.affected} Affected
                </span>
                <div className="mt-2 space-x-2">
                  <button className="text-sm font-medium text-amber-600 hover:text-amber-700">Review</button>
                  <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Approve</button>
                </div>
              </div>
            </div>
          ))}
          
          {unapproved.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No unapproved triggers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
