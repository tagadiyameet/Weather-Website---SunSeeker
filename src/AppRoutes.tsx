
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Forecast from './pages/Forecast';
import Historical from './pages/Historical';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import About from './pages/About';
import WeatherMap from './pages/WeatherMap';
import Activities from './pages/Activities';
import Favorites from './pages/Favorites';
import WeatherAggregator from './pages/WeatherAggregator';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/forecast" element={<Forecast />} />
      <Route path="/historical" element={
        <ProtectedRoute>
          <Historical />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/weather-maps" element={<WeatherMap />} />
      <Route path="/activities" element={
        <ProtectedRoute>
          <Activities />
        </ProtectedRoute>
      } />
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Favorites />
        </ProtectedRoute>
      } />
      <Route path="/aggregator" element={
        <ProtectedRoute>
          <WeatherAggregator />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
