import serverInstance from "./api-config";

/**
 * Convert relative image URLs to absolute URLs
 * This ensures images stored at /uploads/... can be loaded properly
 */
export const convertImageUrlsToAbsolute = (data) => {
  if (!data) return data;
  
  const baseURL = serverInstance.defaults.baseURL;
  const basePath = baseURL.replace(/\/v1\/?$/, ''); // Remove /v1 to get base server URL
  
  if (Array.isArray(data)) {
    return data.map(item => {
      if (item && typeof item === 'object') {
        return convertImageUrlsToAbsolute(item);
      }
      return item;
    });
  } else if (typeof data === 'object') {
    const converted = { ...data };
    
    // Convert image_url fields
    if (converted.image_url && !converted.image_url.startsWith('http')) {
      converted.image_url = `${basePath}${converted.image_url}`;
    }
    
    // Convert any other image-related fields
    Object.keys(converted).forEach(key => {
      if (
        (key.includes('image') || key.includes('photo') || key.includes('img')) &&
        typeof converted[key] === 'string' &&
        !converted[key].startsWith('http') &&
        converted[key].startsWith('/')
      ) {
        converted[key] = `${basePath}${converted[key]}`;
      }
    });
    
    return converted;
  }
  
  return data;
};

/**
 * Get the base path for constructing absolute URLs
 */
export const getBasePath = () => {
  const baseURL = serverInstance.defaults.baseURL;
  return baseURL.replace(/\/v1\/?$/, '');
};
