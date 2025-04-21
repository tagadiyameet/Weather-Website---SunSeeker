
import React from 'react';
import './App.css';
import { AuthProvider } from './hooks/useAuth';
import { WeatherProvider } from './hooks/useWeather';
import { WeatherAggregatorProvider } from './hooks/useWeatherAggregator';
import AppRoutes from './AppRoutes';
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <WeatherProvider>
          <WeatherAggregatorProvider>
            <AppRoutes />
          </WeatherAggregatorProvider>
        </WeatherProvider>
      </AuthProvider>
      <Toaster />
    </div>
  );
}

export default App;
