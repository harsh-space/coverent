import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const DashboardContext = createContext();

const API_BASE = "http://localhost:8000/api/triggers";

export function DashboardProvider({ children }) {
  const [triggers, setTriggers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [analytics, setAnalytics] = useState({
    activePolicies: 1250,
    totalClaims: 0,
    avgPremium: 349,
    totalPayout: 0,
    lossRatio: 65,
  });

  const [isLoading, setIsLoading] = useState(false);

  // --- Fetch Data from Backend ---
  const fetchData = useCallback(async () => {
    try {
      const [logsRes, claimsRes] = await Promise.all([
        fetch(`${API_BASE}/logs`),
        fetch(`${API_BASE}/claims`)
      ]);

      if (logsRes.ok && claimsRes.ok) {
        const logsData = await logsRes.json();
        const claimsData = await claimsRes.json();

        // Map backend Trigger Logs to frontend standard
        setTriggers(logsData.map(log => ({
          id: log.trigger_id.substring(0, 8),
          trigger: log.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          zone: log.zone_id,
          value: log.description, // Backend description often has it
          threshold: "N/A",
          status: "TRIGGERED",
          affected_riders: 0, // Backend doesn't store this in trigger_logs, only payout_logs
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));

        // Map backend Payout Logs to frontend standard CLM entries
        setClaims(claimsData.map(p => ({
          id: p.payout_id.substring(0, 8).toUpperCase(),
          entity: p.rider_id,
          trigger: p.trigger_type.toUpperCase().replace('_', ' '),
          settlement: p.amount,
          status: p.status.toUpperCase(),
          time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));

        // Update Analytics based on actual claims
        const totalPayout = claimsData.reduce((acc, p) => acc + p.amount, 0);
        setAnalytics(prev => ({
          ...prev,
          totalClaims: claimsData.length,
          totalPayout: totalPayout,
          lossRatio: Math.min(100, (totalPayout / (1250 * 349)) * 100 + 40) // Heuristic for demo
        }));
      }
    } catch (error) {
      console.error("DashboardContext: Failed to sync with Firebase:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Polling for demo updates
    return () => clearInterval(interval);
  }, [fetchData]);

  const fireTrigger = useCallback(async (triggerData) => {
    setIsLoading(true);
    try {
      // 1. Send to Backend
      const response = await fetch(`${API_BASE}/event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trigger_type: triggerData.type.toLowerCase().replace(' ', '_'),
          zone_id: triggerData.zone.match(/\((.*?)\)/)?.[1] || triggerData.zone,
          severity: triggerData.type === "Rainfall" ? 8.5 : 7.0, // severity heuristic
          description: `${triggerData.value} detected in ${triggerData.zone.split(' ')[0]}`,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error("Backend failed to process trigger event");
      }

      // 2. Re-fetch data to show the new reality
      await fetchData();
      
    } catch (error) {
      console.error("DashboardContext: Trigger fire failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData]);

  return (
    <DashboardContext.Provider value={{ 
      triggers, 
      claims, 
      analytics, 
      fireTrigger, 
      isLoading,
      sync: fetchData 
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
