
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useWeather } from '@/hooks/useWeather';
import SearchBar from '@/components/weather/SearchBar';
import { Progress } from '@/components/ui/progress';
import { Thermometer, Droplets, Wind, Cloud, BatteryCharging, BarChart3, Sun } from 'lucide-react';
import { useWeatherAggregator } from '@/hooks/useWeatherAggregator';
import { Separator } from '@/components/ui/separator';
import { 
  calculateAverageTemperature, 
  calculateAverageHumidity, 
  calculateAverageWindSpeed, 
  calculateAverageCloudCover, 
  aggregateWeatherDescription 
} from '@/services/weatherAggregator';

const WeatherAggregator: React.FC = () => {
  const { location, weatherData } = useWeather();
  const { 
    accuWeatherData, 
    visualCrossingData, 
    isLoading, 
    error,
    fetchAllWeatherData
  } = useWeatherAggregator();

  useEffect(() => {
    if (location) {
      fetchAllWeatherData(location.lat, location.lon);
    }
  }, [location, fetchAllWeatherData]);

  // Calculate aggregated weather data
  const aggregatedWeather = React.useMemo(() => {
    if (!weatherData || (!accuWeatherData && !visualCrossingData)) {
      return null;
    }

    const openWeatherTemp = weatherData?.current?.temp;
    const accuWeatherTemp = accuWeatherData?.Temperature?.Metric?.Value;
    const visualCrossingTemp = visualCrossingData?.temp;

    const openWeatherHumidity = weatherData?.current?.humidity;
    const accuWeatherHumidity = accuWeatherData?.RelativeHumidity;
    const visualCrossingHumidity = visualCrossingData?.humidity;

    const openWeatherWindSpeed = weatherData?.current?.wind_speed;
    const accuWeatherWindSpeed = accuWeatherData?.Wind?.Speed?.Metric?.Value;
    const visualCrossingWindSpeed = visualCrossingData?.windspeed;

    const openWeatherClouds = weatherData?.current?.clouds;
    const accuWeatherClouds = accuWeatherData?.CloudCover;
    const visualCrossingClouds = visualCrossingData?.cloudcover;

    const openWeatherDesc = weatherData?.current?.weather[0]?.description;
    const accuWeatherDesc = accuWeatherData?.WeatherText;
    const visualCrossingDesc = visualCrossingData?.conditions;

    return {
      temperature: calculateAverageTemperature(openWeatherTemp, accuWeatherTemp, visualCrossingTemp),
      humidity: calculateAverageHumidity(openWeatherHumidity, accuWeatherHumidity, visualCrossingHumidity),
      windSpeed: calculateAverageWindSpeed(openWeatherWindSpeed, accuWeatherWindSpeed, visualCrossingWindSpeed),
      cloudCover: calculateAverageCloudCover(openWeatherClouds, accuWeatherClouds, visualCrossingClouds),
      description: aggregateWeatherDescription(openWeatherDesc, accuWeatherDesc, visualCrossingDesc),
      sources: {
        openWeather: !!weatherData,
        accuWeather: !!accuWeatherData,
        visualCrossing: !!visualCrossingData
      }
    };
  }, [weatherData, accuWeatherData, visualCrossingData]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Weather Aggregator</h1>
        <p className="text-gray-600 mb-6">
          Compare weather data from multiple providers to get a more accurate forecast.
        </p>

        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-full max-w-md">
                  <SearchBar className="w-full" preventRedirect={true} />
                </div>
                <div className="text-sm text-gray-500">
                  Currently showing weather for <span className="font-semibold">{location.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card className="bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6 flex justify-center items-center min-h-[200px]">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading weather data from multiple sources...</p>
              </div>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="text-red-500">
                <p>Error loading weather data: {error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Aggregated Current Weather */}
            <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Aggregated Current Weather</CardTitle>
                <CardDescription>Combined data from all available weather providers</CardDescription>
              </CardHeader>
              <CardContent>
                {aggregatedWeather ? (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">Current Conditions</h3>
                        <div className="text-sm text-gray-500">
                          Data from {Object.values(aggregatedWeather.sources).filter(Boolean).length} sources
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <Sun className="w-16 h-16 text-amber-500 mr-4" />
                        <div>
                          <div className="text-4xl font-bold">{aggregatedWeather.temperature !== null ? Math.round(aggregatedWeather.temperature) : '--'}°C</div>
                          <div className="text-gray-600 capitalize">{aggregatedWeather.description}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <Droplets className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500">Humidity</div>
                            <div className="font-medium">{aggregatedWeather.humidity !== null ? Math.round(aggregatedWeather.humidity) : '--'}%</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Wind className="w-5 h-5 text-blue-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500">Wind</div>
                            <div className="font-medium">{aggregatedWeather.windSpeed !== null ? Math.round(aggregatedWeather.windSpeed) : '--'} m/s</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Cloud className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500">Cloud Cover</div>
                            <div className="font-medium">{aggregatedWeather.cloudCover !== null ? Math.round(aggregatedWeather.cloudCover) : '--'}%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Sources</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${aggregatedWeather.sources.openWeather ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>OpenWeatherMap</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${aggregatedWeather.sources.accuWeather ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>AccuWeather</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${aggregatedWeather.sources.visualCrossing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span>Visual Crossing</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm text-gray-600">
                          This aggregated data combines information from multiple weather services to provide 
                          a more accurate representation of current conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No aggregated weather data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Current Weather Comparison</CardTitle>
                <CardDescription>Compare current weather data from different providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* OpenWeatherMap Card */}
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">OpenWeatherMap</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {weatherData ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                              <span className="text-gray-600">Temperature</span>
                            </div>
                            <span className="font-semibold">{Math.round(weatherData.current.temp)}°C</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="text-gray-600">Humidity</span>
                            </div>
                            <span className="font-semibold">{weatherData.current.humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Wind className="h-5 w-5 mr-2 text-blue-400" />
                              <span className="text-gray-600">Wind</span>
                            </div>
                            <span className="font-semibold">{weatherData.current.wind_speed} m/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Cloud className="h-5 w-5 mr-2 text-gray-400" />
                              <span className="text-gray-600">Clouds</span>
                            </div>
                            <span className="font-semibold">{weatherData.current.clouds}%</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {weatherData.current.weather[0]?.description}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No data available</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* AccuWeather Card */}
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">AccuWeather</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {accuWeatherData ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                              <span className="text-gray-600">Temperature</span>
                            </div>
                            <span className="font-semibold">{Math.round(accuWeatherData.Temperature.Metric.Value)}°C</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="text-gray-600">Humidity</span>
                            </div>
                            <span className="font-semibold">{accuWeatherData.RelativeHumidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Wind className="h-5 w-5 mr-2 text-blue-400" />
                              <span className="text-gray-600">Wind</span>
                            </div>
                            <span className="font-semibold">{accuWeatherData.Wind.Speed.Metric.Value} m/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Cloud className="h-5 w-5 mr-2 text-gray-400" />
                              <span className="text-gray-600">Clouds</span>
                            </div>
                            <span className="font-semibold">{accuWeatherData.CloudCover}%</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {accuWeatherData.WeatherText || 'No description available'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No data available</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Visual Crossing Card */}
                  <Card className="bg-white shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Visual Crossing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {visualCrossingData ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
                              <span className="text-gray-600">Temperature</span>
                            </div>
                            <span className="font-semibold">{Math.round(visualCrossingData.temp)}°C</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="text-gray-600">Humidity</span>
                            </div>
                            <span className="font-semibold">{visualCrossingData.humidity}%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Wind className="h-5 w-5 mr-2 text-blue-400" />
                              <span className="text-gray-600">Wind</span>
                            </div>
                            <span className="font-semibold">{visualCrossingData.windspeed} m/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Cloud className="h-5 w-5 mr-2 text-gray-400" />
                              <span className="text-gray-600">Clouds</span>
                            </div>
                            <span className="font-semibold">{visualCrossingData.cloudcover}%</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <div className="text-sm text-gray-500">
                              {visualCrossingData.conditions || 'No description available'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No data available</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Weather Data Comparison</CardTitle>
                <CardDescription>See how weather data differs between providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Temperature Comparison */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Temperature (°C)</h3>
                    <div className="space-y-3">
                      {weatherData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>OpenWeatherMap</span>
                            <span className="font-medium">{Math.round(weatherData.current.temp)}°C</span>
                          </div>
                          <Progress value={Math.round(weatherData.current.temp) + 40} className="h-2 bg-gray-100" />
                        </div>
                      )}
                      {accuWeatherData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>AccuWeather</span>
                            <span className="font-medium">{Math.round(accuWeatherData.Temperature.Metric.Value)}°C</span>
                          </div>
                          <Progress value={Math.round(accuWeatherData.Temperature.Metric.Value) + 40} className="h-2 bg-gray-100" />
                        </div>
                      )}
                      {visualCrossingData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Visual Crossing</span>
                            <span className="font-medium">{Math.round(visualCrossingData.temp)}°C</span>
                          </div>
                          <Progress value={Math.round(visualCrossingData.temp) + 40} className="h-2 bg-gray-100" />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Humidity Comparison */}
                  <div>
                    <h3 className="text-lg font-medium mb-3">Humidity (%)</h3>
                    <div className="space-y-3">
                      {weatherData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>OpenWeatherMap</span>
                            <span className="font-medium">{weatherData.current.humidity}%</span>
                          </div>
                          <Progress value={weatherData.current.humidity} className="h-2 bg-gray-100" />
                        </div>
                      )}
                      {accuWeatherData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>AccuWeather</span>
                            <span className="font-medium">{accuWeatherData.RelativeHumidity}%</span>
                          </div>
                          <Progress value={accuWeatherData.RelativeHumidity} className="h-2 bg-gray-100" />
                        </div>
                      )}
                      {visualCrossingData && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Visual Crossing</span>
                            <span className="font-medium">{visualCrossingData.humidity}%</span>
                          </div>
                          <Progress value={visualCrossingData.humidity} className="h-2 bg-gray-100" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle>Weather Forecast Aggregation</CardTitle>
                <CardDescription>Combined 5-day forecast from all providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-5 gap-4 min-w-[750px]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Card key={i} className="bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <div className="font-medium mb-2">
                              {new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="text-4xl font-bold my-2">
                              {weatherData ? Math.round(weatherData.daily[i]?.temp.day) : '--'}°
                            </div>
                            <div className="text-sm text-gray-500 mb-3">
                              {weatherData?.daily[i]?.weather[0]?.description || 'No data'}
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>{weatherData?.daily[i]?.temp.min ? Math.round(weatherData.daily[i].temp.min) : '--'}°</span>
                              <span>{weatherData?.daily[i]?.temp.max ? Math.round(weatherData.daily[i].temp.max) : '--'}°</span>
                            </div>
                            <div className="flex justify-center mt-2">
                              {weatherData?.daily[i]?.weather[0]?.icon && (
                                <img 
                                  src={`https://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}@2x.png`} 
                                  alt="Weather icon" 
                                  className="w-12 h-12"
                                />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle>About Weather Aggregation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Weather aggregation combines data from multiple weather services to provide more accurate and reliable forecasts.
              This page pulls data from three major weather providers:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 mb-4">
              <li><span className="font-medium">OpenWeatherMap</span>: Global weather data provider with extensive coverage</li>
              <li><span className="font-medium">AccuWeather</span>: Industry-leading provider with precise forecasting and real-time accuracy</li>
              <li><span className="font-medium">Visual Crossing</span>: Known for historical weather data and accurate forecasting</li>
            </ul>
            <p className="text-gray-600">
              By comparing these different sources, you can get a more complete picture of current and upcoming weather conditions.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeatherAggregator;
