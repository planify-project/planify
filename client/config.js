// Get the local IP address from environment or use localhost
const getLocalIP = () => {
  // Use the same IP address as your API_BASE in EventSpaceAPI.js
  return '192.168.0.89';
};

// API and Socket configuration
export const API_BASE = 'http://192.168.0.89:3000/api';
export const SOCKET_URL = 'http://192.168.0.89:3000';
