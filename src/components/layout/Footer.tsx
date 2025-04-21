
import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Mail, Phone, Compass, Umbrella } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 backdrop-blur-md border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Cloud className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">SunSeeker</span>
            </Link>
            <p className="text-sm text-gray-600">
              Accurate weather forecasts and personalized recommendations for your outdoor activities.
            </p>
            
            {/* Contact Information */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2 text-blue-500" />
                <span>contact@sunseeker-weather.com</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Compass className="h-4 w-4 mr-2 text-blue-500" />
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/forecast" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Forecast
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Weather Maps
                </Link>
              </li>
              <li>
                <Link to="/activities" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Activity Recommendations
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Umbrella className="h-4 w-4 mr-2 text-blue-500" />
              Account
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                  <span className="h-1 w-1 rounded-full bg-blue-400 mr-2"></span>
                  Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} SunSeeker. All rights reserved. Powered by OpenWeatherMap.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
