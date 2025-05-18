import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';
import NetInfo from '@react-native-community/netinfo';

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = SOCKET_CONFIG.reconnectionAttempts;

const initializeSocket = async () => {
  if (socket) return socket;

  // Check network connectivity first
  const netInfo = await NetInfo.fetch();
  if (!netInfo.isConnected) {
    throw new Error('No network connection available');
  }

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
      // Server initiated disconnect, try to reconnect
      socket.connect();
    }
  });

  // Add error handler
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = async () => {
  if (!socket) {
    return await initializeSocket();
  }
  return socket;
};