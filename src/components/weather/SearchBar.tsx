
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { getLocationByName, getCurrentPosition, getCityNameByCoords } from '@/services/weatherService';
import { useWeather } from '@/hooks/useWeather';

interface SearchBarProps {
  className?: string;
  preventRedirect?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '', preventRedirect = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; lat: number; lon: number; country: string; state?: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setLocation } = useWeather();

  useEffect(() => {
    // Add event listener to close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const locations = await getLocationByName(searchTerm);
        setSuggestions(locations);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setSearchTerm(name);
    setShowSuggestions(false);
    setLocation({ lat, lon, name });
    
    // Only navigate to home page if preventRedirect is false
    if (!preventRedirect) {
      navigate('/');
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const cityName = await getCityNameByCoords(latitude, longitude);
      
      setSearchTerm(cityName);
      setLocation({ lat: latitude, lon: longitude, name: cityName });
      
      // Only navigate to home page if preventRedirect is false
      if (!preventRedirect) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      alert('Unable to get your current location. Please check your browser permissions.');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            className="search-input pr-10"
          />
          {isSearching ? (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          ) : (
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-2" 
          onClick={handleUseCurrentLocation}
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-[100] mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto animate-fade-in"
          style={{ position: 'absolute', top: '100%', left: 0 }}
        >
          {suggestions.map((location, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleLocationSelect(location.lat, location.lon, location.name)}
            >
              <div>
                <div className="font-medium">{location.name}</div>
                <div className="text-xs text-gray-500">
                  {location.state && `${location.state}, `}{location.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
