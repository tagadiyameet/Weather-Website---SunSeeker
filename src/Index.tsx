
import React from 'react';
import Layout from '@/components/layout/Layout';
import CurrentWeather from '@/components/weather/CurrentWeather';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Droplets, Sun, Users, Info, Calendar, Map, History, Umbrella, CloudRain, Thermometer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// UV index tips by level
const uvTips = {
  Low: "No protection needed. You can safely stay outside.",
  Moderate: "Wear sunscreen, sunglasses, and a hat if you'll be outside for extended periods.",
  High: "Reduce time in the sun between 10am-4pm. Wear sunscreen, protective clothing, and sunglasses.",
  VeryHigh: "Minimize sun exposure between 10am-4pm. Use SPF 30+ sunscreen, wear protective clothing.",
  Extreme: "Avoid sun exposure between 10am-4pm. Use SPF 50+ sunscreen, seek shade, wear protective gear."
};

// AQI advice by level
const aqiAdvice = {
  0: { level: "Very Good", color: "green", advice: "Air quality is excellent. Enjoy outdoor activities." },
  1: { level: "Good", color: "green", advice: "Air quality is good. Ideal for outdoor activities." },
  2: { level: "Moderate", color: "yellow", advice: "Air quality is acceptable. Unusually sensitive people should consider reducing prolonged outdoor exertion." },
  3: { level: "Unhealthy for Sensitive Groups", color: "orange", advice: "People with respiratory issues should limit outdoor activity." },
  4: { level: "Unhealthy", color: "red", advice: "Everyone may begin to experience health effects. Limit prolonged outdoor exertion." },
  5: { level: "Very Unhealthy", color: "purple", advice: "Health alert: Everyone may experience more serious health effects. Avoid outdoor activities." }
};

const getUVLevel = (uvIndex: number) => {
  if (uvIndex <= 2) return { level: "Low", color: "green" };
  if (uvIndex <= 5) return { level: "Moderate", color: "yellow" };
  if (uvIndex <= 7) return { level: "High", color: "orange" };
  if (uvIndex <= 10) return { level: "Very High", color: "red" };
  return { level: "Extreme", color: "purple" };
};

const getUVTip = (uvLevel: string) => {
  switch (uvLevel) {
    case "Low": return uvTips.Low;
    case "Moderate": return uvTips.Moderate;
    case "High": return uvTips.High;
    case "Very High": return uvTips.VeryHigh;
    case "Extreme": return uvTips.Extreme;
    default: return uvTips.Low;
  }
};

