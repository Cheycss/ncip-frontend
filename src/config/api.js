// Centralized API configuration
export const getApiBaseUrl = () => {
  // Production: Use Render backend
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://ncip-backend.onrender.com/api';
  }
  
  // Local development: Use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  
  // Network access: Use current IP
  return `http://${window.location.hostname}:3001/api`;
};

export const getApiUrl = () => {
  // Production: Use Render backend
  if (window.location.hostname.includes('vercel.app')) {
    return 'https://ncip-backend.onrender.com';
  }
  
  // Local development: Use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }
  
  // Network access: Use current IP
  return `http://${window.location.hostname}:3001`;
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = getApiUrl();
