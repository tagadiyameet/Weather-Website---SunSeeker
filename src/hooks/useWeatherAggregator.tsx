
import React, { useState, useCallback, createContext, useContext } from 'react';
import { getAccuWeatherData, getVisualCrossingData } from '@/services/weatherAggregator';

export interface AccuWeatherData {
  Temperature: {
    Metric: {
      Value: number;
    };
  };
  RealFeelTemperature: {
    Metric: {
      Value: number;
    };
  };
  RelativeHumidity: number;
  Wind: {
    Speed: {
      Metric: {
        Value: number;
      };
    };
    Direction: {
      Degrees: number;
    };
  };
  CloudCover: number;
  PrecipitationSummary?: {
    Precipitation: {
      Metric: {
        Value: number;
      };
    };
  };
  WeatherText: string;
  UVIndex: number;
  Visibility: {
    Metric: {
      Value: number;
    };
  };
  LocalObservationDateTime: string;
  WeatherIcon?: number;
}

export interface VisualCrossingData {
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  cloudcover: number;
  precip: number;
  conditions: string;
  visibility: number;
  uvindex: number;
  datetime: string;
  icon?: string;
}

interface WeatherAggregatorContextType {
  accuWeatherData: AccuWeatherData | null;
  visualCrossingData: VisualCrossingData | null;
  isLoading: boolean;
  error: string | null;
  fetchAllWeatherData: (lat: number, lon: number) => Promise<void>;
}

const WeatherAggregatorContext = createContext<WeatherAggregatorContextType | undefined>(undefined);

export const useWeatherAggregator = () => {
  const context = useContext(WeatherAggregatorContext);
  if (context === undefined) {
    throw new Error('useWeatherAggregator must be used within a WeatherAggregatorProvider');
  }
  return context;
};

export const WeatherAggregatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accuWeatherData, setAccuWeatherData] = useState<AccuWeatherData | null>(null);
  const [visualCrossingData, setVisualCrossingData] = useState<VisualCrossingData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllWeatherData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Promise.allSettled to handle partial failures
      const [accuWeatherResponse, visualCrossingResponse] = await Promise.allSettled([
        getAccuWeatherData(lat, lon),
        getVisualCrossingData(lat, lon)
      ]);

      // Handle AccuWeather response
      if (accuWeatherResponse.status === 'fulfilled') {
        setAccuWeatherData(accuWeatherResponse.value);
      } else {
        console.error('Failed to fetch AccuWeather data:', accuWeatherResponse.reason);
      }

      // Handle Visual Crossing response
      if (visualCrossingResponse.status === 'fulfilled') {
        setVisualCrossingData(visualCrossingResponse.value);
      } else {
        console.error('Failed to fetch Visual Crossing data:', visualCrossingResponse.reason);
      }

      // Only set error if both requests failed
      if (accuWeatherResponse.status === 'rejected' && visualCrossingResponse.status === 'rejected') {
        setError('Failed to fetch data from any weather service. Please try again later.');
      }
    } catch (err) {
      console.error('Error fetching aggregated weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    accuWeatherData,
    visualCrossingData,
    isLoading,
    error,
    fetchAllWeatherData
  };

  return (
    <WeatherAggregatorContext.Provider value={value}>
      {children}
    </WeatherAggregatorContext.Provider>
  );
};
