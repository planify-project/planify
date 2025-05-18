// API and Socket configuration
export const SOCKET_URL = 'http://192.168.70.126:3000'; 
export const API_BASE = "http://192.168.70.126:3000/api";

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