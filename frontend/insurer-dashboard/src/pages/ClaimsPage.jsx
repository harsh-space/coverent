import ClaimsDashboard from "../components/ClaimsDashboard";

export default function ClaimsPage() {
  return (
    <div className="flex flex-col gap-10 font-sans text-ui-black pb-8 animate-fade-in custom-scrollbar overflow-y-auto w-full px-1">
      {/* Refined Header - Exact PWA Font sizing and spacing */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Claims</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Automated Settlement Audit Archive</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-visible">
        <ClaimsDashboard />
      </div>
    </div>
  );
}
