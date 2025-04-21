
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeather } from '@/hooks/useWeather';
import { 
  getRecommendedActivities, 
  getAllActivities,
  type Activity 
} from '@/services/activityRecommenderService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, Cloud, Clock, ThermometerSun, 
  MapPin, ArrowRight, Users, Sun, Smile, 
  Heart, Frown, Filter, LockKeyhole
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const initialUserPreferences = {
  outdoorPreference: 0.5,
  physicalLevel: 0.5,
  favoriteActivities: [] as string[],
  dislikedActivities: [] as string[],
  timeOfDay: 'any' as 'morning' | 'afternoon' | 'evening' | 'any',
};

const ActivityTags = [
  'sport', 'nature', 'water', 'exercise', 'relaxation', 'social', 
  'food', 'art', 'culture', 'entertainment', 'learning', 'challenge',
  'walking', 'views', 'climbing', 'biking', 'astronomy', 'night',
  'productivity', 'coffee', 'movies'
];

const Activities: React.FC = () => {
  const { weatherData, isLoading, error, location } = useWeather();
  const { user, isLoggedIn, updatePreferences } = useAuth();
  const navigate = useNavigate();
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [userPrefs, setUserPrefs] = useState(initialUserPreferences);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Load initial activities and preferences
  useEffect(() => {
    if (weatherData) {
      setAllActivities(getAllActivities());
      
      if (isLoggedIn && user?.preferences?.activityPreferences) {
        const savedPrefs = user.preferences.activityPreferences;
        setUserPrefs(savedPrefs);
        updateRecommendations(weatherData, savedPrefs);
      } else {
        updateRecommendations(weatherData, initialUserPreferences);
      }
    }
  }, [weatherData, user, isLoggedIn]);

  // Function to update recommendations based on current preferences
  const updateRecommendations = (weather: any, preferences: typeof userPrefs) => {
    const recommendations = getRecommendedActivities(weather, preferences);
    setActivities(recommendations);
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto my-12 text-center">
          <Card className="bg-white/90 backdrop-blur-sm p-8">
            <div className="flex flex-col items-center gap-4">
              <LockKeyhole className="h-16 w-16 text-blue-500" />
              <h2 className="text-2xl font-bold">Login Required</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-4">
                Please login or register to access activity recommendations and other premium features.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')}>Log In</Button>
                <Button variant="outline" onClick={() => navigate('/register')}>Register</Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  const handlePreferenceChange = (
    key: keyof typeof userPrefs,
    value: number | string | string[]
  ) => {
    const updatedPrefs = { ...userPrefs, [key]: value };
    setUserPrefs(updatedPrefs);
    
    if (weatherData) {
      // Immediately update recommendations when preferences change
      updateRecommendations(weatherData, updatedPrefs);
      
      // Also save to user profile if logged in
      if (isLoggedIn) {
        updatePreferences({
          activityPreferences: updatedPrefs,
        });
      }
    }
  };

  const toggleFavoriteActivity = (tag: string) => {
    const favorites = [...userPrefs.favoriteActivities];
    const index = favorites.indexOf(tag);
    
    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      const dislikedIndex = userPrefs.dislikedActivities.indexOf(tag);
      if (dislikedIndex >= 0) {
        const updatedDisliked = [...userPrefs.dislikedActivities];
        updatedDisliked.splice(dislikedIndex, 1);
        handlePreferenceChange('dislikedActivities', updatedDisliked);
      }
      favorites.push(tag);
    }
    
    handlePreferenceChange('favoriteActivities', favorites);
  };

  const toggleDislikedActivity = (tag: string) => {
    const disliked = [...userPrefs.dislikedActivities];
    const index = disliked.indexOf(tag);
    
    if (index >= 0) {
      disliked.splice(index, 1);
    } else {
      const favoriteIndex = userPrefs.favoriteActivities.indexOf(tag);
      if (favoriteIndex >= 0) {
        const updatedFavorites = [...userPrefs.favoriteActivities];
        updatedFavorites.splice(favoriteIndex, 1);
        handlePreferenceChange('favoriteActivities', updatedFavorites);
      }
      disliked.push(tag);
    }
    
    handlePreferenceChange('dislikedActivities', disliked);
  };

  const resetPreferences = () => {
    setUserPrefs(initialUserPreferences);
    
    if (weatherData) {
      updateRecommendations(weatherData, initialUserPreferences);
      
      if (isLoggedIn) {
        updatePreferences({
          activityPreferences: initialUserPreferences,
        });
      }
    }
  };

  // Filter activities based on userPrefs for the browse tab
  const filteredAllActivities = allActivities.filter(activity => {
    // Filter by category preference (indoor/outdoor)
    if (userPrefs.outdoorPreference > 0.7 && activity.category === 'indoor') return false;
    if (userPrefs.outdoorPreference < 0.3 && activity.category === 'outdoor') return false;
    
    // Filter by physical level
    const physicalDiff = Math.abs(userPrefs.physicalLevel - activity.suitability.physicalLevel);
    if (physicalDiff > 0.4) return false;
    
    // Filter by time of day
    if (userPrefs.timeOfDay !== 'any' && !activity.suitability.timeOfDay.includes(userPrefs.timeOfDay)) return false;
    
    // Filter by favorites/disliked
    if (userPrefs.dislikedActivities.some(tag => activity.tags.includes(tag))) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Activity Recommendations</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-500" />
              <span className="font-medium">{location.name}</span>
            </div>
            {weatherData && (
              <div className="flex items-center text-sm text-gray-600">
                <ThermometerSun className="mr-1 h-4 w-4" />
                <span>{Math.round(weatherData.current.temp)}°C</span>
                <span className="mx-1">•</span>
                <Cloud className="mr-1 h-4 w-4" />
                <span>{weatherData.current.weather[0].main}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="browse">Browse All</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommended">
                {activities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {activities.slice(0, 6).map((activity) => (
                      <Card key={activity.id} className="bg-white/80 backdrop-blur-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 bg-blue-100 flex items-center justify-center p-6">
                            <img 
                              src={activity.imageUrl} 
                              alt={activity.name} 
                              className="w-24 h-24 object-contain"
                            />
                          </div>
                          <CardContent className="p-6 md:w-3/4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{activity.name}</h3>
                                <p className="text-gray-600 mb-4">{activity.description}</p>
                              </div>
                              <Badge 
                                className={`${
                                  activity.category === 'outdoor' ? 'bg-green-100 text-green-800' : 
                                  activity.category === 'indoor' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {activity.category}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.tags.map((tag) => (
                                <Badge 
                                  key={tag} 
                                  variant="outline" 
                                  className={`bg-gray-50 cursor-pointer ${
                                    userPrefs.favoriteActivities.includes(tag) ? 'border-green-300 bg-green-50' : 
                                    userPrefs.dislikedActivities.includes(tag) ? 'border-red-300 bg-red-50' : ''
                                  }`}
                                  onClick={() => {
                                    if (userPrefs.favoriteActivities.includes(tag)) {
                                      toggleFavoriteActivity(tag);
                                    } else if (userPrefs.dislikedActivities.includes(tag)) {
                                      toggleDislikedActivity(tag);
                                    } else {
                                      toggleFavoriteActivity(tag);
                                    }
                                  }}
                                >
                                  {tag}
                                  {userPrefs.favoriteActivities.includes(tag) && (
                                    <Smile className="h-3 w-3 ml-1 text-green-600" />
                                  )}
                                  {userPrefs.dislikedActivities.includes(tag) && (
                                    <Frown className="h-3 w-3 ml-1 text-red-600" />
                                  )}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Best time: {activity.suitability.timeOfDay.join(', ')}</span>
                              </div>
                              
                              <div className="flex items-center text-sm">
                                <span className="mr-2 text-gray-500">Physical level:</span>
                                <div className="w-20 bg-gray-200 h-1.5 rounded">
                                  <div 
                                    className="bg-blue-500 h-1.5 rounded" 
                                    style={{ width: `${activity.suitability.physicalLevel * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-lg">
                    <Cloud className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Activities Found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any activities matching the current weather and your preferences.
                    </p>
                    <Button onClick={resetPreferences}>Reset Preferences</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="browse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAllActivities.length > 0 ? (
                    filteredAllActivities.map((activity) => (
                      <Card key={activity.id} className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start">
                            <div className="bg-blue-100 w-16 h-16 rounded-md flex items-center justify-center mr-4 shrink-0">
                              <img 
                                src={activity.imageUrl} 
                                alt={activity.name} 
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                            <div>
                              <div className="flex items-center justify-between w-full">
                                <h3 className="text-lg font-semibold">{activity.name}</h3>
                                <Badge 
                                  className={`${
                                    activity.category === 'outdoor' ? 'bg-green-100 text-green-800' : 
                                    activity.category === 'indoor' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-purple-100 text-purple-800'
                                  }`}
                                >
                                  {activity.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {activity.tags.map((tag) => (
                                  <Badge 
                                    key={tag} 
                                    variant="outline" 
                                    className={`text-xs bg-gray-50 cursor-pointer ${
                                      userPrefs.favoriteActivities.includes(tag) ? 'border-green-300 bg-green-50' : 
                                      userPrefs.dislikedActivities.includes(tag) ? 'border-red-300 bg-red-50' : ''
                                    }`}
                                    onClick={() => {
                                      if (userPrefs.favoriteActivities.includes(tag)) {
                                        toggleFavoriteActivity(tag);
                                      } else if (userPrefs.dislikedActivities.includes(tag)) {
                                        toggleDislikedActivity(tag);
                                      } else {
                                        toggleFavoriteActivity(tag);
                                      }
                                    }}
                                  >
                                    {tag}
                                    {userPrefs.favoriteActivities.includes(tag) && (
                                      <Smile className="h-3 w-3 ml-1 text-green-600" />
                                    )}
                                    {userPrefs.dislikedActivities.includes(tag) && (
                                      <Frown className="h-3 w-3 ml-1 text-red-600" />
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-2 text-center p-12 bg-white/80 backdrop-blur-sm rounded-lg">
                      <Frown className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Activities Match Your Filters</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your preferences to see more activities.
                      </p>
                      <Button onClick={resetPreferences}>Reset Preferences</Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/3">
            <Card className="bg-white/80 backdrop-blur-sm sticky top-20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <UserCircle className="h-5 w-5 mr-2 text-blue-500" />
                    Your Preferences
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden"
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {isFilterPanelOpen ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                <div className={`space-y-6 ${isFilterPanelOpen ? 'block' : 'hidden md:block'}`}>
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Sun className="h-4 w-4 mr-1 text-blue-500" />
                      Outdoor Preference
                    </h3>
                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                      <span>Indoor</span>
                      <span>Outdoor</span>
                    </div>
                    <Slider
                      value={[userPrefs.outdoorPreference * 100]}
                      onValueChange={(value) => handlePreferenceChange('outdoorPreference', value[0] / 100)}
                      max={100}
                      step={10}
                      className="mb-2"
                    />
                    <div className="text-xs text-center text-gray-600 mt-1">
                      {userPrefs.outdoorPreference < 0.3 ? 'Preferring indoor activities' : 
                       userPrefs.outdoorPreference > 0.7 ? 'Preferring outdoor activities' : 
                       'Balanced indoor/outdoor preference'}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      Physical Activity Level
                    </h3>
                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <Slider
                      value={[userPrefs.physicalLevel * 100]}
                      onValueChange={(value) => handlePreferenceChange('physicalLevel', value[0] / 100)}
                      max={100}
                      step={10}
                      className="mb-2"
                    />
                    <div className="text-xs text-center text-gray-600 mt-1">
                      {userPrefs.physicalLevel < 0.3 ? 'Low intensity activities' : 
                       userPrefs.physicalLevel > 0.7 ? 'High intensity activities' : 
                       'Moderate intensity activities'}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" />
                      Preferred Time of Day
                    </h3>
                    <Select 
                      value={userPrefs.timeOfDay}
                      onValueChange={(value) => handlePreferenceChange('timeOfDay', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time of day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any time</SelectItem>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-blue-500" />
                      Activity Preferences
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ActivityTags.map((tag) => (
                        <Badge 
                          key={tag}
                          variant={userPrefs.favoriteActivities.includes(tag) ? 'default' : 'outline'}
                          className={`cursor-pointer ${
                            userPrefs.favoriteActivities.includes(tag) 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                          onClick={() => toggleFavoriteActivity(tag)}
                        >
                          {tag}
                          {userPrefs.favoriteActivities.includes(tag) && (
                            <Smile className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Frown className="h-4 w-4 mr-1 text-blue-500" />
                      Activities to Avoid
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ActivityTags.map((tag) => (
                        <Badge 
                          key={`dislike-${tag}`}
                          variant={userPrefs.dislikedActivities.includes(tag) ? 'default' : 'outline'}
                          className={`cursor-pointer ${
                            userPrefs.dislikedActivities.includes(tag) 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-white hover:bg-gray-100'
                          }`}
                          onClick={() => toggleDislikedActivity(tag)}
                        >
                          {tag}
                          {userPrefs.dislikedActivities.includes(tag) && (
                            <Frown className="h-3 w-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={resetPreferences}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Activities;