const Index: React.FC = () => {
  const { weatherData, isLoading, error, airQuality, location } = useWeather();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const hasHomeLocation = isLoggedIn && user?.preferences?.homeLocation;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  if (!weatherData) {
    return (
      <Layout>
        <div className="text-center p-6">
          <p className="text-lg text-gray-600">Weather data is not available for {location.name}. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  // Restrict access for non-registered users to only see current weather
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="space-y-6 max-w-6xl mx-auto">
          {/* Current weather section for non-registered users */}
          <div className="grid grid-cols-1 gap-6">
            <CurrentWeather />
          </div>
          
          {/* Login prompt */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-500" />
                Create an Account for More Features
              </h3>
              <p className="text-gray-700 mb-4">
                Register or login to access detailed weather information, forecasts, maps, and personalized activity recommendations.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')}>Log In</Button>
                <Button variant="outline" onClick={() => navigate('/register')}>Register Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Get UV data
  const uvIndex = weatherData.current.uvi;
  const uvData = getUVLevel(uvIndex);
  const uvTip = getUVTip(uvData.level);

  // Get AQI data
  let aqiLevel = 0;
  if (airQuality) {
    aqiLevel = airQuality.main.aqi;
  }
  const aqiData = aqiAdvice[aqiLevel as keyof typeof aqiAdvice];

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Current weather section */}
        <div className="grid grid-cols-1 gap-6">
          <CurrentWeather />
        </div>

        {/* UV Index Card - New design */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Sun className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-xl font-semibold">UV Index</h3>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
                style={{ backgroundColor: uvData.color === 'green' ? '#22c55e' : 
                                        uvData.color === 'yellow' ? '#eab308' : 
                                        uvData.color === 'orange' ? '#f97316' : 
                                        uvData.color === 'red' ? '#ef4444' : '#a855f7' }}>
                {Math.round(uvIndex)}
              </div>
              <div>
                <h4 className="text-lg font-medium">{uvData.level}</h4>
                <div className="flex mt-1">
                  {[0, 1, 2, 3, 4].map((_, i) => (
                    <div key={i} className="w-8 h-2 mr-1 rounded-sm" style={{
                      backgroundColor: i === 0 ? '#22c55e' : 
                                      i === 1 ? '#eab308' : 
                                      i === 2 ? '#f97316' : 
                                      i === 3 ? '#ef4444' : '#a855f7'
                    }}></div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h5 className="text-sm font-medium uppercase text-gray-500 mb-2">Recommendation</h5>
              <p className="text-gray-800">{uvTip}</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Best time for sun exposure:</p>
                <p className="font-medium">{uvIndex > 3 ? "Before 10 AM or After 4 PM" : "Any time of day"}</p>
              </div>
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Sunscreen recommendation:</p>
                <p className="font-medium">
                  {uvIndex <= 2 ? "SPF 15+" : 
                   uvIndex <= 5 ? "SPF 30+" : 
                   uvIndex <= 7 ? "SPF 30-50" : "SPF 50+"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Air Quality Card - New design */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Droplets className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold">Air Quality</h3>
            </div>
            
            {airQuality ? (
              <>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4"
                    style={{ backgroundColor: aqiData.color === 'green' ? '#22c55e' : 
                                          aqiData.color === 'yellow' ? '#eab308' : 
                                          aqiData.color === 'orange' ? '#f97316' : 
                                          aqiData.color === 'red' ? '#ef4444' : 
                                          aqiData.color === 'purple' ? '#a855f7' : '#7c2d12' }}>
                    {aqiLevel}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{aqiData.level}</h4>
                    <div className="flex mt-1">
                      {[0, 1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} className="w-7 h-2 mr-1 rounded-sm" style={{
                          backgroundColor: i === 0 || i === 1 ? '#22c55e' : 
                                          i === 2 ? '#eab308' : 
                                          i === 3 ? '#f97316' : 
                                          i === 4 ? '#ef4444' : 
                                          '#a855f7'
                        }}></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="text-sm font-medium uppercase text-gray-500 mb-2">Health Advice</h5>
                  <p className="text-gray-800">{aqiData.advice}</p>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium uppercase text-gray-500 mb-2">Key Pollutants</h5>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-sm font-medium">PM2.5</p>
                      <p className="text-lg">{airQuality.components.pm2_5.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">μg/m³</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-sm font-medium">PM10</p>
                      <p className="text-lg">{airQuality.components.pm10.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">μg/m³</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded-lg">
                      <p className="text-sm font-medium">O₃</p>
                      <p className="text-lg">{airQuality.components.o3.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">μg/m³</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Air quality data is not available for this location.</p>
            )}
          </CardContent>
        </Card>

        {/* Home Location Prompt */}
        {isLoggedIn && !hasHomeLocation && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Set Your Home Location</AlertTitle>
            <AlertDescription>
              <p className="mb-2">Set your home location to automatically see weather for your area when you log in.</p>
              <Button size="sm" onClick={() => navigate('/profile')}>Update Profile</Button>
            </AlertDescription>
          </Alert>
        )}

        {/* More Features Section */}
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-indigo-500" />
              Explore Weather Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <Button onClick={() => navigate('/forecast')} variant="outline" className="h-auto py-4 flex flex-col items-center text-left">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="font-medium">Forecast</span>
                <span className="text-xs text-gray-500 mt-1">Hourly and 8-day predictions</span>
              </Button>
              
              <Button onClick={() => navigate('/historical')} variant="outline" className="h-auto py-4 flex flex-col items-center text-left">
                <History className="h-6 w-6 mb-2" />
                <span className="font-medium">Historical</span>
                <span className="text-xs text-gray-500 mt-1">Weather data from the past</span>
              </Button>
              
              <Button onClick={() => navigate('/weather-maps')} variant="outline" className="h-auto py-4 flex flex-col items-center text-left">
                <Map className="h-6 w-6 mb-2" />
                <span className="font-medium">Weather Maps</span>
                <span className="text-xs text-gray-500 mt-1">Interactive weather visualizations</span>
              </Button>
              
              <Button onClick={() => navigate('/activities')} variant="outline" className="h-auto py-4 flex flex-col items-center text-left">
                <Umbrella className="h-6 w-6 mb-2" />
                <span className="font-medium">Activities</span>
                <span className="text-xs text-gray-500 mt-1">Weather-based recommendations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
