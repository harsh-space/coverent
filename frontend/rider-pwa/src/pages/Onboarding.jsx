import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Smartphone } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [view, setView] = useState('initial'); // 'initial' | 'login' | 'register'
  
  const [formData, setFormData] = useState({
    name: '', phone: '', platform: 'blinkit', pincode: '', tier: 'mid', upi: ''
  });

  const [loginData, setLoginData] = useState({ phone: '', otp: '' });

  const updateForm = (key, value) => setFormData(prev => ({...prev, [key]: value}));
  const updateLogin = (key, value) => setLoginData(prev => ({...prev, [key]: value}));

  const platforms = [
    { id: 'blinkit', name: 'Blinkit' },
    { id: 'zepto', name: 'Zepto' },
    { id: 'swiggy', name: 'Instamart' }
  ];

  const tiers = [
    { id: 'low', name: 'Low' },
    { id: 'mid', name: 'Mid' },
    { id: 'high', name: 'High' }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/risk-profile');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col pt-8 font-sans text-ui-black pb-8 animate-fade-in custom-scrollbar overflow-y-auto w-full px-1">
      
      {view === 'initial' && (
        <div className="flex-1 flex flex-col justify-center animate-fade-in px-4">
          <div className="text-center mb-12">
            <ShieldCheck className="text-brand-yellow w-16 h-16 mx-auto mb-4" strokeWidth={2.5} />
            <h1 className="text-4xl font-black tracking-tight mb-2">GigShield</h1>
            <p className="text-sm font-bold text-ui-gray-dark">Income Protection for Delivery Partners</p>
          </div>

          <div className="space-y-4 px-2 mt-8">
            <button 
              onClick={() => setView('login')}
              className="btn-primary w-full py-4 text-lg"
            >
              Login
            </button>
            <button 
              onClick={() => setView('register')}
              className="w-full bg-ui-white border-2 border-ui-gray-light text-ui-black rounded-xl py-4 px-6 font-black tracking-wide shadow-sm active:scale-95 transition-all text-center hover:bg-ui-gray-light/30"
            >
              Create New Account
            </button>
          </div>
        </div>
      )}

      {view === 'login' && (
        <div className="animate-slide-in flex-1 flex flex-col px-4">
          <button onClick={() => setView('initial')} className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors">← Back</button>
          
          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2">Welcome Back</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Enter your mobile number to login.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 flex-1 flex flex-col bg-ui-white rounded-2xl pb-6">
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Phone Number</label>
              <input 
                type="tel" 
                placeholder="10 digit mobile" 
                className="clean-input"
                maxLength={10}
                value={loginData.phone}
                onChange={(e) => updateLogin('phone', e.target.value)}
                required
              />
            </div>
            
            {loginData.phone.length > 9 && (
              <div className="animate-slide-in">
                <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Enter OTP</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1234" 
                  className="clean-input text-center tracking-[1em] font-mono text-xl font-bold"
                  maxLength={4}
                  value={loginData.otp}
                  onChange={(e) => updateLogin('otp', e.target.value)}
                  required
                />
              </div>
            )}

            <button 
              type="submit"
              disabled={loginData.otp.length < 4}
              className={`btn-primary w-full mt-auto ${loginData.otp.length < 4 ? 'opacity-50 grayscale cursor-not-allowed shadow-none' : ''}`}
            >
              Verify OTP & Login <ChevronRight className="w-5 h-5 ml-1" strokeWidth={3} />
            </button>
          </form>
        </div>
      )}

      {view === 'register' && (
        <div className="animate-slide-in flex-1 flex flex-col">
          <div className="px-4">
            <button onClick={() => setView('initial')} className="text-sm font-bold text-ui-gray-dark mb-6 tracking-wider uppercase flex items-center w-fit hover:text-ui-black transition-colors">← Back</button>
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight mb-1">Rider Registration</h1>
              <p className="text-sm font-bold text-ui-gray-dark">Get income protection for your delivery zone</p>
            </div>
          </div>

          <div className="bg-brand-yellow rounded-2xl p-6 mb-8 shadow-sm mx-4">
            <div className="text-2xl mb-2">🛵</div>
            <h2 className="text-xl font-black mb-2 leading-tight">Earn. Protect. Deliver.</h2>
            <p className="text-sm font-bold text-ui-black/80 leading-snug">
              Parametric income protection for dark store delivery riders.<br/>
              Auto-payout when rain hits your zone.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6 flex-1 flex flex-col bg-ui-white rounded-2xl pb-6 px-4">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ravi Kumar" 
                className="clean-input"
                value={formData.name}
                onChange={(e) => updateForm('name', e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Phone Number</label>
              <input 
                type="tel" 
                placeholder="10 digit mobile" 
                className="clean-input"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => updateForm('phone', e.target.value)}
                required
              />
            </div>

            {/* Platform Selector */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-3 block tracking-widest uppercase">Q-Commerce Platform</label>
              <div className="flex flex-wrap gap-3">
                {platforms.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => updateForm('platform', p.id)}
                    className={`py-2 px-5 rounded-full font-black text-sm transition-all border-2 ${
                      formData.platform === p.id 
                        ? 'bg-brand-yellow border-brand-yellow text-ui-black shadow-sm' 
                        : 'bg-ui-white border-ui-gray-light text-ui-gray-dark hover:bg-ui-gray-light/30'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pincode */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">Delivery Zone Pincode</label>
              <input 
                type="number" 
                placeholder="e.g. 110001" 
                className="clean-input"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => updateForm('pincode', e.target.value)}
                required
              />
            </div>

            {/* Income Tier */}
            <div>
              <label className="text-[11px] font-black text-ui-gray-dark mb-3 block tracking-widest uppercase">Income Tier</label>
              <div className="flex justify-between gap-3">
                {tiers.map(t => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => updateForm('tier', t.id)}
                    className={`flex-1 py-1.5 px-4 rounded-full font-black text-sm transition-all border-2 ${
                      formData.tier === t.id 
                        ? 'bg-brand-yellow border-brand-yellow text-ui-black shadow-sm' 
                        : 'bg-ui-white border-ui-gray-light text-ui-gray-dark hover:bg-ui-gray-light/30'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID */}
            <div className="mb-4">
              <label className="text-[11px] font-black text-ui-gray-dark mb-2 block tracking-widest uppercase">UPI ID (For Auto-Payouts)</label>
              <input 
                type="text" 
                placeholder="e.g. name@okhdfc" 
                className="clean-input"
                value={formData.upi}
                onChange={(e) => updateForm('upi', e.target.value)}
                required
              />
            </div>

            <button 
              type="submit"
              className="btn-primary w-full mt-4"
            >
              Generate AI Risk Profile
              <ChevronRight className="w-5 h-5 ml-1" strokeWidth={3} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
