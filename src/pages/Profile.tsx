
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useWeather } from '@/hooks/useWeather';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { MapPin, User, Settings, X, Check, Home, Lock } from 'lucide-react';
import SearchBar from '@/components/weather/SearchBar';
import { getLocationByName } from '@/services/weatherService';

const Profile: React.FC = () => {
  const { user, isLoggedIn, logout, updatePreferences, updateUser, removeFavoriteLocation } = useAuth();
  const { temperatureUnit, setTemperatureUnit, location } = useWeather();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedHomeLocation, setSelectedHomeLocation] = useState<{
    name: string;
    lat: number;
    lon: number;
  } | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (user) {
      setEmail(user.email);
      setUsername(user.username);
      if (user.preferences.homeLocation) {
        setSelectedHomeLocation(user.preferences.homeLocation);
      }
    }
  }, [user, isLoggedIn, navigate]);

  const handleUpdateProfile = () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      updateUser({
        username,
        email,
      });
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    if (!user) return;
    
    // Simple validation
    if (!currentPassword) {
      toast({
        title: 'Error',
        description: 'Please enter your current password.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'New password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    // In a real app, this would call an API to update the password
    // For demo purposes, we'll just simulate a successful update
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully changed.',
      });
    }, 1000);
  };

  const handleTemperatureUnitChange = (value: 'celsius' | 'fahrenheit') => {
    setTemperatureUnit(value);
    
    if (user) {
      updatePreferences({
        temperatureUnit: value,
      });
    }
    
    toast({
      title: 'Preferences Updated',
      description: `Temperature unit changed to ${value === 'celsius' ? 'Celsius' : 'Fahrenheit'}.`,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length < 2) return;
    
    setSearching(true);
    try {
      const results = await getLocationByName(searchTerm);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search for locations. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSetHomeLocation = (location: { name: string; lat: number; lon: number }) => {
    setSelectedHomeLocation(location);
    updatePreferences({
      homeLocation: {
        name: location.name,
        lat: location.lat,
        lon: location.lon,
      },
    });
    
    toast({
      title: 'Home Location Updated',
      description: `Your home location has been set to ${location.name}.`,
    });
  };

  const handleRemoveLocation = (locationId: string) => {
    removeFavoriteLocation(locationId);
    
    toast({
      title: 'Location Removed',
      description: 'The location has been removed from your favorites.',
    });
  };

  if (!isLoggedIn || !user) {
    return null; // Redirect is handled in the useEffect
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  Profile Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="mt-2"
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-blue-500" />
                  Change Password
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="mt-2"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm mb-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-500" />
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Temperature Unit</h3>
                    <RadioGroup 
                      value={temperatureUnit} 
                      onValueChange={(value) => handleTemperatureUnitChange(value as 'celsius' | 'fahrenheit')}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="celsius" id="celsius" />
                        <Label htmlFor="celsius">Celsius (°C)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                        <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Home className="h-4 w-4 mr-1 text-blue-500" />
                      Home Location
                    </h3>
                    {selectedHomeLocation ? (
                      <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md">
                        <div>
                          <p className="font-medium">{selectedHomeLocation.name}</p>
                          <p className="text-sm text-gray-500">
                            {selectedHomeLocation.lat.toFixed(4)}, {selectedHomeLocation.lon.toFixed(4)}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedHomeLocation(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                          Set your home location to see weather for your area when you log in.
                        </p>
                        <div className="flex">
                          <Input 
                            placeholder="Search for a city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mr-2"
                          />
                          <Button 
                            onClick={handleSearch}
                            disabled={searching || searchTerm.trim().length < 2}
                          >
                            {searching ? 'Searching...' : 'Search'}
                          </Button>
                        </div>
                        
                        {searchResults.length > 0 && (
                          <div className="mt-2 border rounded-md divide-y max-h-60 overflow-y-auto">
                            {searchResults.map((result, index) => (
                              <div 
                                key={index}
                                className="p-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                                onClick={() => handleSetHomeLocation({
                                  name: result.name,
                                  lat: result.lat,
                                  lon: result.lon
                                })}
                              >
                                <div>
                                  <p className="font-medium">{result.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {result.state && `${result.state}, `}{result.country}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" className="ml-2">
                                  <Check className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-white/90 backdrop-blur-sm sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                  Favorite Locations
                </h2>
                
                {user.preferences.favoriteLocations.length > 0 ? (
                  <div className="space-y-3">
                    {user.preferences.favoriteLocations.map((favLocation) => (
                      <div 
                        key={favLocation.id}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div>
                          <p className="font-medium">{favLocation.name}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveLocation(favLocation.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleSetHomeLocation({
                              name: favLocation.name,
                              lat: favLocation.lat,
                              lon: favLocation.lon
                            })}
                            className={`h-7 w-7 p-0 ${selectedHomeLocation && 
                              selectedHomeLocation.name === favLocation.name ? 
                              'text-blue-500 bg-blue-50' : 'text-gray-500'}`}
                            title="Set as home location"
                          >
                            <Home className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    You haven't saved any favorite locations yet. Search for a location and click the heart icon to add it to your favorites.
                  </p>
                )}
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
