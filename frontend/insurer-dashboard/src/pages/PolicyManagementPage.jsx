import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export default function PolicyManagementPage() {
  const { analytics } = useDashboard();

  return (
    <div className="flex flex-col gap-8 pb-10 font-sans text-ui-black animate-fade-in w-full px-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="text-brand-yellow w-12 h-12 flex items-center justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Policy Management</h2>
            <p className="text-sm font-bold text-ui-gray-dark">Hyperlocal Pool Monitoring</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 bg-ui-white">
          <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Total Enrolled</p>
          <p className="text-3xl font-black tracking-tight">16,842</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-status-green">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            <span>+12.4% vs last week</span>
          </div>
        </div>
        <div className="glass-card p-6 bg-ui-white">
          <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Suraksha Lite</p>
          <p className="text-3xl font-black tracking-tight">4,120</p>
          <p className="text-xs font-bold text-ui-gray-dark mt-3">24.5% of pool</p>
        </div>
        <div className="glass-card p-6 bg-ui-white border-b-4 border-brand-yellow">
          <p className="text-[11px] font-black text-ui-gray-dark uppercase tracking-widest mb-1.5">Suraksha Plus</p>
          <p className="text-3xl font-black tracking-tight">8,950</p>
          <p className="text-xs font-bold text-ui-gray-dark mt-3">53.1% of pool (Most Popular)</p>
        </div>
        <div className="glass-card p-6 bg-ui-white bg-ui-black text-ui-white">
          <p className="text-[11px] font-black text-ui-gray-light/60 uppercase tracking-widest mb-1.5">Suraksha Max</p>
          <p className="text-3xl font-black tracking-tight">3,772</p>
          <p className="text-xs font-bold text-ui-gray-light mt-3">22.4% of pool</p>
        </div>
      </div>

      {/* Pool Protection Table */}
      <div className="glass-card overflow-hidden bg-ui-white">
        <div className="p-6 border-b border-ui-gray-light flex justify-between items-center bg-ui-white/50">
          <h3 className="text-xl font-black tracking-tight">Hyperlocal Pool Caps</h3>
          <span className="text-[10px] font-black text-ui-gray-dark uppercase tracking-widest bg-ui-gray-light/50 px-3 py-1.5 rounded-full">
            Auto-suspension at 85% Loss Ratio
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-ui-gray-light/20 border-b border-ui-gray-light">
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest">Zone (Pincode)</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Active Policies</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Weekly Premium Collected</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-center">Current Loss Ratio</th>
                <th className="px-6 py-4 text-[11px] font-black text-ui-gray-dark uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-gray-light/50">
              {[
                { zone: "Andheri West (400053)", active: 3120, premium: "₹4.3L", lr: 42, status: "ACTIVE" },
                { zone: "Delhi NCR (110001)", active: 4250, premium: "₹6.1L", lr: Math.floor(analytics.lossRatio), status: analytics.lossRatio > 85 ? "SUSPENDED" : "ACTIVE" },
                { zone: "MG Road (560001)", active: 2890, premium: "₹3.8L", lr: 18, status: "ACTIVE" },
                { zone: "Gurgaon (122018)", active: 1850, premium: "₹2.9L", lr: 76, status: "CAUTION" },
                { zone: "BBD Bagh (700001)", active: 2100, premium: "₹3.1L", lr: 61, status: "ACTIVE" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-ui-gray-light/10 transition-colors duration-200">
                  <td className="px-6 py-5 text-sm font-black text-ui-black tracking-tight">{row.zone}</td>
                  <td className="px-6 py-5 text-sm font-bold text-ui-gray-dark tracking-tight text-center">{row.active.toLocaleString()}</td>
                  <td className="px-6 py-5 text-sm font-bold text-ui-black text-center">{row.premium}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-24 h-2 bg-ui-gray-light/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${row.lr > 80 ? 'bg-status-red' : row.lr > 60 ? 'bg-status-orange' : 'bg-status-green'}`} 
                          style={{ width: `${row.lr}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-black tracking-tight ${row.lr > 80 ? 'text-status-red' : 'text-ui-black'}`}>{row.lr}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      row.status === "ACTIVE" ? "bg-status-green/10 text-status-green border-status-green/20" :
                      row.status === "CAUTION" ? "bg-status-orange/10 text-status-orange border-status-orange/20" :
                      "bg-status-red/10 text-status-red border-status-red/20"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
