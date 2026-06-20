import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ShieldAlert, Zap } from 'lucide-react';
import CONFIG from '../config';
import { useToast } from '../components/Toast';

export default function Purchase() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [paying, setPaying] = useState(false);
  const [pricingData, setPricingData] = useState(null);

  useEffect(() => {
    const fetchPricing = async () => {
      const riderId = localStorage.getItem('rider_id');
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/riders/pricing-logic/${riderId}`);
        if (res.ok) {
            const data = await res.json();
            setPricingData(data);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic pricing:", err);
      }
    };
    fetchPricing();
  }, []);

  const getBaseDailyPayout = () => {
    const tier = str(pricingData?.income_tier || 'mid').toLowerCase();
    if (tier === 'low') return 420;
    if (tier === 'high') return 805;
    return 630;
  };

  const str = (val) => String(val || '');

  const dailyBase = getBaseDailyPayout();

  const plans = [
    { id: 'lite', name: 'Suraksha Lite', coveredDays: 1, maxPayout: dailyBase * 1, price: pricingData?.pricing?.lite || 119, recommended: (pricingData?.risk_score || 0) <= 40, color: 'bg-blue-400' },
    { id: 'plus', name: 'Suraksha Plus', coveredDays: 2, maxPayout: dailyBase * 2, price: pricingData?.pricing?.plus || 169, recommended: (pricingData?.risk_score || 0) > 40 && (pricingData?.risk_score || 0) <= 60, color: 'bg-brand-yellow' },
    { id: 'max', name: 'Suraksha Max', coveredDays: 3, maxPayout: dailyBase * 3, price: pricingData?.pricing?.max || 249, recommended: (pricingData?.risk_score || 0) > 60, color: 'bg-purple-500' }
  ];

  const handlePurchase = async () => {
    const riderId = localStorage.getItem('rider_id');
    if (!riderId) {
      addToast('Session expired. Please login again.', 'error');
      navigate('/');
      return;
    }

    // Map UI plan IDs to Backend PolicyType enum
    const planMapping = {
      lite: 'suraksha_basic',
      plus: 'suraksha_plus',
      max: 'suraksha_max'
    };

    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/riders/purchase-policy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rider_id: riderId,
          policy_type: planMapping[selectedPlan]
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Policy purchase failed');
      }

      addToast(`Policy ${selectedPlan.toUpperCase()} activated!`, 'success');
      setTimeout(() => { navigate('/dashboard'); }, 1200);

    } catch (err) {
      console.error('Purchase Error:', err);
      addToast(err.message, 'error');
      setPaying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-6 px-4 font-sans text-ui-black animate-fade-in w-full overflow-hidden">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors shrink-0"
      >
        ← Back
      </button>

      <div className="mb-8 shrink-0 text-center">
        <h1 className="text-4xl font-black tracking-tight mb-2">Weekly Premium</h1>
        <p className="text-sm font-bold text-ui-gray-dark">Tailored for your Zone & Income</p>
      </div>

        <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden pb-4">
        
        {pricingData && pricingData.is_restricted && (
          <div className="bg-ui-black text-ui-white p-5 rounded-3xl mb-4 border border-status-red/50 shadow-[0_15px_30px_rgb(239,68,68,0.2)] animate-pulse">
            <div className="flex items-start gap-4">
              <div className="bg-status-red/20 text-status-red p-2 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="font-black text-lg leading-tight mb-1 uppercase tracking-tight">Pincode Pool at Capacity</h3>
                <p className="text-ui-white/70 text-xs font-bold leading-relaxed">
                  The insurance pool for Zone <strong>{pricingData.pincode || '400099'}</strong> is currently at <strong>{pricingData.features?.pincode_loss_ratio}%</strong> payout capacity. 
                  <br /><br />
                  Registration is temporarily paused in this pincode to guarantee settlement funds for existing riders.
                </p>
              </div>
            </div>
          </div>
        )}

        {pricingData && !pricingData.is_eligible_for_policy && !pricingData.is_restricted && (
          <div className="glass-card bg-status-orange/5 border border-status-orange/30 p-4 mb-4 text-xs font-bold">
            <span className="text-status-orange block mb-1 uppercase tracking-widest text-[10px]">⚠️ Restricted Claim Access</span>
            You currently have {pricingData.active_days_count} active days. You may purchase a plan, but claim payouts will only activate after you complete 7 active days on the platform.
          </div>
        )}

        {plans.map(plan => (
          <div 
            key={plan.id}
            onClick={() => !pricingData?.is_restricted && setSelectedPlan(plan.id)}
            className={`relative p-5 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                pricingData?.is_restricted ? 'opacity-40 grayscale pointer-events-none' :
                selectedPlan === plan.id 
                  ? 'bg-ui-black text-ui-white -translate-y-1 ring-2 ring-ui-black/10' 
                  : 'glass-card border-none hover:shadow-[0_10px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1'
              }`}
          >
            {/* Colored top accent line for unselected */}
            {selectedPlan !== plan.id && (
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${plan.color}`} />
            )}

            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-brand-yellow text-[10px] font-black px-3 py-1.5 rounded-bl-2xl text-ui-black tracking-wider shadow-sm flex items-center gap-1 z-10">
                <Zap className="w-3 h-3" fill="currentColor" /> RECOMMENDED
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4 mt-2">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                <p className={`text-sm font-bold ${selectedPlan === plan.id ? 'text-ui-white/70' : 'text-ui-gray-dark'}`}>Covers {plan.coveredDays} {plan.coveredDays === 1 ? 'day' : 'days'} a week</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black">₹{plan.price}</span>
                <span className={`text-[10px] font-bold block uppercase tracking-widest mt-1 ${selectedPlan === plan.id ? 'text-brand-yellow' : 'text-ui-gray-dark'}`}>/ week</span>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t border-dashed space-y-3 ${selectedPlan === plan.id ? 'border-ui-white/20' : 'border-ui-black/10'}`}>
              <div className="flex items-center gap-3 text-sm font-bold">
                <div className={`p-1 rounded-full shrink-0 ${selectedPlan === plan.id ? 'bg-status-green/20 text-status-green' : 'bg-status-green text-ui-white'}`}>
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
                <span>Max payout <strong>₹{plan.maxPayout}</strong></span>
              </div>
              <div className={`flex items-start gap-3 text-sm font-bold leading-tight ${selectedPlan === plan.id ? 'text-ui-white/90' : 'text-ui-gray-dark'}`}>
                <div className={`p-1 rounded-full shrink-0 mt-0.5 ${selectedPlan === plan.id ? 'bg-status-green/20 text-status-green' : 'bg-status-green text-ui-white'}`}>
                  <Check className="w-3 h-3" strokeWidth={4} />
                </div>
                <span>Auto-triggers on blockages, heat, AQI & outages</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto shrink-0 pb-6 pt-4">
        {!pricingData?.is_restricted && (
          <div className="flex items-start gap-3 glass-card bg-brand-yellow/5 border-brand-yellow/30 p-4 mb-5 text-xs text-ui-black leading-relaxed font-bold">
            <ShieldAlert className="w-5 h-5 shrink-0 text-brand-dark" strokeWidth={2.5} />
            <p>Premium is auto-deducted directly from platform clearing. Valid from Monday to Sunday.</p>
          </div>
        )}

        <button 
          onClick={() => {
            if (pricingData?.is_restricted) return;
            setPaying(true);
            handlePurchase();
          }}
          disabled={paying || pricingData?.is_restricted}
          className={`btn-primary w-full ${paying || pricingData?.is_restricted ? 'opacity-80 pointer-events-none shadow-none bg-ui-gray-dark border-ui-gray-dark text-white' : 'btn-accent shadow-[0_10px_30px_rgb(255,222,0,0.3)]'}`}
        >
          {pricingData?.is_restricted ? (
             'Enrollment Temporarily Suspended'
          ) : paying ? (
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
