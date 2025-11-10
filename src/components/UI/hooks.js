// Replacement for @mui/material hooks
import { useEffect, useState } from 'react';

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Check initial value
    setMatches(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export const useTheme = () => {
  // Return a basic theme object that mimics @mui/material theme
  return {
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      error: { main: '#f44336' },
      warning: { main: '#ff9800' },
      success: { main: '#4caf50' },
      info: { main: '#2196f3' },
    },
    spacing: (factor) => `${8 * factor}px`,
    breakpoints: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1264,
      xl: 1920,
    },
  };
};

export default { useMediaQuery, useTheme };
