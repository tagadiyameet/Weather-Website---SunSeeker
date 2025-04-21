
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeatherData, getWeatherData, getAirQuality, AirQualityData, getCityNameByCoords, getCurrentPosition } from '@/services/weatherService';
import { useAuth } from '@/hooks/useAuth';

interface WeatherContextType {
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  location: {
    lat: number;
    lon: number;
    name: string;
  };
  setLocation: (location: { lat: number; lon: number; name: string }) => void;
  airQuality: AirQualityData | null;
  refreshWeather: () => Promise<void>;
  temperatureUnit: 'celsius' | 'fahrenheit';
  setTemperatureUnit: (unit: 'celsius' | 'fahrenheit') => void;
}

const defaultLocation = {
  lat: 40.7128,
  lon: -74.0060,
  name: 'New York',
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState(() => {
    const savedLocation = localStorage.getItem('weatherLocation');
    return savedLocation ? JSON.parse(savedLocation) : defaultLocation;
  });
  const [temperatureUnit, setTemperatureUnit] = useState<'celsius' | 'fahrenheit'>(() => {
    const savedUnit = localStorage.getItem('temperatureUnit');
    return savedUnit ? (savedUnit as 'celsius' | 'fahrenheit') : 'celsius';
  });

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getWeatherData(lat, lon);
      const airQualityData = await getAirQuality(lat, lon);
      
      // Add the city name to the weather data
      setWeatherData({ ...data, name: location.name });
      setAirQuality(airQualityData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const cityName = await getCityNameByCoords(latitude, longitude);
      
      const newLocation = {
        lat: latitude,
        lon: longitude,
        name: cityName,
      };
      
      setLocation(newLocation);
      localStorage.setItem('weatherLocation', JSON.stringify(newLocation));
    } catch (err) {
      console.error('Error getting user location:', err);
      // If we can't get the user's location, we'll use the default location
      fetchWeatherData(defaultLocation.lat, defaultLocation.lon);
    }
  };

  // Set user's home location if they're logged in and have one
  useEffect(() => {
    if (isLoggedIn && user?.preferences?.homeLocation && !localStorage.getItem('userSetLocation')) {
      setLocation(user.preferences.homeLocation);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    // Try to get the user's location first
    if (navigator.geolocation && !localStorage.getItem('weatherLocation')) {
      fetchLocation();
    }
  }, []);

  useEffect(() => {
    fetchWeatherData(location.lat, location.lon);
    localStorage.setItem('weatherLocation', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    localStorage.setItem('temperatureUnit', temperatureUnit);
  }, [temperatureUnit]);

  const refreshWeather = async () => {
    await fetchWeatherData(location.lat, location.lon);
  };

  const handleSetLocation = (newLocation: { lat: number; lon: number; name: string }) => {
    setLocation(newLocation);
    // Mark that the user has explicitly set a location
    localStorage.setItem('userSetLocation', 'true');
  };

  const value = {
    weatherData,
    isLoading,
    error,
    location,
    setLocation: handleSetLocation,
    airQuality,
    refreshWeather,
    temperatureUnit,
    setTemperatureUnit,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
