import { ShieldAlert, ShieldCheck, CloudRain, Clock, MapPin, Activity, Navigation, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const activePolicy = {
    plan: 'Suraksha Plus',
    status: 'ACTIVE',
    validUntil: 'Sunday, 11:59 PM',
    zone: 'Rohini Sector 18 (110085)',
    coverage: 1400,
  };

  const claims = [
    {
      id: 'CLM-8921',
      date: 'Aug 13, 2024',
      trigger: 'IMD Red Alert + Waterlogging',
      amount: 665,
      status: 'Paid',
      time: '2 hours'
    }
  ];

  return (
    <div className="flex-1 flex flex-col pt-8 animate-fade-in relative min-h-[100dvh] text-ui-black">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight mb-1">Ravi Sharma</h1>
          <p className="text-sm text-ui-gray-dark font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-status-green" strokeWidth={3} />
            Protected by GigShield
          </p>
        </div>
        <div className="w-12 h-12 bg-ui-gray-light rounded-full flex items-center justify-center font-black text-xl">
          R
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-6 space-y-6 custom-scrollbar pr-1">
        
        {/* Active Policy Card (Blinkit Yellow Hero) */}
        <section>
          <div className="bg-brand-yellow rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <span className="text-[10px] font-black text-ui-black/70 tracking-widest uppercase mb-1 block">Active Policy</span>
                <h2 className="text-2xl font-black mb-1">{activePolicy.plan}</h2>
                <p className="text-sm font-bold text-ui-black/80">Valid till {activePolicy.validUntil}</p>
              </div>
              <div className="flex items-center gap-1 bg-ui-white border border-ui-black/10 text-status-green px-3 py-1 rounded-full text-xs font-black shadow-sm shrink-0">
                <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
                {activePolicy.status}
              </div>
            </div>

            <div className="bg-ui-white/90 rounded-xl p-3 flex items-center gap-3 relative z-10 border border-ui-black/5 mt-4 shadow-sm">
              <MapPin className="w-5 h-5 text-ui-gray-dark shrink-0" strokeWidth={2.5} />
              <div>
                <p className="text-xs font-bold text-ui-gray-dark mb-0.5">Monitoring Zone</p>
                <p className="text-sm font-black leading-tight">{activePolicy.zone}</p>
              </div>
            </div>
            
            {/* Decorative background element */}
            <ShieldCheck className="absolute -bottom-4 -right-4 w-32 h-32 text-brand-dark opacity-30 pointer-events-none" />
          </div>
        </section>

        {/* Live System Status - Grocery App Grid Style */}
        <section>
          <h3 className="text-lg font-black mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-status-green" strokeWidth={2.5} /> Live Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-ui-white border border-ui-gray-light rounded-xl p-4 shadow-sm">
              <CloudRain className="w-6 h-6 text-blue-500 mb-2" strokeWidth={2.5} />
              <p className="text-xs font-bold text-ui-gray-dark mb-1">Weather</p>
              <p className="text-sm font-black text-status-green flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" strokeWidth={3} /> Clear
              </p>
            </div>
            <div className="bg-ui-white border border-ui-gray-light rounded-xl p-4 shadow-sm">
              <Navigation className="w-6 h-6 text-brand-dark mb-2" strokeWidth={2.5} />
              <p className="text-xs font-bold text-ui-gray-dark mb-1">Platform API</p>
              <p className="text-sm font-black text-status-green flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" strokeWidth={3} /> Online
              </p>
            </div>
          </div>
        </section>

        {/* Claim History */}
        <section>
          <h3 className="text-lg font-black mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-ui-gray-dark" strokeWidth={2.5} /> Recent Activity
          </h3>
          
          <div className="space-y-3">
            {claims.map(claim => (
              <div key={claim.id} className="bg-ui-white border border-ui-gray-light rounded-xl p-4 flex gap-4 items-start shadow-sm">
                <div className="w-10 h-10 rounded-full bg-status-red/10 text-status-red flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm leading-snug pr-2">{claim.trigger}</h4>
                    <span className="font-black text-status-green shrink-0">+₹{claim.amount}</span>
                  </div>
                  <p className="text-xs font-bold text-ui-gray-dark mb-2">{claim.date} • Settled in {claim.time}</p>
                  <div className="inline-flex px-2 py-1 rounded bg-status-green/10 text-status-green text-[10px] uppercase font-black tracking-wider">
                    {claim.status} via UPI
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
