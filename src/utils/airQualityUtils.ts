
// Air Quality utilities

export interface AqiDescription {
  level: string;
  color: string;
  message: string;
  caution: string;
}

/**
 * Get detailed air quality description based on AQI value (0-5 scale)
 */
export const getDetailedAqiDescription = (aqi: number): AqiDescription => {
  switch (aqi) {
    case 1:
      return {
        level: 'Good',
        color: 'green',
        message: 'Air quality is considered satisfactory, and air pollution poses little or no risk.',
        caution: 'No precautions needed. Enjoy outdoor activities.'
      };
    case 2:
      return {
        level: 'Fair',
        color: 'lightgreen',
        message: 'Air quality is acceptable; however, there may be a moderate health concern for a very small number of people.',
        caution: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.'
      };
    case 3:
      return {
        level: 'Moderate',
        color: 'yellow',
        message: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
        caution: 'People with respiratory or heart disease should limit prolonged outdoor exertion.'
      };
    case 4:
      return {
        level: 'Poor',
        color: 'orange',
        message: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        caution: 'Active children and adults, and people with respiratory disease should avoid prolonged outdoor exertion.'
      };
    case 5:
      return {
        level: 'Very Poor',
        color: 'red',
        message: 'Health warnings of emergency conditions. The entire population is more likely to be affected.',
        caution: 'Everyone should avoid outdoor exertion and stay indoors when possible.'
      };
    default:
      return {
        level: 'Unknown',
        color: 'gray',
        message: 'Air quality data is unavailable or cannot be calculated.',
        caution: 'Check back later for updated information.'
      };
  }
};

/**
 * Get AQI color for progress bar
 */
export const getAqiColor = (aqi: number): string => {
  switch (aqi) {
    case 1: return 'bg-green-500';
    case 2: return 'bg-lime-500';
    case 3: return 'bg-yellow-500';
    case 4: return 'bg-orange-500';
    case 5: return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

/**
 * Calculate AQI percentage (for progress bars)
 */
export const getAqiPercentage = (aqi: number): number => {
  // Convert AQI (1-5) to percentage (0-100)
  return Math.min(100, Math.max(0, ((aqi / 5) * 100)));
};
