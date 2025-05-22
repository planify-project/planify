import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';
import NetInfo from '@react-native-community/netinfo';

let socket = null;

export const initializeSocket = (userId) => {
  if (socket?.connected) {
    return socket;
  }
  
  console.log('Initializing socket connection to:', SOCKET_URL);
  
  socket = io(SOCKET_URL, {
    ...SOCKET_CONFIG,
    autoConnect: true,
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
    if (userId) {
      socket.emit('joinUserRoom', { userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  // Add error handler
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 