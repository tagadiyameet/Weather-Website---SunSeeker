
import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatTemperature, formatTime } from '@/services/weatherService';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, ChevronLeft, ChevronRight, Droplets, Umbrella } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HourlyForecast: React.FC = () => {
  const { weatherData, isLoading, temperatureUnit } = useWeather();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Hourly forecast data is not available.</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <LockKeyhole className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-semibold">Hourly Forecast is Premium</h3>
            <p className="text-gray-600 max-w-md">
              Create an account or log in to access the 24-hour weather forecast and more premium features.
            </p>
            <div className="flex gap-3 mt-2">
              <Button onClick={() => navigate('/login')}>Log In</Button>
              <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use only the first 24 hours
  const hourlyData = weatherData.hourly.slice(0, 24);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm relative">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">24-Hour Forecast</h3>
          
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollLeft} 
              disabled={!canScrollLeft}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={scrollRight} 
              disabled={!canScrollRight}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 scrollbar-none space-x-4"
          onScroll={handleScroll}
        >
          {hourlyData.map((hour, index) => {
            const date = new Date(hour.dt * 1000);
            const isNow = index === 0;
            const time = isNow ? 'Now' : formatTime(hour.dt, weatherData.timezone);
            
            return (
              <div 
                key={hour.dt} 
                className="flex-none w-20 bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-sm">{time}</p>
                <img 
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                  alt={hour.weather[0].description} 
                  className="w-10 h-10 mx-auto"
                />
                <p className="font-semibold">{formatTemperature(hour.temp, temperatureUnit)}</p>
                
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-600">
                  <Droplets className="h-3 w-3" />
                  <span>{hour.humidity}%</span>
                </div>
                
                {hour.pop > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-600">
                    <Umbrella className="h-3 w-3" />
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
