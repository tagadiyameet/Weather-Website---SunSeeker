
import React from 'react';
import { formatTemperature, formatDate, formatTime, getWindDirection } from '@/services/weatherService';
import { useWeather } from '@/hooks/useWeather';
import { CirclePlus, ThermometerSun, Droplets, Wind, Clock, Sunrise, Sunset, Eye, Gauge } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CurrentWeatherProps {
  showAddToFavorites?: boolean;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ showAddToFavorites = true }) => {
  const { weatherData, isLoading, location, temperatureUnit, airQuality } = useWeather();
  const { isLoggedIn, addFavoriteLocation } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center p-6">
        <p className="text-lg text-gray-600">Weather data is not available. Please try again later.</p>
      </div>
    );
  }

  const current = weatherData.current;
  const { dt, sunrise, sunset, temp, feels_like, humidity, wind_speed, wind_deg, weather, pressure, visibility } = current;
  const { main: weatherMain, description: weatherDescription, icon: weatherIcon } = weather[0];

  const handleAddToFavorites = () => {
    if (isLoggedIn) {
      addFavoriteLocation({
        name: location.name,
        lat: location.lat,
        lon: location.lon,
      });
    } else {
      navigate('/login');
    }
  };

  // Get the appropriate background gradient based on weather condition and time
  const isNight = dt < sunrise || dt > sunset;
  const getBackgroundClass = () => {
    if (isNight) return 'bg-night-gradient';
    
    switch (weatherMain) {
      case 'Clear':
        return 'bg-sunny-gradient';
      case 'Clouds':
        return 'bg-cloudy-gradient';
      case 'Rain':
      case 'Drizzle':
        return 'bg-rainy-gradient';
      case 'Thunderstorm':
        return 'bg-storm-gradient';
      case 'Snow':
        return 'bg-cloudy-gradient';
      case 'Mist':
      case 'Fog':
        return 'bg-mist-gradient';
      default:
        return 'bg-blue-gradient';
    }
  };

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden ${getBackgroundClass()}`}>
      <div className="p-6 text-white backdrop-blur-sm bg-black/10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{location.name}</h2>
            <p className="text-white/80">{formatDate(dt, weatherData.timezone)}</p>
            <p className="text-white/80">{formatTime(dt, weatherData.timezone)}</p>
          </div>
          
          {showAddToFavorites && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20" 
              onClick={handleAddToFavorites}
              title="Add to favorites"
            >
              <CirclePlus className="h-6 w-6" />
            </Button>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={`https://openweathermap.org/img/wn/${weatherIcon}@4x.png`} 
              alt={weatherDescription} 
              className="w-24 h-24 mr-4"
            />
            <div>
              <h3 className="text-5xl font-bold">{formatTemperature(temp, temperatureUnit)}</h3>
              <p className="text-lg capitalize">{weatherDescription}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-lg">
              <ThermometerSun className="h-5 w-5" />
              Feels like {formatTemperature(feels_like, temperatureUnit)}
            </p>
            
            <div className="mt-2 flex items-center justify-end gap-1">
              <Sunrise className="h-5 w-5" />
              <span>Sunrise: {formatTime(sunrise, weatherData.timezone)}</span>
            </div>
            
            <div className="mt-1 flex items-center justify-end gap-1">
              <Sunset className="h-5 w-5" />
              <span>Sunset: {formatTime(sunset, weatherData.timezone)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/20 backdrop-blur-md border-0 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <Droplets className="h-6 w-6 mb-2" />
              <span className="text-sm">Humidity</span>
              <span className="text-xl font-semibold">{humidity}%</span>
              <Progress value={humidity} className="h-1.5 mt-2 bg-white/30" />
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-md border-0 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <Wind className="h-6 w-6 mb-2" />
              <span className="text-sm">Wind</span>
              <span className="text-xl font-semibold">{Math.round(wind_speed * 3.6)} km/h</span>
              <div className="mt-2 text-sm">{getWindDirection(wind_deg)}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-md border-0 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <Gauge className="h-6 w-6 mb-2" />
              <span className="text-sm">Pressure</span>
              <span className="text-xl font-semibold">{pressure} hPa</span>
              <div className="mt-2 text-sm">
                {pressure > 1013 ? 'High' : pressure < 1013 ? 'Low' : 'Normal'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/20 backdrop-blur-md border-0 text-white">
            <CardContent className="p-4 flex flex-col items-center">
              <Eye className="h-6 w-6 mb-2" />
              <span className="text-sm">Visibility</span>
              <span className="text-xl font-semibold">{(visibility / 1000).toFixed(1)} km</span>
              <div className="mt-2 text-sm">
                {visibility >= 10000 ? 'Excellent' : visibility >= 5000 ? 'Good' : 'Limited'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
