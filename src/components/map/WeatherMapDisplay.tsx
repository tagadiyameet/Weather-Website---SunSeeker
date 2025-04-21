
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, Minus } from 'lucide-react';

interface WeatherMapDisplayProps {
  lat: number;
  lon: number;
  mapType: string;
  apiKey: string;
  onCenterChange?: (lat: number, lon: number) => void;
}

const WeatherMapDisplay: React.FC<WeatherMapDisplayProps> = ({
  lat,
  lon,
  mapType,
  apiKey,
  onCenterChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState<{lat: number, lon: number}>({ lat, lon });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const dragRef = useRef<{lat: number, lon: number}>({ lat, lon });
  const [locationName, setLocationName] = useState<string>('');

  // Update center when props change
  useEffect(() => {
    console.log(`Props updated - lat: ${lat}, lon: ${lon}`);
    setCenter({ lat, lon });
    dragRef.current = { lat, lon };
    fetchLocationName(lat, lon);
  }, [lat, lon]);

  // Fetch location name using reverse geocoding
  const fetchLocationName = async (lat: number, lon: number) => {
    try {
      console.log(`Fetching location name for: ${lat}, ${lon}`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=en`
      );
      const data = await response.json();
      
      if (data.display_name) {
        // Extract city or town name from display_name
        const nameParts = data.display_name.split(',');
        setLocationName(nameParts[0].trim());
        console.log(`Location name set to: ${nameParts[0].trim()}`);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
  };

  // Convert lat/lon to tile coordinates
  const getTileCoordinates = useCallback((lat: number, lon: number, zoom: number) => {
    const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    return { x, y };
  }, []);

  // Handle start of dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mapContainerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      dragRef.current = { ...center }; // Store current center when drag starts
      
      // Change cursor to grabbing
      mapContainerRef.current.style.cursor = 'grabbing';
    }
  }, [center]);

  // Handle dragging motion
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && dragStart && mapContainerRef.current) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      // Make the map more responsive with higher sensitivity
      const sensitivity = 0.7; // Lower value = more sensitive
      const pixelsPerDegree = Math.pow(2, zoom) * 256 / 360 * sensitivity;
      const lonChange = -dx / pixelsPerDegree;
      
      const worldSize = Math.pow(2, zoom) * 256 * sensitivity;
      const pixelsPerRadian = worldSize / (2 * Math.PI);
      const dyInRadians = dy / pixelsPerRadian;
      const latRad = dragRef.current.lat * Math.PI / 180;
      const mercY = Math.log(Math.tan(Math.PI/4 + latRad/2));
      const newMercY = mercY - dyInRadians;
      const newLat = (2 * Math.atan(Math.exp(newMercY)) - Math.PI/2) * 180 / Math.PI;
      
      const newCenter = {
        lat: Math.max(-85, Math.min(85, newLat)),
        lon: ((dragRef.current.lon + lonChange + 180) % 360) - 180
      };
      
      setCenter(newCenter);
    }
  }, [isDragging, dragStart, zoom]);

  // Handle end of dragging
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      
      // Notify parent component about center change
      if (onCenterChange) {
        onCenterChange(center.lat, center.lon);
      }
      
      // Fetch location name after dragging ends
      fetchLocationName(center.lat, center.lon);
      
      // Reset cursor
      if (mapContainerRef.current) {
        mapContainerRef.current.style.cursor = 'grab';
      }
    }
  }, [center, isDragging, onCenterChange]);

  // Handle mouse leaving the map area
  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      
      // Reset cursor
      if (mapContainerRef.current) {
        mapContainerRef.current.style.cursor = 'grab';
      }
    }
  }, [isDragging]);

  // Handle zoom in button
  const handleZoomIn = useCallback(() => {
    if (zoom < 18) {
      setZoom(prev => prev + 1);
    }
  }, [zoom]);

  // Handle zoom out button
  const handleZoomOut = useCallback(() => {
    if (zoom > 0) {
      setZoom(prev => prev - 1);
    }
  }, [zoom]);

  // Go to the current location
  const goToCurrentLocation = useCallback(() => {
    console.log(`Going to current location: ${lat}, ${lon}`);
    setCenter({ lat, lon });
    setZoom(10); // Zoom in to see the location better
    fetchLocationName(lat, lon);
    
    // Notify parent of center change
    if (onCenterChange) {
      onCenterChange(lat, lon);
    }
  }, [lat, lon, onCenterChange]);

  // Render map tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    console.log(`Rendering map for center: ${center.lat}, ${center.lon}, zoom: ${zoom}`);
    mapContainerRef.current.innerHTML = '';

    const range = 3; // Number of tiles to load in each direction from center
    const tileCoords = getTileCoordinates(center.lat, center.lon, zoom);

    const mapDiv = document.createElement('div');
    mapDiv.className = 'relative w-full h-full';
    
    // Set the cursor style for the map
    mapDiv.style.cursor = 'grab';

    // Create attribution
    const attribution = document.createElement('div');
    attribution.className = 'absolute bottom-1 right-1 text-xs text-gray-700 bg-white/70 px-1 rounded z-50';
    attribution.textContent = '© OpenStreetMap & OpenWeatherMap';

    // Create base map and weather layers
    const openStreetMapLayer = document.createElement('div');
    openStreetMapLayer.className = 'absolute inset-0';
    openStreetMapLayer.style.zIndex = '1';
    
    const weatherLayer = document.createElement('div');
    weatherLayer.className = 'absolute inset-0';
    weatherLayer.style.zIndex = '2';
    weatherLayer.style.opacity = '0.7';

    // Add map tiles
    for (let yOffset = -range; yOffset <= range; yOffset++) {
      for (let xOffset = -range; xOffset <= range; xOffset++) {
        let x = tileCoords.x + xOffset;
        let y = tileCoords.y + yOffset;

        // Handle wrapping around the world for x coordinates
        x = ((x % Math.pow(2, zoom)) + Math.pow(2, zoom)) % Math.pow(2, zoom);

        // Skip tiles outside of the valid range for y
        if (y < 0 || y >= Math.pow(2, zoom)) {
          continue;
        }

        // Create and position the OpenStreetMap tile container
        const osmTileContainer = document.createElement('div');
        osmTileContainer.className = 'absolute';
        osmTileContainer.style.width = '256px';
        osmTileContainer.style.height = '256px';
        osmTileContainer.style.left = `${(range + xOffset) * 256}px`;
        osmTileContainer.style.top = `${(range + yOffset) * 256}px`;

        // Create the OpenStreetMap tile image
        const osmImg = document.createElement('img');
        osmImg.src = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
        osmImg.className = 'w-full h-full';
        osmImg.alt = 'Map Tile';
        osmImg.loading = 'eager'; // Prioritize loading these images
        osmImg.onerror = () => {
          osmImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
          osmImg.className = 'w-full h-full bg-gray-100';
        };

        // Create and position the weather tile container
        const weatherTileContainer = document.createElement('div');
        weatherTileContainer.className = 'absolute';
        weatherTileContainer.style.width = '256px';
        weatherTileContainer.style.height = '256px';
        weatherTileContainer.style.left = `${(range + xOffset) * 256}px`;
        weatherTileContainer.style.top = `${(range + yOffset) * 256}px`;

        // Create the weather tile image
        const weatherImg = document.createElement('img');
        weatherImg.src = `https://tile.openweathermap.org/map/${mapType}/${zoom}/${x}/${y}.png?appid=${apiKey}`;
        weatherImg.className = 'w-full h-full';
        weatherImg.alt = 'Weather Map Tile';
        weatherImg.style.opacity = '0.7';
        weatherImg.onerror = () => {
          weatherImg.style.display = 'none';
        };

        // Append images to their containers
        osmTileContainer.appendChild(osmImg);
        weatherTileContainer.appendChild(weatherImg);
        
        // Append containers to their respective layers
        openStreetMapLayer.appendChild(osmTileContainer);
        weatherLayer.appendChild(weatherTileContainer);
      }
    }

    // Append layers to the map div
    mapDiv.appendChild(openStreetMapLayer);
    mapDiv.appendChild(weatherLayer);

    // Add marker for current location
    const markerContainer = document.createElement('div');
    markerContainer.className = 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30';
    markerContainer.innerHTML = `
      <div class="text-red-500 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="absolute left-1/2 top-full transform -translate-x-1/2 translate-y-1 bg-white/90 px-2 py-1 rounded shadow-sm text-sm font-medium whitespace-nowrap max-w-[200px] truncate">
        ${locationName || `${center.lat.toFixed(5)}, ${center.lon.toFixed(5)}`}
      </div>
    `;

    // Add coordinate display
    const coordsDisplay = document.createElement('div');
    coordsDisplay.className = 'absolute bottom-3 left-3 bg-white/80 px-2 py-1 rounded text-sm font-mono z-20';
    coordsDisplay.textContent = `lat: ${center.lat.toFixed(5)}, lon: ${center.lon.toFixed(5)}`;

    // Add elements to the map container
    mapContainerRef.current.appendChild(mapDiv);
    mapContainerRef.current.appendChild(markerContainer);
    mapContainerRef.current.appendChild(coordsDisplay);
    mapContainerRef.current.appendChild(attribution);

    // Add legend based on map type
    const legendContainer = document.createElement('div');
    legendContainer.className = 'absolute bottom-3 right-3 bg-white/90 px-3 py-2 rounded text-sm z-20';

    let legendHtml = '';
    if (mapType === 'precipitation_new') {
      legendHtml = `
        <div class="font-medium mb-1">Precipitation, mm/h</div>
        <div class="flex items-center">
          <div class="w-full h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-purple-600 rounded-full"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span>0</span>
          <span>4</span>
          <span>10</span>
          <span>60</span>
        </div>
      `;
    } else if (mapType === 'temp_new') {
      legendHtml = `
        <div class="font-medium mb-1">Temperature, °C</div>
        <div class="flex items-center">
          <div class="w-full h-2 bg-gradient-to-r from-blue-600 via-green-400 to-red-600 rounded-full"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span>-40</span>
          <span>0</span>
          <span>40</span>
        </div>
      `;
    } else if (mapType === 'wind_new') {
      legendHtml = `
        <div class="font-medium mb-1">Wind speed, m/s</div>
        <div class="flex items-center">
          <div class="w-full h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-600 rounded-full"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span>1</span>
          <span>10</span>
          <span>30</span>
        </div>
      `;
    } else if (mapType === 'clouds_new') {
      legendHtml = `
        <div class="font-medium mb-1">Cloud coverage, %</div>
        <div class="flex items-center">
          <div class="w-full h-2 bg-gradient-to-r from-gray-100 to-gray-700 rounded-full"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      `;
    } else if (mapType === 'pressure_new') {
      legendHtml = `
        <div class="font-medium mb-1">Pressure, hPa</div>
        <div class="flex items-center">
          <div class="w-full h-2 bg-gradient-to-r from-purple-500 to-green-400 rounded-full"></div>
        </div>
        <div class="flex justify-between text-xs mt-1">
          <span>950</span>
          <span>1010</span>
          <span>1070</span>
        </div>
      `;
    }

    legendContainer.innerHTML = legendHtml;
    mapContainerRef.current.appendChild(legendContainer);
  }, [center, zoom, mapType, apiKey, getTileCoordinates, locationName]);

  return (
    <div 
      className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={mapContainerRef} className="w-full h-full">
        {/* Map will be inserted here by useEffect */}
      </div>
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Button 
          variant="secondary" 
          size="icon" 
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomIn}
          disabled={zoom >= 18}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={handleZoomOut}
          disabled={zoom <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Current location button */}
      <div className="absolute bottom-4 right-4 z-20">
        <Button
          variant="secondary"
          className="bg-white/90 hover:bg-white shadow-md"
          onClick={goToCurrentLocation}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Current Location
        </Button>
      </div>
    </div>
  );
};

export default WeatherMapDisplay;
