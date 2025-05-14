import { io } from 'socket.io-client';
import { Platform } from 'react-native';
import { SOCKET_URL } from '../config';

const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 60000,
  autoConnect: true,
  transports: ['websocket', 'polling'],
  path: '/socket.io',
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

let isConnected = false;

socket.on('connect', () => {
  isConnected = true;
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.warn('Socket connection error:', error);
  if (!isConnected) {
    socket.io.opts.transports = ['polling', 'websocket'];
  }
});

export default socket;