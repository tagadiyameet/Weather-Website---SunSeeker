
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Cloud, User, LogIn, Menu, X, Map, Info, Activity, Heart, Search, Thermometer, BarChart3, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '../weather/SearchBar';
import { useAuth } from '@/hooks/useAuth';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="relative">
                <Cloud className="h-8 w-8 text-blue-600" />
                <Sun className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">SunSeeker</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center flex-1 px-8">
            <SearchBar className="w-full max-w-md mx-auto" />
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center">
              <Link 
                to="/" 
                className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                <div className="flex flex-col items-center">
                  <Thermometer className="h-4 w-4 mb-1" />
                  <span>Weather</span>
                </div>
              </Link>
              
              <Link 
                to="/forecast" 
                className={`px-3 py-2 text-sm font-medium ${isActive('/forecast') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                <div className="flex flex-col items-center">
                  <Cloud className="h-4 w-4 mb-1" />
                  <span>Forecast</span>
                </div>
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link 
                    to="/historical" 
                    className={`px-3 py-2 text-sm font-medium ${isActive('/historical') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <History className="h-4 w-4 mb-1" />
                      <span>Historical</span>
                    </div>
                  </Link>
                </>
              )}
              
              <Link 
                to="/weather-maps" 
                className={`px-3 py-2 text-sm font-medium ${isActive('/weather-maps') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                <div className="flex flex-col items-center">
                  <Map className="h-4 w-4 mb-1" />
                  <span>Weather Maps</span>
                </div>
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link 
                    to="/aggregator" 
                    className={`px-3 py-2 text-sm font-medium ${isActive('/aggregator') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-4 w-4 mb-1" />
                      <span>Aggregator</span>
                    </div>
                  </Link>
                
                  <Link 
                    to="/activities" 
                    className={`px-3 py-2 text-sm font-medium ${isActive('/activities') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <Activity className="h-4 w-4 mb-1" />
                      <span>Activities</span>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/favorites" 
                    className={`px-3 py-2 text-sm font-medium ${isActive('/favorites') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
                  >
                    <div className="flex flex-col items-center">
                      <Heart className="h-4 w-4 mb-1" />
                      <span>Favorites</span>
                    </div>
                  </Link>
                </>
              )}
              
              <Link 
                to="/about" 
                className={`px-3 py-2 text-sm font-medium ${isActive('/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} transition-colors`}
              >
                <div className="flex flex-col items-center">
                  <Info className="h-4 w-4 mb-1" />
                  <span>About</span>
                </div>
              </Link>
            </nav>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 ml-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon" className="rounded-full bg-blue-50 hover:bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 ml-2">
                <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <SearchBar className="w-full mb-3" />
            
            <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Thermometer className="h-5 w-5 text-blue-500" />
              <span>Weather</span>
            </Link>
            
            <Link to="/forecast" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Cloud className="h-5 w-5 text-blue-500" />
              <span>Forecast</span>
            </Link>
            
            {isLoggedIn && (
              <Link to="/historical" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                <History className="h-5 w-5 text-blue-500" />
                <span>Historical</span>
              </Link>
            )}
            
            <Link to="/weather-maps" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Map className="h-5 w-5 text-blue-500" />
              <span>Weather Maps</span>
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/aggregator" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span>Weather Aggregator</span>
                </Link>
                
                <Link to="/activities" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <span>Activities</span>
                </Link>
                
                <Link to="/favorites" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <Heart className="h-5 w-5 text-blue-500" />
                  <span>Favorites</span>
                </Link>
                
                <Link to="/profile" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                  <User className="h-5 w-5 text-blue-500" />
                  <span>Profile</span>
                </Link>
              </>
            )}
            
            <Link to="/about" className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600">
              <Info className="h-5 w-5 text-blue-500" />
              <span>About</span>
            </Link>
            
            {!isLoggedIn ? (
              <div className="flex flex-col space-y-2 mt-3">
                <Button variant="outline" onClick={() => navigate('/login')} className="border-blue-200 text-blue-700">
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
                  Register
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full mt-2 border-blue-200 text-blue-700" onClick={logout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
