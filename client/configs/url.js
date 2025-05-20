// API Configuration
const API_HOST = '192.168.43.189';
const API_PORT = '3000';

// Base URLs
export const API_URL = `http://${API_HOST}:${API_PORT}`;
export const API_BASE = `${API_URL}/api`;
export const SOCKET_URL = API_URL;

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
  return `${API_URL}${path}`;
};

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RO4rZCFiC25gcQ1k4TPSl46TGeLsebDfDuM2SXgE3bY0vukSGyW6tPztYv0c7LpxMekAirZtOygmId1ZRvpevvG007hrcgTw0';

// Other configuration constants can be added here 
