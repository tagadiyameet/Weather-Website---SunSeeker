
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useWeather } from '@/hooks/useWeather';
import HourlyForecast from '@/components/weather/HourlyForecast';
import DailyForecast from '@/components/weather/DailyForecast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Forecast: React.FC = () => {
  const { refreshWeather, isLoading } = useWeather();
  const { toast } = useToast();

  const handleRefresh = async () => {
    try {
      await refreshWeather();
      toast({
        title: 'Weather refreshed',
        description: 'The weather data has been updated to the latest information.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Refresh failed',
        description: 'Unable to refresh weather data. Please try again later.',
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weather Forecast</h1>
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-t-4 border-t-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                <h2 className="text-2xl font-semibold">24-Hour Forecast</h2>
              </div>
              <HourlyForecast />
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-t-4 border-t-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                <h2 className="text-2xl font-semibold">8-Day Forecast</h2>
              </div>
              <DailyForecast />
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">About This Forecast</h3>
              <p className="text-gray-700 mb-4">
                This weather forecast is powered by OpenWeatherMap API data. The forecast includes detailed information about 
                hourly predictions for the next 24 hours, and daily forecasts for the upcoming 8 days.
              </p>
              <p className="text-gray-700">
                For the most accurate information, we recommend checking the forecast regularly as weather conditions can change. 
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Forecast;
