// API and Socket configuration
const LOCAL_IP = '192.168.0.89';
const PORT = 3000;

// Base URLs
export const API_BASE = `http://${LOCAL_IP}:${PORT}/api`;
export const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

// Socket.IO configuration
export const SOCKET_CONFIG = {
  transports: ['websocket', 'polling'],
  path: '/socket.io/',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  autoConnect: true,
  forceNew: true,
  reconnection: true,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5
};

// API configuration
export const API_CONFIG = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000
};
