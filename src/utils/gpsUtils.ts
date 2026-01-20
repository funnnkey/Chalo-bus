// Utility functions for GPS and distance calculations

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateHaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 */
export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a point is within a given radius of another point
 * @param currentLat Current latitude
 * @param currentLon Current longitude
 * @param targetLat Target latitude
 * @param targetLon Target longitude
 * @param radiusKm Radius in kilometers
 * @returns True if within radius
 */
export const isWithinRadius = (
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number,
  radiusKm: number
): boolean => {
  const distance = calculateHaversineDistance(currentLat, currentLon, targetLat, targetLon);
  return distance <= radiusKm;
};

/**
 * Format distance for display
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  } else if (distanceKm < 10) {
    return `${Math.round(distanceKm * 10) / 10}km`;
  } else {
    return `${Math.round(distanceKm)}km`;
  }
};

/**
 * Get estimated time to reach a destination based on distance and average speed
 * @param distanceKm Distance in kilometers
 * @param averageSpeedKmh Average speed in km/h (default: 60 km/h for buses)
 * @returns Estimated time in minutes
 */
export const estimateTravelTime = (distanceKm: number, averageSpeedKmh: number = 60): number => {
  const hours = distanceKm / averageSpeedKmh;
  return Math.round(hours * 60);
};

/**
 * Check if GPS coordinates are valid
 * @param lat Latitude
 * @param lon Longitude
 * @returns True if coordinates are valid
 */
export const isValidGPSCoordinate = (lat: number, lon: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};