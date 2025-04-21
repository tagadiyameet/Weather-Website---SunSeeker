
import { WeatherData } from './weatherService';

// Define activity types and their requirements
export interface Activity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'outdoor' | 'indoor' | 'both';
  tags: string[];
  suitability: {
    // Weather conditions
    tempMin: number;
    tempMax: number;
    rainMax: number;
    snowMax: number;
    windMax: number;
    uvIndexMax: number;
    
    // Time conditions 
    timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[];
    
    // Physical effort (0-1)
    physicalLevel: number;
    
    // Outdoor preference rating (0-1)
    outdoorPreference: number;
    
    // Season rating (0-1): how good is this activity for each season
    // 0 = bad for this season, 1 = perfect for this season
    season: number;
  };
}

// Sample activities database
const activities: Activity[] = [
  {
    id: '1',
    name: 'Beach Day',
    description: 'Enjoy swimming, sunbathing, and building sandcastles at the beach.',
    imageUrl: '/placeholder.svg',
    category: 'outdoor',
    tags: ['water', 'swimming', 'relaxation', 'sun'],
    suitability: {
      tempMin: 25,
      tempMax: 35,
      rainMax: 0,
      snowMax: 0,
      windMax: 15,
      uvIndexMax: 8,
      timeOfDay: ['morning', 'afternoon'],
      physicalLevel: 0.4,
      outdoorPreference: 0.9,
      season: 1.0
    }
  },
  {
    id: '2',
    name: 'Hiking',
    description: 'Explore nature trails and enjoy scenic views while hiking.',
    imageUrl: '/placeholder.svg',
    category: 'outdoor',
    tags: ['nature', 'walking', 'exercise', 'views'],
    suitability: {
      tempMin: 10,
      tempMax: 28,
      rainMax: 1,
      snowMax: 5,
      windMax: 20,
      uvIndexMax: 7,
      timeOfDay: ['morning', 'afternoon'],
      physicalLevel: 0.7,
      outdoorPreference: 0.8,
      season: 0.8
    }
  },
  {
    id: '3',
    name: 'Museum Visit',
    description: 'Explore art, history, and culture at a local museum.',
    imageUrl: '/placeholder.svg',
    category: 'indoor',
    tags: ['art', 'history', 'culture', 'education'],
    suitability: {
      tempMin: -10,
      tempMax: 40,
      rainMax: 100,
      snowMax: 100,
      windMax: 100,
      uvIndexMax: 12,
      timeOfDay: ['morning', 'afternoon', 'evening'],
      physicalLevel: 0.2,
      outdoorPreference: 0.1,
      season: 0.5
    }
  },
  {
    id: '4',
    name: 'Indoor Rock Climbing',
    description: 'Challenge yourself with indoor rock climbing at a local gym.',
    imageUrl: '/placeholder.svg',
    category: 'indoor',
    tags: ['sport', 'climbing', 'exercise', 'challenge'],
    suitability: {
      tempMin: -10,
      tempMax: 40,
      rainMax: 100,
      snowMax: 100,
      windMax: 100,
      uvIndexMax: 12,
      timeOfDay: ['morning', 'afternoon', 'evening'],
      physicalLevel: 0.8,
      outdoorPreference: 0.3,
      season: 0.5
    }
  },
  {
    id: '5',
    name: 'Picnic in the Park',
    description: 'Enjoy a relaxing picnic with food and drinks in a local park.',
    imageUrl: '/placeholder.svg',
    category: 'outdoor',
    tags: ['food', 'relaxation', 'nature', 'social'],
    suitability: {
      tempMin: 15,
      tempMax: 30,
      rainMax: 0,
      snowMax: 0,
      windMax: 15,
      uvIndexMax: 6,
      timeOfDay: ['morning', 'afternoon'],
      physicalLevel: 0.2,
      outdoorPreference: 0.7,
      season: 0.9
    }
  },
  {
    id: '6',
    name: 'Movie Marathon',
    description: 'Stay in and enjoy a marathon of your favorite movies or TV shows.',
    imageUrl: '/placeholder.svg',
    category: 'indoor',
    tags: ['entertainment', 'relaxation', 'movies', 'social'],
    suitability: {
      tempMin: -30,
      tempMax: 45,
      rainMax: 100,
      snowMax: 100,
      windMax: 100,
      uvIndexMax: 12,
      timeOfDay: ['afternoon', 'evening', 'night'],
      physicalLevel: 0.1,
      outdoorPreference: 0.0,
      season: 0.5
    }
  },
  {
    id: '7',
    name: 'Cycling',
    description: 'Go for a bike ride through scenic routes and trails.',
    imageUrl: '/placeholder.svg',
    category: 'outdoor',
    tags: ['sport', 'biking', 'exercise', 'nature'],
    suitability: {
      tempMin: 10,
      tempMax: 30,
      rainMax: 0,
      snowMax: 0,
      windMax: 20,
      uvIndexMax: 6,
      timeOfDay: ['morning', 'afternoon'],
      physicalLevel: 0.6,
      outdoorPreference: 0.8,
      season: 0.7
    }
  },
  {
    id: '8',
    name: 'Cooking Class',
    description: 'Learn new recipes and cooking techniques in a cooking class.',
    imageUrl: '/placeholder.svg',
    category: 'indoor',
    tags: ['food', 'cooking', 'learning', 'social'],
    suitability: {
      tempMin: -10,
      tempMax: 40,
      rainMax: 100,
      snowMax: 100,
      windMax: 100,
      uvIndexMax: 12,
      timeOfDay: ['morning', 'afternoon', 'evening'],
      physicalLevel: 0.3,
      outdoorPreference: 0.2,
      season: 0.5
    }
  },
  {
    id: '9',
    name: 'Stargazing',
    description: 'Observe stars, planets, and constellations in the night sky.',
    imageUrl: '/placeholder.svg',
    category: 'outdoor',
    tags: ['astronomy', 'night', 'relaxation', 'nature'],
    suitability: {
      tempMin: 5,
      tempMax: 25,
      rainMax: 0,
      snowMax: 5,
      windMax: 10,
      uvIndexMax: 1,
      timeOfDay: ['night'],
      physicalLevel: 0.2,
      outdoorPreference: 0.6,
      season: 0.6
    }
  },
  {
    id: '10',
    name: 'Coffee Shop Work/Study',
    description: 'Change your environment by working or studying at a cozy coffee shop.',
    imageUrl: '/placeholder.svg',
    category: 'indoor',
    tags: ['work', 'coffee', 'study', 'productivity'],
    suitability: {
      tempMin: -10,
      tempMax: 40,
      rainMax: 100,
      snowMax: 100,
      windMax: 100,
      uvIndexMax: 12,
      timeOfDay: ['morning', 'afternoon'],
      physicalLevel: 0.1,
      outdoorPreference: 0.3,
      season: 0.5
    }
  }
];

