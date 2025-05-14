// API and Socket configuration
const LOCAL_IP = '192.168.149.72'; // Updated IP address
const PORT = 3000;

export const API_BASE = `http://${LOCAL_IP}:${PORT}/api`;
export const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

export const SOCKET_CONFIG = {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
  forceNew: true,
  transports: ['polling', 'websocket']
};