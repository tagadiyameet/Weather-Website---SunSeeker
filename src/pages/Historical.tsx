
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { useWeather } from '@/hooks/useWeather';
import { Clock, Calendar as CalendarIcon, MapPin, CloudRain, ThermometerSun, Wind, Droplets, Umbrella } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, subDays, isToday, subYears } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface HistoricalWeatherData {
  datetime: string;
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  cloudcover: number;
  conditions: string;
  icon: string;
  precip: number;
  visibility: number;
  uvindex: number;
  pressure: number;
}

const Historical: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalWeatherData | null>(null);
  const { location, temperatureUnit } = useWeather();
  const { toast } = useToast();
  
  // Calculate date limits (today and 10 years ago)
  const today = new Date();
  const tenYearsAgo = subYears(today, 10);

  const formatTemperature = (temp: number) => {
    if (temperatureUnit === 'fahrenheit') {
      return `${Math.round((temp * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  const getIconUrl = (icon: string) => {
    return `https://www.visualcrossing.com/img/${icon}.svg`;
  };

  const handleSearch = async () => {
    if (!selectedDate) {
      toast({
        variant: 'destructive',
        title: 'Date required',
        description: 'Please select a date to view historical weather data.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const API_KEY = '84TXVVU7BKWWRL5KLC5SJFW8X';
      
      const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.lat},${location.lon}/${formattedDate}/${formattedDate}?unitGroup=metric&include=days&key=${API_KEY}&contentType=json`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setHistoricalData(data.days[0]);
    } catch (error) {
      console.error('Error fetching historical data:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch historical weather data. Please try again.',
      });
      setHistoricalData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Historical Weather Data</h1>

        <Card className="bg-white/90 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date > today || date < tenYearsAgo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="bg-gray-100 p-2.5 rounded-md border border-gray-200 text-gray-800 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    {location.name}
                  </div>
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || !selectedDate} 
                  className="w-full"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      View Historical Data
                    </span>
                  )}
                </Button>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">About Historical Weather Data</h3>
                <p className="text-gray-700 mb-4">
                  This feature allows you to explore weather data from the past 10 years. Select a date and location to see what the 
                  weather was like on that specific day.
                </p>
                <p className="text-gray-700">
                  Historical weather data is provided by Visual Crossing Weather API, offering accurate records of past weather conditions
                  including temperature, precipitation, wind, and more.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {historicalData && (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Weather on {selectedDate && format(selectedDate, 'MMMM d, yyyy')} in {location.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <img 
                        src={getIconUrl(historicalData.icon)} 
                        alt={historicalData.conditions} 
                        className="w-32 h-32"
                      />
                    </div>
                    <h3 className="text-5xl font-bold mb-2">
                      {formatTemperature(historicalData.temp)}
                    </h3>
                    <p className="text-xl capitalize">
                      {historicalData.conditions}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <ThermometerSun className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Feels Like</h4>
                    </div>
                    <p className="text-2xl font-semibold">
                      {formatTemperature(historicalData.feelslike)}
                    </p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Humidity</h4>
                    </div>
                    <p className="text-2xl font-semibold">{historicalData.humidity}%</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <Wind className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Wind</h4>
                    </div>
                    <p className="text-2xl font-semibold">{Math.round(historicalData.windspeed)} km/h</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-2">
                      <CloudRain className="h-5 w-5 mr-2 text-blue-500" />
                      <h4 className="font-medium">Precipitation</h4>
                    </div>
                    <p className="text-2xl font-semibold">{historicalData.precip} mm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Additional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Pressure</p>
                    <p className="font-medium">{historicalData.pressure} hPa</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Visibility</p>
                    <p className="font-medium">{historicalData.visibility} km</p>
                  </div>
                  
                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Cloud Cover</p>
                    <p className="font-medium">{historicalData.cloudcover}%</p>
                  </div>

                  <div className="bg-white/50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">UV Index</p>
                    <p className="font-medium">{historicalData.uvindex}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!historicalData && !isLoading && selectedDate && (
          <div className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200">
            <Umbrella className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              We couldn't find historical weather data for the selected date and location.
              Please try a different date.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Historical;
