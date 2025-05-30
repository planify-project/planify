// API Configuration
const API_HOST = process.env.API_HOST || '192.168.14.126';
const API_PORT = process.env.API_PORT || '3000';

// Base URLs
export const API_URL = `http://${API_HOST}:${API_PORT}/api`;
export const API_BASE = API_URL;
export const SOCKET_URL = `http://${API_HOST}:${API_PORT}`;

// Socket.io Configuration
export const SOCKET_CONFIG = {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 45000,
  pingTimeout: 10000,
  pingInterval: 5000,
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  withCredentials: true,
  extraHeaders: {
    'Accept': 'application/json'
  }
};

// Export a function to get the full URL for an image
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // Remove any leading /uploads/ if it exists
  const cleanPath = path.replace(/^\/uploads\//, '');
  // Use the base URL without /api for static files
  return `${SOCKET_URL}/uploads/${cleanPath}`;
};

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RO4rZCFiC25gcQ1k4TPSl46TGeLsebDfDuM2SXgE3bY0vukSGyW6tPztYv0c7LpxMekAirZtOygmId1ZRvpevvG007hrcgTw0';

// Other configuration constants can be added here 
