import { io } from 'socket.io-client';
import { Platform } from 'react-native';

const SOCKET_URL = 'http://192.168.75.181:3000';

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  autoConnect: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
  // Add platform-specific settings
  extraHeaders: Platform.select({
    ios: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    android: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
});

// Add connection state monitoring
let isConnected = false;

socket.on('connect', () => {
  isConnected = true;
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.warn('Socket connection error:', {
    message: error.message,
    type: error.type,
    description: error.description,
    isConnected
  });
  
  if (!isConnected) {
    // Try to reconnect with polling if websocket fails
    socket.io.opts.transports = ['polling', 'websocket'];
    socket.connect();
  }
});

socket.on('disconnect', (reason) => {
  isConnected = false;
  console.log('Socket disconnected:', reason);
});

export default socket;