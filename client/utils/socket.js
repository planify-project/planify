import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = SOCKET_CONFIG.reconnectionAttempts;

const initializeSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['polling', 'websocket'],
    reconnection: true,
    reconnectionAttempts: SOCKET_CONFIG.reconnectionAttempts,
    reconnectionDelay: SOCKET_CONFIG.reconnectionDelay,
    timeout: SOCKET_CONFIG.timeout,
    pingTimeout: SOCKET_CONFIG.pingTimeout,
    pingInterval: SOCKET_CONFIG.pingInterval,
    autoConnect: true,
    forceNew: true
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
    reconnectAttempts = 0;
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    reconnectAttempts++;
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      socket.disconnect();
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
    if (reason === 'io server disconnect') {
      socket.connect();
    }
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};