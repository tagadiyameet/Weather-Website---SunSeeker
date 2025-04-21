
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Umbrella, Wind, ThermometerSun, MapPin, Users, Settings } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto my-10">
        <h1 className="text-3xl font-bold mb-6 text-center">About SunSeeker</h1>
        
        <Card className="bg-white/80 backdrop-blur-sm border-t-4 border-t-blue-500 mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Cloud className="h-6 w-6 mr-2 text-blue-500" />
              Our Mission
            </h2>
            <p className="text-gray-700 mb-6">
              SunSeeker was developed to provide accurate, comprehensive, and user-friendly weather information to help users plan their activities and stay safe in all weather conditions. We believe that weather information should not only be accurate but also accessible and personalized to meet individual needs.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Sun className="h-6 w-6 mr-2 text-yellow-500" />
              Features & Capabilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start">
                <CloudRain className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Current Weather Data</h3>
                  <p className="text-gray-600 text-sm">Accurate temperature, wind speed, and weather conditions for any location worldwide.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Umbrella className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Detailed Forecasts</h3>
                  <p className="text-gray-600 text-sm">Hourly predictions for the next 24 hours and daily forecasts for 8 days ahead.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ThermometerSun className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Health & Safety Metrics</h3>
                  <p className="text-gray-600 text-sm">UV index and air quality information with personalized health recommendations.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Wind className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Activity Recommendations</h3>
                  <p className="text-gray-600 text-sm">Intelligent suggestions for outdoor activities based on weather conditions and your preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">Weather Maps</h3>
                  <p className="text-gray-600 text-sm">Interactive weather maps showing precipitation, temperature, and pressure patterns.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium">User Profiles</h3>
                  <p className="text-gray-600 text-sm">Personalized experience with saved locations, preferences, and customized recommendations.</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-gray-500" />
              Technology
            </h2>
            <p className="text-gray-700 mb-4">
              SunSeeker is powered by the OpenWeatherMap API, providing real-time weather data from thousands of weather stations around the world. Our intelligent activity recommendation system uses advanced algorithms to analyze weather patterns and user preferences to suggest the most suitable activities.
            </p>
            <p className="text-gray-700">
              The application is built using modern web technologies to ensure fast loading times, responsive design, and a seamless user experience across all devices.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
