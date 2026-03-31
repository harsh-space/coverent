import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldAlert, Zap } from 'lucide-react';

export default function Purchase() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [paying, setPaying] = useState(false);

  const plans = [
    { id: 'lite', name: 'Suraksha Lite', coveredDays: 1, maxPayout: 700, price: 119, recommended: false, color: 'bg-blue-400' },
    { id: 'plus', name: 'Suraksha Plus', coveredDays: 2, maxPayout: 1400, price: 169, recommended: true, color: 'bg-brand-yellow' },
    { id: 'max', name: 'Suraksha Max', coveredDays: 3, maxPayout: 2100, price: 249, recommended: false, color: 'bg-purple-500' }
  ];

  const handlePurchase = () => {
    setTimeout(() => { navigate('/dashboard'); }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col pt-6 font-sans text-ui-black animate-fade-in w-full overflow-hidden">
      <div className="mb-6 shrink-0 text-center">
        <h1 className="text-3xl font-black tracking-tight mb-1">Weekly Premium</h1>
        <p className="text-sm font-bold text-ui-gray-dark">Suraksha Plans</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pb-4 custom-scrollbar px-1">
        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative p-5 rounded-2xl transition-all cursor-pointer shadow-sm border-2 overflow-hidden ${
                selectedPlan === plan.id 
                  ? 'bg-brand-light border-brand-yellow scale-[1.01]' 
                  : 'bg-ui-white border-ui-gray-light hover:bg-ui-gray-light/30'
              }`}
          >
            {/* White with colored top border logic */}
            {selectedPlan !== plan.id && (
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${plan.color}`} />
            )}

            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-brand-yellow text-[10px] font-black px-3 py-1.5 rounded-bl-xl text-ui-black tracking-wider shadow-sm flex items-center gap-1 z-10">
                <Zap className="w-3 h-3" fill="currentColor" /> RECOMMENDED
              </div>
            )}
            
            <div className="flex justify-between items-start mb-3 mt-1">
              <div>
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="text-sm font-bold text-ui-gray-dark">Covers {plan.coveredDays} {plan.coveredDays === 1 ? 'day' : 'days'} a week</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black">₹{plan.price}</span>
                <span className="text-xs text-ui-gray-dark font-bold block bg-ui-gray-light/50 px-2 py-0.5 rounded-md mt-1">/ week</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-dashed border-ui-gray-light space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-ui-black">
                <Check className="w-4 h-4 text-ui-white bg-status-green p-1 rounded-full shrink-0" strokeWidth={4} />
                <span>Max payout <strong>₹{plan.maxPayout}</strong></span>
              </div>
              <div className="flex items-start gap-2 text-sm text-ui-gray-dark font-bold leading-tight">
                <Check className="w-4 h-4 text-ui-white bg-status-green p-1 rounded-full shrink-0 mt-0.5" strokeWidth={4} />
                <span>Auto-triggers on blockages, heat, AQI & outages</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 pb-6 pt-2">
        <div className="flex items-start gap-3 bg-[#FFF3E0] p-4 rounded-xl mb-4 border border-[#FFB74D] text-xs text-ui-black leading-relaxed font-bold shadow-sm">
          <ShieldAlert className="w-6 h-6 shrink-0 text-[#E65100]" strokeWidth={2.5} />
          <p>Premium is auto-deducted directly from platform clearing. Valid from Monday to Sunday.</p>
        </div>

        <button 
          onClick={() => {
            setPaying(true);
            handlePurchase();
          }}
          disabled={paying}
          className={`btn-primary w-full ${paying ? 'opacity-80 pointer-events-none shadow-none' : ''}`}
        >
          {paying ? (
            <span className="flex items-center gap-2">
              <div className="w-5 h-5 border-4 border-ui-black/20 border-t-ui-black rounded-full animate-spin" /> 
              Setting up Auto-Mandate...
            </span>
          ) : (
            `Setup ₹${plans.find(p => p.id === selectedPlan)?.price} / week`
          )}
        </button>
      </div>
    </div>
  );
}
