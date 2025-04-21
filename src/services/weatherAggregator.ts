import { AccuWeatherData, VisualCrossingData } from "@/hooks/useWeatherAggregator";

// Weather service providers API keys
const ACCUWEATHER_API_KEY = "jx2Jp9q4xnXxeovi4s114HEaFl41zSGM"; // Use the real API key
const VISUAL_CROSSING_API_KEY = "84TXVVU7BKWWRL5KLC5SJFW8X"; // Use the real API key

/**
 * Fetch weather data from AccuWeather API
 */
export const getAccuWeatherData = async (lat: number, lon: number): Promise<AccuWeatherData> => {
  try {
    console.log(`Fetching AccuWeather data for lat: ${lat}, lon: ${lon}`);
    // First, get the location key using coordinates
    const locationResponse = await fetch(
      `https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${ACCUWEATHER_API_KEY}&q=${lat},${lon}`
    );
    
    if (!locationResponse.ok) {
      throw new Error(`Failed to fetch AccuWeather location data: ${locationResponse.status}`);
    }
    
    const locationData = await locationResponse.json();
    const locationKey = locationData.Key;
    console.log(`AccuWeather location key: ${locationKey}`);
    
    // Then get the current conditions using the location key
    const weatherResponse = await fetch(
      `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${ACCUWEATHER_API_KEY}&details=true`
    );
    
    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch AccuWeather weather data: ${weatherResponse.status}`);
    }
    
    const weatherData = await weatherResponse.json();
    console.log('AccuWeather data received successfully');
    return weatherData[0];
  } catch (error) {
    console.error('Error fetching AccuWeather data:', error);
    throw error;
  }
};

/**
 * Fetch weather data from Visual Crossing API
 */
export const getVisualCrossingData = async (lat: number, lon: number): Promise<VisualCrossingData> => {
  try {
    console.log(`Fetching Visual Crossing data for lat: ${lat}, lon: ${lon}`);
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/today?unitGroup=metric&include=current&key=${VISUAL_CROSSING_API_KEY}&contentType=json`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Visual Crossing data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Visual Crossing data received successfully');
    return data.currentConditions;
  } catch (error) {
    console.error('Error fetching Visual Crossing data:', error);
    throw error;
  }
};

/**
 * Calculate average temperature from multiple providers
 */
export const calculateAverageTemperature = (openWeatherTemp?: number, accuWeatherTemp?: number, visualCrossingTemp?: number): number | null => {
  const validValues = [openWeatherTemp, accuWeatherTemp, visualCrossingTemp].filter(temp => temp !== undefined && temp !== null) as number[];
  
  if (validValues.length === 0) return null;
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

/**
 * Calculate average humidity from multiple providers
 */
export const calculateAverageHumidity = (openWeatherHumidity?: number, accuWeatherHumidity?: number, visualCrossingHumidity?: number): number | null => {
  const validValues = [openWeatherHumidity, accuWeatherHumidity, visualCrossingHumidity].filter(humidity => humidity !== undefined && humidity !== null) as number[];
  
  if (validValues.length === 0) return null;
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

/**
 * Calculate average wind speed from multiple providers
 */
export const calculateAverageWindSpeed = (openWeatherWindSpeed?: number, accuWeatherWindSpeed?: number, visualCrossingWindSpeed?: number): number | null => {
  const validValues = [openWeatherWindSpeed, accuWeatherWindSpeed, visualCrossingWindSpeed].filter(speed => speed !== undefined && speed !== null) as number[];
  
  if (validValues.length === 0) return null;
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

/**
 * Calculate average cloud cover from multiple providers
 */
export const calculateAverageCloudCover = (openWeatherCloudCover?: number, accuWeatherCloudCover?: number, visualCrossingCloudCover?: number): number | null => {
  const validValues = [openWeatherCloudCover, accuWeatherCloudCover, visualCrossingCloudCover].filter(cloudCover => cloudCover !== undefined && cloudCover !== null) as number[];
  
  if (validValues.length === 0) return null;
  
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

/**
 * Aggregate weather description from multiple providers
 * Returns the most common description or the first one if there's no common one
 */
export const aggregateWeatherDescription = (openWeatherDesc?: string, accuWeatherDesc?: string, visualCrossingDesc?: string): string => {
  const descriptions = [openWeatherDesc, accuWeatherDesc, visualCrossingDesc].filter(desc => desc !== undefined && desc !== null) as string[];
  
  if (descriptions.length === 0) return "No data available";
  if (descriptions.length === 1) return descriptions[0];
  
  // Count occurrences of each description
  const counts: Record<string, number> = {};
  descriptions.forEach(desc => {
    counts[desc] = (counts[desc] || 0) + 1;
  });
  
  // Find the most common description
  let maxCount = 0;
  let mostCommonDesc = descriptions[0];
  
  for (const [desc, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      mostCommonDesc = desc;
    }
  }
  
  return mostCommonDesc;
};

/**
 * Calculate temperature deviation between providers
 */
export const calculateTemperatureDeviation = (openWeatherTemp?: number, accuWeatherTemp?: number, visualCrossingTemp?: number): number | null => {
  const validValues = [openWeatherTemp, accuWeatherTemp, visualCrossingTemp].filter(temp => temp !== undefined && temp !== null) as number[];
  
  if (validValues.length < 2) return null;
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  return max - min;
};

/**
 * Get reliability assessment for a specific provider
 */
export const getProviderReliability = (provider: 'openweather' | 'accuweather' | 'visualcrossing'): number => {
  // In a real application, this would be calculated based on historical accuracy
  switch (provider) {
    case 'openweather': return 87;
    case 'accuweather': return 91;
    case 'visualcrossing': return 89;
  }
};
