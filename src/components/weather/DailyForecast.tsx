
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatTemperature, formatDate } from '@/services/weatherService';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DailyForecast: React.FC = () => {
  const { weatherData, isLoading, temperatureUnit } = useWeather();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
        <p className="text-gray-600">Forecast data is not available.</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <LockKeyhole className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-semibold">8-Day Forecast is Premium</h3>
            <p className="text-gray-600 max-w-md">
              Create an account or log in to access the 8-day weather forecast and more premium features.
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

  // Display only the first 8 days
  const dailyData = weatherData.daily.slice(0, 8);

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">8-Day Forecast</h3>
        
        <div className="space-y-2">
          {dailyData.map((day, index) => {
            const date = new Date(day.dt * 1000);
            const isToday = index === 0;
            const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
            
            return (
              <div 
                key={day.dt} 
                className="grid grid-cols-6 items-center py-3 border-b border-gray-100 last:border-0"
              >
                <div className="col-span-2">
                  <p className="font-medium">{dayName}</p>
                  <p className="text-sm text-gray-500">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                
                <div className="col-span-1 flex justify-center">
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
                    alt={day.weather[0].description} 
                    className="w-10 h-10"
                  />
                </div>
                
                <div className="col-span-1 text-center">
                  <p className="text-sm text-gray-500">
                    {Math.round(day.pop * 100)}%
                  </p>
                </div>
                
                <div className="col-span-2 text-right">
                  <p className="font-medium">
                    {formatTemperature(day.temp.max, temperatureUnit)} / {formatTemperature(day.temp.min, temperatureUnit)}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {day.weather[0].description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
