
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  email: string;
  preferences: Preferences;
}

interface Preferences {
  temperatureUnit: 'celsius' | 'fahrenheit';
  favoriteLocations: { id: string; name: string; lat: number; lon: number; }[];
  homeLocation?: { name: string; lat: number; lon: number; };
  activityPreferences?: {
    outdoorPreference: number;
    physicalLevel: number;
    favoriteActivities: string[];
    dislikedActivities: string[];
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
  };
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  addFavoriteLocation: (location: { name: string; lat: number; lon: number }) => void;
  removeFavoriteLocation: (locationId: string) => void;
  updatePreferences: (preferences: Partial<Preferences>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
    preferences: {
      temperatureUnit: 'celsius' as const,
      favoriteLocations: [
        { id: '1', name: 'London', lat: 51.5074, lon: -0.1278 },
        { id: '2', name: 'New York', lat: 40.7128, lon: -74.0060 },
      ],
      homeLocation: { name: 'New York', lat: 40.7128, lon: -74.0060 },
      activityPreferences: {
        outdoorPreference: 0.5,
        physicalLevel: 0.5,
        favoriteActivities: [],
        dislikedActivities: [],
        timeOfDay: 'any' as const
      }
    },
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    // First check if there are any users in localStorage
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Try to find user in localStorage first
    let foundUser = usersList.find((u: any) => u.email === email && u.password === password);
    
    // If not found, check MOCK_USERS
    if (!foundUser) {
      foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    }
    
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    
    // Save user to state and localStorage
    setUser(userWithoutPassword);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    // Get existing users from localStorage
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    const userExists = usersList.some((u: any) => u.email === email) || 
                       MOCK_USERS.some(u => u.email === email);
    
    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      email,
      password, // Store password for demo purposes
      preferences: {
        temperatureUnit: 'celsius' as const,
        favoriteLocations: [],
      },
    };

    // Add user to localStorage
    usersList.push(newUser);
    localStorage.setItem('users', JSON.stringify(usersList));

    // Log in the new user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  // Update user info
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update the user in the users list if they exist there
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedList = usersList.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, ...userData };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedList));
  };

  // Add favorite location
  const addFavoriteLocation = (location: { name: string; lat: number; lon: number }) => {
    if (!user) return;
    
    // Check if location already exists in favorites
    const locationExists = user.preferences.favoriteLocations.some(
      loc => loc.name === location.name && 
             Math.abs(loc.lat - location.lat) < 0.01 && 
             Math.abs(loc.lon - location.lon) < 0.01
    );
    
    if (locationExists) {
      toast.info(`${location.name} is already in your favorites!`);
      return;
    }
    
    const newLocation = {
      id: Math.random().toString(36).substring(2, 9),
      ...location,
    };
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        favoriteLocations: [...user.preferences.favoriteLocations, newLocation],
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Show toast notification
    toast.success(`${location.name} added to favorites!`);
    
    // Also update the user in the users list
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedList = usersList.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          preferences: {
            ...u.preferences,
            favoriteLocations: [...(u.preferences?.favoriteLocations || []), newLocation],
          },
        };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedList));
  };

  // Remove favorite location
  const removeFavoriteLocation = (locationId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        favoriteLocations: user.preferences.favoriteLocations.filter(
          loc => loc.id !== locationId
        ),
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update the user in the users list
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedList = usersList.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          preferences: {
            ...u.preferences,
            favoriteLocations: (u.preferences?.favoriteLocations || []).filter(
              (loc: any) => loc.id !== locationId
            ),
          },
        };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedList));
  };

  // Update preferences
  const updatePreferences = (preferences: Partial<Preferences>) => {
    if (!user) return;
    
    const updatedPreferences = {
      ...user.preferences,
      ...preferences,
    };
    
    const updatedUser = {
      ...user,
      preferences: updatedPreferences,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Also update the user in the users list
    const usersList = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedList = usersList.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          preferences: {
            ...(u.preferences || {}),
            ...preferences,
          },
        };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedList));
  };

  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    updateUser,
    addFavoriteLocation,
    removeFavoriteLocation,
    updatePreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
