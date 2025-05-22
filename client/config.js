// Import all configuration from the centralized config file
export * from './configs/url';

// API and Socket configuration
export const API_URL = 'http://192.168.1.189:3000/api';
export const SOCKET_URL = 'http://192.168.1.189:3000';

export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RO4rZCFiC25gcQ1k4TPSl46TGeLsebDfDuM2SXgE3bY0vukSGyW6tPztYv0c7LpxMekAirZtOygmId1ZRvpevvG007hrcgTw0'; // Replace with your actual publishable key


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