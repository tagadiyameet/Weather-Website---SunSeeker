
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherData } from '@/services/weatherService';
import { MapPin, Trash2, RefreshCw, ThermometerSun, Droplets } from 'lucide-react';
import { formatTemperature } from '@/services/weatherService';
import { useToast } from '@/hooks/use-toast';

interface LocationWeather {
  id: string;
  name: string;
  lat: number;
  lon: number;
  weather: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
  };
}

const Favorites: React.FC = () => {
  const { user, removeFavoriteLocation } = useAuth();
  const { setLocation, temperatureUnit } = useWeather();
  const [locationsWeather, setLocationsWeather] = useState<LocationWeather[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFavoritesWeather = async () => {
    if (!user?.preferences.favoriteLocations.length) {
      return;
    }

    setIsLoading(true);
    try {
      const promises = user.preferences.favoriteLocations.map(async (location) => {
        const data = await getWeatherData(location.lat, location.lon);
        return {
          id: location.id,
          name: location.name,
          lat: location.lat,
          lon: location.lon,
          weather: {
            temp: data.current.temp,
            feels_like: data.current.feels_like,
            humidity: data.current.humidity,
            description: data.current.weather[0].description,
            icon: data.current.weather[0].icon,
          },
        };
      });

      const results = await Promise.all(promises);
      setLocationsWeather(results);
      toast({
        title: 'Favorites refreshed',
        description: 'Weather data for your favorite locations has been updated.',
      });
    } catch (error) {
      console.error('Error fetching favorites weather:', error);
      toast({
        variant: 'destructive',
        title: 'Error refreshing favorites',
        description: 'There was an issue updating weather data for your favorite locations.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFavoritesWeather();
  }, [user?.preferences.favoriteLocations]);

  const handleViewLocation = (lat: number, lon: number, name: string) => {
    setLocation({ lat, lon, name });
    toast({
      title: 'Location selected',
      description: `Now viewing weather for ${name}.`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    removeFavoriteLocation(locationId);
    toast({
      title: 'Location removed',
      description: 'The location has been removed from your favorites.',
    });
  };

  if (!user) {
    return (
      <Layout>
        <div className="text-center p-6">
          <p className="text-lg text-gray-600">Please log in to view your favorite locations.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Favorite Locations</h1>
          <Button 
            onClick={fetchFavoritesWeather} 
            disabled={isLoading || !user.preferences.favoriteLocations.length}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh All'}</span>
          </Button>
        </div>

        {user.preferences.favoriteLocations.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Favorite Locations</h3>
                <p className="text-gray-600 max-w-md mb-6">
                  You haven't added any locations to your favorites yet. Add locations from the weather page to see them here.
                </p>
                <Button onClick={() => window.location.href = "/"}>
                  Go to Weather
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locationsWeather.length > 0 ? (
              locationsWeather.map((location) => (
                <Card key={location.id} className="bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-weather-blue to-blue-400 p-4 text-white">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">{location.name}</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-white hover:bg-white/20 h-8 w-8" 
                        onClick={() => handleRemoveLocation(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={`https://openweathermap.org/img/wn/${location.weather.icon}@2x.png`} 
                        alt={location.weather.description} 
                        className="w-16 h-16 mr-2"
                      />
                      <div>
                        <p className="text-2xl font-bold">
                          {formatTemperature(location.weather.temp, temperatureUnit)}
                        </p>
                        <p className="text-sm capitalize">{location.weather.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-2 rounded-md flex items-center">
                        <ThermometerSun className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Feels Like</p>
                          <p className="font-medium">{formatTemperature(location.weather.feels_like, temperatureUnit)}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md flex items-center">
                        <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                        <div>
                          <p className="text-xs text-gray-500">Humidity</p>
                          <p className="font-medium">{location.weather.humidity}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      onClick={() => handleViewLocation(location.lat, location.lon, location.name)}
                    >
                      View Full Weather
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex justify-center py-12">
                <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Favorites;
