
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, Cloud, Thermometer, Wind, Droplets, LockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const WeatherMap: React.FC = () => {
  const { location } = useWeather();
  const { isLoggedIn } = useAuth();
  const [mapType, setMapType] = useState<string>('temp_new');
  const API_KEY = '191d5a6d69251396ba3854082a68376a';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mapUrl, setMapUrl] = useState<string>('');
  const [iframe, setIframe] = useState<any>(null);

  useEffect(() => {
    const zoom = 10;
    const url = `https://openweathermap.org/weathermap?basemap=map&cities=false&layer=${mapType}&lat=${location.lat}&lon=${location.lon}&zoom=${zoom}`;
    setMapUrl(url);

    // Create iframe element with removed unnecessary elements
    const iframeElement = document.createElement('iframe');
    iframeElement.src = url;
    iframeElement.width = '100%';
    iframeElement.height = '100%';
    iframeElement.style.border = 'none';
    iframeElement.allowFullscreen = true;
    
    // Use onload to hide unwanted elements with CSS
    iframeElement.onload = function() {
      try {
        const iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow?.document;
        if (iframeDoc) {
          // Create a style element to inject CSS that hides unwanted elements
          const style = iframeDoc.createElement('style');
          style.textContent = `
            .owm-toolbar-header { display: none !important; }
            .leaflet-control-layers { display: none !important; }
            .leaflet-control-attribution { display: none !important; }
            .owm-legend-mobile-panel { display: none !important; }
            .time-control { display: none !important; }
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (e) {
        console.error("Could not modify iframe content due to same-origin policy", e);
      }
    };
    
    setIframe(iframeElement);
  }, [location.lat, location.lon, mapType]);

  // Add iframe to DOM when it's created
  useEffect(() => {
    const container = document.getElementById('map-container');
    if (container && iframe) {
      container.innerHTML = '';
      container.appendChild(iframe);
    }
  }, [iframe]);

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto my-12 text-center">
          <Card className="bg-white/90 backdrop-blur-sm p-8">
            <div className="flex flex-col items-center gap-4">
              <LockKeyhole className="h-16 w-16 text-blue-500" />
              <h2 className="text-2xl font-bold">Login Required</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Please login or register to access weather maps and other premium features.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')}>Log In</Button>
                <Button variant="outline" onClick={() => navigate('/register')}>Register Now</Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleMapTypeChange = (value: string) => {
    switch (value) {
      case 'temp': setMapType('temp_new'); break;
      case 'precipitation': setMapType('precipitation_new'); break;
      case 'wind': setMapType('wind_new'); break;
      case 'clouds': setMapType('clouds_new'); break;
      case 'pressure': setMapType('pressure_new'); break;
      default: setMapType('temp_new');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Weather Maps</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>{location.name}</span>
            </Button>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardContent className="p-6">
            <Tabs defaultValue="temp" className="w-full" onValueChange={handleMapTypeChange}>
              <TabsList className="w-full justify-start mb-6">
                <TabsTrigger value="temp" className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Temperature
                </TabsTrigger>
                <TabsTrigger value="precipitation" className="flex items-center">
                  <Droplets className="h-4 w-4 mr-2" />
                  Precipitation
                </TabsTrigger>
                <TabsTrigger value="wind" className="flex items-center">
                  <Wind className="h-4 w-4 mr-2" />
                  Wind
                </TabsTrigger>
                <TabsTrigger value="clouds" className="flex items-center">
                  <Cloud className="h-4 w-4 mr-2" />
                  Clouds
                </TabsTrigger>
                <TabsTrigger value="pressure">Pressure</TabsTrigger>
              </TabsList>
              
              <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <div id="map-container" className="w-full h-full"></div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Weather map data provided by OpenWeatherMap</p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default WeatherMap;
