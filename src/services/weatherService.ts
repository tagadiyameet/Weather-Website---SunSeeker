const API_KEY = "191d5a6d69251396ba3854082a68376a";
const BASE_URL = "https://api.openweathermap.org/data/3.0";

export interface WeatherData {
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    rain?: {
      '1h': number;
    };
    snow?: {
      '1h': number;
    };
  };
  hourly: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number;
    rain?: {
      '1h': number;
    };
    snow?: {
      '1h': number;
    };
  }[];
  daily: {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    feels_like: {
      day: number;
      night: number;
      eve: number;
      morn: number;
    };
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    clouds: number;
    pop: number;
    uvi: number;
    rain?: number;
    snow?: number;
  }[];
  timezone: string;
  timezone_offset: number;
  lat: number;
  lon: number;
  name?: string;
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface AirQualityData {
  main: {
    aqi: number;
  };
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  dt: number;
}

export interface HistoricalWeatherData {
  data: WeatherData;
  city: {
    name: string;
    country: string;
  };
  date: string;
}

// Get current weather, hourly forecast and daily forecast
export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get location coordinates from city name
export const getLocationByName = async (cityName: string): Promise<LocationData[]> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

// Get city name from coordinates
export const getCityNameByCoords = async (lat: number, lon: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch city name');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      return 'Unknown Location';
    }
    
    return data[0].name;
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown Location';
  }
};

// Get air quality data
export const getAirQuality = async (lat: number, lon: number): Promise<AirQualityData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const data = await response.json();
    return data.list[0];
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

// Get historical weather data
export const getHistoricalWeather = async (lat: number, lon: number, dt: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch historical weather data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    throw error;
  }
};

// Get current user location
export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

// Format temperature
export const formatTemperature = (temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string => {
  if (unit === 'fahrenheit') {
    return `${Math.round((temp * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

// Get weather icon based on icon code
export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Format date
export const formatDate = (timestamp: number, timezone: string): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  });
};

// Format time
export const formatTime = (timestamp: number, timezone: string): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });
};

// Get UV index description
export const getUVIndexDescription = (uvi: number): { level: string; color: string } => {
  if (uvi <= 2) {
    return { level: 'Low', color: 'green' };
  } else if (uvi <= 5) {
    return { level: 'Moderate', color: 'yellow' };
  } else if (uvi <= 7) {
    return { level: 'High', color: 'orange' };
  } else if (uvi <= 10) {
    return { level: 'Very High', color: 'red' };
  } else {
    return { level: 'Extreme', color: 'purple' };
  }
};

// Get air quality description
export const getAirQualityDescription = (aqi: number): { level: string; color: string } => {
  switch (aqi) {
    case 1:
      return { level: 'Good', color: 'green' };
    case 2:
      return { level: 'Fair', color: 'lightgreen' };
    case 3:
      return { level: 'Moderate', color: 'yellow' };
    case 4:
      return { level: 'Poor', color: 'orange' };
    case 5:
      return { level: 'Very Poor', color: 'red' };
    default:
      return { level: 'Unknown', color: 'gray' };
  }
};

// Convert wind degrees to cardinal direction
export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Add this function to the existing file:
export const getCityByName = async (cityName: string): Promise<Array<{name: string, lat: number, lon: number}>> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch city data');
    }
    
    const data = await response.json();
    
    // Format the response data
    return data.map((city: any) => ({
      name: `${city.name}${city.state ? `, ${city.state}` : ''}${city.country ? `, ${city.country}` : ''}`,
      lat: city.lat,
      lon: city.lon
    }));
  } catch (error) {
    console.error("Error fetching city data:", error);
    throw error;
  }
};
