// API and Socket configuration
const LOCAL_IP = '192.168.1.237'; // Your machine's actual IP address from ipconfig
const PORT = 3000;

// Base URLs
export const API_BASE = `http://${LOCAL_IP}:${PORT}/api`;
export const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

// Socket.IO configuration
export const SOCKET_CONFIG = {
  transports: ['polling', 'websocket'],
  path: '/socket.io/',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
  autoConnect: false,
  forceNew: true,
  reconnection: true,
  reconnectionDelayMax: 5000,
  randomizationFactor: 0.5,
  maxHttpBufferSize: 1e8,
  extraHeaders: {
    'Access-Control-Allow-Origin': '*',
    'Upgrade': 'websocket',
    'Connection': 'Upgrade'
  },
  upgrade: true,
  rememberUpgrade: true,
  rejectUnauthorized: false,
  perMessageDeflate: {
    threshold: 2048
  }
};

// API configuration
export const API_CONFIG = {
  timeout: 20000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
