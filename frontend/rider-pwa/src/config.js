const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || '/api',
  PLATFORMS: [
    { id: 'blinkit', name: 'Blinkit' },
    { id: 'zepto', name: 'Zepto' },
    { id: 'swiggy_instamart', name: 'Instamart' }
  ],
  TIERS: [
    { id: 'low', name: 'Low' },
    { id: 'mid', name: 'Mid' },
    { id: 'high', name: 'High' }
  ],
  SHIFTS: [
    { id: 'morning', name: 'Morning', time: '6AM-2PM' },
    { id: 'evening', name: 'Evening', time: '2PM-11PM' },
    { id: 'full_day', name: 'Full Day', time: '6AM-11PM' }
  ]
};

export default CONFIG;
