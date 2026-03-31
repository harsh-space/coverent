// Helper to generate random dates within the last few days
const getRandomDate = () => {
  const start = new Date(2026, 2, 28); // March 28, 2026
  const end = new Date(2026, 2, 31); // March 31, 2026
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().replace('T', ' ').substring(0, 16);
};

const triggerTypes = ["waterlogging", "heat", "AQI", "closure", "outage"];
const locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune"];
const names = ["John Doe", "Jane Smith", "Amit Kumar", "Priya Sharma", "Rahul Singh", "Sneha Patel", "Vikram Das"];
const statuses = ["approved", "flagged", "pending", "rejected"];

export const claims = Array.from({ length: 50 }, (_, i) => ({
  id: "C-" + (1000 + i),
  rider_id: "R-" + Math.floor(Math.random() * 9000 + 1000),
  rider: names[Math.floor(Math.random() * names.length)],
  trigger: triggerTypes[Math.floor(Math.random() * triggerTypes.length)],
  location: locations[Math.floor(Math.random() * locations.length)],
  payout: Math.floor(Math.random() * 800) + 200,
  status: statuses[Math.floor(Math.random() * statuses.length)],
  time: getRandomDate(),
}));

export const analytics = {
  totalClaimsToday: 42,
  totalPayoutToday: 15400,
  activePolicies: 1250,
};

export const triggers = Array.from({ length: 50 }, (_, i) => ({
  id: "T-" + (5000 + i),
  type: triggerTypes[Math.floor(Math.random() * triggerTypes.length)],
  location: locations[Math.floor(Math.random() * locations.length)],
  time: getRandomDate(),
  affected: Math.floor(Math.random() * 50) + 1,
  approved: Math.random() > 0.4, // 60% are unapproved
}));

