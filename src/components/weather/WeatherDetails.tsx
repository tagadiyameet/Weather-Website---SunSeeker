
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useWeather } from '@/hooks/useWeather';
import { formatTemperature, getWindDirection, getUVIndexDescription } from '@/services/weatherService';
import { Droplets, Thermometer, Wind, Sunrise, Sunset, CloudRain, Gauge, BatteryCharging } from 'lucide-react';
import AQICard from './AQICard';

const WeatherDetails: React.FC = () => {
  const { weatherData, airQuality, temperatureUnit } = useWeather();

  if (!weatherData) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Weather data is loading or unavailable.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { current, daily } = weatherData;
  const today = daily[0];

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatPrecipitation = () => {
    let precipitation = 0;
    
    if (current.rain && current.rain['1h']) {
      precipitation += current.rain['1h'];
    }
    
    if (current.snow && current.snow['1h']) {
      precipitation += current.snow['1h'];
    }
    
    return precipitation > 0 ? `${precipitation.toFixed(1)} mm` : '0 mm';
  };

  const uvIndex = getUVIndexDescription(current.uvi);

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Weather Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="now" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="now">Current</TabsTrigger>
            <TabsTrigger value="daily">Today</TabsTrigger>
          </TabsList>
          
          <TabsContent value="now" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Thermometer className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">Feels Like</span>
                    <span className="font-semibold">
                      {formatTemperature(current.feels_like, temperatureUnit)}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Wind className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">Wind</span>
                    <span className="font-semibold">{Math.round(current.wind_speed)} m/s</span>
                    <span className="text-xs text-gray-500">{getWindDirection(current.wind_deg)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Droplets className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">Humidity</span>
                    <span className="font-semibold">{current.humidity}%</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Gauge className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">Pressure</span>
                    <span className="font-semibold">{current.pressure} hPa</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <BatteryCharging className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">UV Index</span>
                    <span className="font-semibold">{Math.round(current.uvi)}</span>
                    <span className="text-xs text-gray-500">{uvIndex.level}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <CloudRain className="h-5 w-5 mb-1 text-blue-500" />
                    <span className="text-xs text-gray-500 mb-1">Precipitation</span>
                    <span className="font-semibold">{formatPrecipitation()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Sunrise className="h-5 w-5 mb-1 text-orange-500" />
                    <span className="text-xs text-gray-500 mb-1">Sunrise</span>
                    <span className="font-semibold">{formatTime(current.sunrise)}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                    <Sunset className="h-5 w-5 mb-1 text-orange-500" />
                    <span className="text-xs text-gray-500 mb-1">Sunset</span>
                    <span className="font-semibold">{formatTime(current.sunset)}</span>
                  </div>
                </div>
              </div>
              
              <AQICard airQuality={airQuality} />
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Thermometer className="h-5 w-5 mb-1 text-red-500" />
                  <span className="text-xs text-gray-500 mb-1">High</span>
                  <span className="font-semibold">
                    {formatTemperature(today.temp.max, temperatureUnit)}
                  </span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Thermometer className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-gray-500 mb-1">Low</span>
                  <span className="font-semibold">
                    {formatTemperature(today.temp.min, temperatureUnit)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Wind className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-gray-500 mb-1">Wind</span>
                  <span className="font-semibold">{Math.round(today.wind_speed)} m/s</span>
                  <span className="text-xs text-gray-500">{getWindDirection(today.wind_deg)}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Droplets className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-gray-500 mb-1">Humidity</span>
                  <span className="font-semibold">{today.humidity}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <CloudRain className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-gray-500 mb-1">Rain Chance</span>
                  <span className="font-semibold">{Math.round(today.pop * 100)}%</span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <BatteryCharging className="h-5 w-5 mb-1 text-blue-500" />
                  <span className="text-xs text-gray-500 mb-1">UV Index</span>
                  <span className="font-semibold">{Math.round(today.uvi)}</span>
                  <span className="text-xs text-gray-500">{getUVIndexDescription(today.uvi).level}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Sunrise className="h-5 w-5 mb-1 text-orange-500" />
                  <span className="text-xs text-gray-500 mb-1">Sunrise</span>
                  <span className="font-semibold">{formatTime(today.sunrise)}</span>
                </div>
                
                <div className="flex flex-col items-center justify-center bg-blue-50 p-4 rounded-lg">
                  <Sunset className="h-5 w-5 mb-1 text-orange-500" />
                  <span className="text-xs text-gray-500 mb-1">Sunset</span>
                  <span className="font-semibold">{formatTime(today.sunset)}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeatherDetails;
