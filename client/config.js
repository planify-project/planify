// Import all configuration from the centralized config file
export * from './configs/url';

// API and Socket configuration
const LOCAL_IP = '192.168.132.24'; // Replace with your local IP address
const PORT = 3000;
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RO4rZCFiC25gcQ1k4TPSl46TGeLsebDfDuM2SXgE3bY0vukSGyW6tPztYv0c7LpxMekAirZtOygmId1ZRvpevvG007hrcgTw0'; // Replace with your actual publishable key


// Base URLs
export const API_BASE = `http://${LOCAL_IP}:${PORT}/api`;
export const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

// Socket.IO configuration
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