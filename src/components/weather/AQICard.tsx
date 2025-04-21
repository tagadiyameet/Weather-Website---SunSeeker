
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AirQualityData } from '@/services/weatherService';
import { Progress } from '@/components/ui/progress';
import { Droplets } from 'lucide-react';

interface AQICardProps {
  airQuality: AirQualityData | null;
  className?: string;
}

const AQICard: React.FC<AQICardProps> = ({ airQuality, className }) => {
  if (!airQuality) {
    return (
      <Card className={`bg-white/80 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Air Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Air quality data not available</p>
        </CardContent>
      </Card>
    );
  }

  // API returns a value from 1-5, we need to display it as 0-5
  const apiAqi = airQuality.main.aqi; // Original AQI value (1-5)
  
  // Map the API AQI (1-5) to our display AQI (0-5)
  // 1 = Very Good (0), 2 = Good (1), 3 = Moderate (2), 4 = Poor (3), 5 = Very Poor (4)
  const displayAqi = apiAqi - 1;
  
  // AQI levels with colors and advice
  const aqiLevels = [
    { level: 'Very Good', color: 'bg-green-600', textColor: 'text-green-600', advice: 'Air quality is excellent. Enjoy outdoor activities.' },
    { level: 'Good', color: 'bg-green-500', textColor: 'text-green-500', advice: 'Air quality is good. Ideal for outdoor activities.' },
    { level: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-500', advice: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.' },
    { level: 'Bad', color: 'bg-orange-500', textColor: 'text-orange-500', advice: 'People with respiratory issues should limit outdoor activity.' },
    { level: 'Unhealthy', color: 'bg-red-500', textColor: 'text-red-500', advice: 'Everyone may begin to experience health effects. Limit prolonged outdoor exertion.' },
    { level: 'Hazardous', color: 'bg-purple-600', textColor: 'text-purple-600', advice: 'Health alert: Everyone may experience more serious health effects. Avoid outdoor activities.' }
  ];
  
  const aqiInfo = aqiLevels[displayAqi];
  
  // Get the key pollutants from the components
  const components = airQuality.components;
  const pollutants = [
    { name: 'PM2.5', value: components.pm2_5, unit: 'μg/m³', threshold: 10 },
    { name: 'PM10', value: components.pm10, unit: 'μg/m³', threshold: 20 },
    { name: 'O₃', value: components.o3, unit: 'μg/m³', threshold: 100 },
    { name: 'NO₂', value: components.no2, unit: 'μg/m³', threshold: 40 },
    { name: 'SO₂', value: components.so2, unit: 'μg/m³', threshold: 20 },
    { name: 'CO', value: components.co / 1000, unit: 'mg/m³', threshold: 4 }
  ];

  // Sort by their values for primary pollutant identification
  const sortedPollutants = [...pollutants].sort((a, b) => 
    (b.value / b.threshold) - (a.value / a.threshold)
  );
  
  const mainPollutant = sortedPollutants[0];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Droplets className="h-6 w-6 text-blue-500 mr-3" />
          <h3 className="text-xl font-semibold">Air Quality</h3>
        </div>
        
        <div className="flex items-center mb-4">
          <div 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 ${aqiInfo.color}`}
          >
            {displayAqi}
          </div>
          <div>
            <h4 className="text-lg font-medium">{aqiInfo.level}</h4>
            <div className="flex mt-1">
              {aqiLevels.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-7 h-2 mr-1 rounded-sm ${i === displayAqi ? aqiLevels[i].color : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg">
          <h5 className="text-sm font-medium uppercase text-gray-500 mb-2">Health Advice</h5>
          <p className="text-gray-800">{aqiInfo.advice}</p>
        </div>
        
        <div className="mt-4">
          <h5 className="text-sm font-medium uppercase text-gray-500 mb-2">Key Pollutants</h5>
          <div className="grid grid-cols-3 gap-2">
            {sortedPollutants.slice(0, 3).map((pollutant, index) => (
              <div key={index} className="bg-white/60 p-3 rounded-lg">
                <p className="text-sm font-medium">{pollutant.name}</p>
                <p className="text-lg">{pollutant.value.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{pollutant.unit}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 bg-white/60 p-3 rounded-lg">
          <p className="text-sm font-medium">Main Pollutant</p>
          <p className={`text-lg ${mainPollutant.value > mainPollutant.threshold ? 'text-red-500 font-semibold' : 'text-green-500'}`}>
            {mainPollutant.name}: {mainPollutant.value.toFixed(1)} {mainPollutant.unit}
          </p>
          <p className="text-xs text-gray-500">
            {mainPollutant.value > mainPollutant.threshold
              ? `Exceeds recommended threshold of ${mainPollutant.threshold} ${mainPollutant.unit}`
              : `Within recommended threshold of ${mainPollutant.threshold} ${mainPollutant.unit}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AQICard;