// Function to get all activities
export const getAllActivities = (): Activity[] => {
  return activities;
};

// Function to get recommended activities based on weather
export const getRecommendedActivities = (
  weatherData: WeatherData,
  userPreferences?: {
    outdoorPreference?: number;
    physicalLevel?: number;
    favoriteActivities?: string[];
    dislikedActivities?: string[];
    timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'any';
  }
): Activity[] => {
  if (!weatherData) return [];

  const current = weatherData.current;
  const temp = current.temp;
  const rainPrecipitation = current.weather[0].main === 'Rain' ? current.rain?.['1h'] || 0 : 0;
  const snowPrecipitation = current.weather[0].main === 'Snow' ? current.snow?.['1h'] || 0 : 0;
  const windSpeed = current.wind_speed;
  const uvIndex = current.uvi;
  
  // Determine time of day
  const dt = current.dt;
  const sunrise = current.sunrise;
  const sunset = current.sunset;
  
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  
  if (dt < sunrise || dt > sunset + 7200) { // 2 hours after sunset
    timeOfDay = 'night';
  } else if (dt < sunrise + 14400) { // 4 hours after sunrise
    timeOfDay = 'morning';
  } else if (dt < sunset - 7200) { // 2 hours before sunset
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }

  // Calculate season based on month (Northern Hemisphere)
  const date = new Date(dt * 1000);
  const month = date.getMonth();
  let season: 'winter' | 'spring' | 'summer' | 'fall';
  
  if (month >= 2 && month <= 4) {
    season = 'spring';
  } else if (month >= 5 && month <= 7) {
    season = 'summer';
  } else if (month >= 8 && month <= 10) {
    season = 'fall';
  } else {
    season = 'winter';
  }
  
  // Get season rating (0-1)
  const getSeasonRating = (activitySeason: number): number => {
    switch (season) {
      case 'winter': return 1 - activitySeason;
      case 'spring': return activitySeason * 0.8;
      case 'summer': return activitySeason;
      case 'fall': return activitySeason * 0.6;
      default: return 0.5;
    }
  };

  // Filter activities based on weather conditions
  let recommendedActivities = activities.filter(activity => {
    // Basic weather condition checks
    if (temp < activity.suitability.tempMin || temp > activity.suitability.tempMax) return false;
    if (rainPrecipitation > activity.suitability.rainMax) return false;
    if (snowPrecipitation > activity.suitability.snowMax) return false;
    if (windSpeed > activity.suitability.windMax) return false;
    if (uvIndex > activity.suitability.uvIndexMax) return false;
    
    // Time of day check
    if (userPreferences?.timeOfDay && userPreferences.timeOfDay !== 'any') {
      return activity.suitability.timeOfDay.includes(userPreferences.timeOfDay);
    } else {
      return activity.suitability.timeOfDay.includes(timeOfDay);
    }
  });

  // Apply user preferences to scoring if available
  if (userPreferences) {
    // Score each activity based on user preferences
    const scoredActivities = recommendedActivities.map(activity => {
      let score = 1.0; // Base score
      
      // Adjust score based on outdoor preference
      if (userPreferences.outdoorPreference !== undefined) {
        const outdoorPreferenceMatch = 1 - Math.abs(userPreferences.outdoorPreference - activity.suitability.outdoorPreference);
        score *= (0.7 + (outdoorPreferenceMatch * 0.3)); // Weight: 30%
      }
      
      // Adjust score based on physical level
      if (userPreferences.physicalLevel !== undefined) {
        const physicalLevelMatch = 1 - Math.abs(userPreferences.physicalLevel - activity.suitability.physicalLevel);
        score *= (0.7 + (physicalLevelMatch * 0.3)); // Weight: 30%
      }
      
      // Adjust score based on favorite activities
      if (userPreferences.favoriteActivities && userPreferences.favoriteActivities.length > 0) {
        const hasMatchingTag = activity.tags.some(tag => 
          userPreferences.favoriteActivities!.includes(tag)
        );
        if (hasMatchingTag) {
          score *= 1.3; // Boost score by 30%
        }
      }
      
      // Adjust score based on disliked activities
      if (userPreferences.dislikedActivities && userPreferences.dislikedActivities.length > 0) {
        const hasMatchingTag = activity.tags.some(tag => 
          userPreferences.dislikedActivities!.includes(tag)
        );
        if (hasMatchingTag) {
          score *= 0.5; // Reduce score by 50%
        }
      }
      
      // Apply season rating
      const seasonScore = getSeasonRating(activity.suitability.season);
      score *= (0.8 + (seasonScore * 0.2)); // Weight: 20%
      
      return { activity, score };
    });
    
    // Sort by score (highest first) and extract activities
    recommendedActivities = scoredActivities
      .sort((a, b) => b.score - a.score)
      .map(item => item.activity);
  }

  return recommendedActivities;
};
