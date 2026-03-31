export const claims = [
  { rider: "John Doe", trigger: "rain", payout: 500, status: "approved", time: "2026-03-31 09:30" },
  { rider: "Jane Smith", trigger: "heat", payout: 300, status: "flagged", time: "2026-03-31 08:15" },
];

export const analytics = {
  totalClaimsToday: 12,
  totalPayoutToday: 4500,
  activePolicies: 120,
};

export const triggers = [
  { type: "rain", location: "Delhi", time: "2026-03-31 07:00", affected: 5 },
  { type: "aqi", location: "Mumbai", time: "2026-03-31 06:45", affected: 8 },
];
