// API Configuration
const API_HOST = '192.168.70.126';
const API_PORT = '3000';
export const API_BASE = `http://${API_HOST}:${API_PORT}/api`;
export const API_URL = `http://${API_HOST}:${API_PORT}`;

// Export a function to get the full URL for an image
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

// Other configuration constants can be added here 