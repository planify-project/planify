import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const initializeSocket = async () => {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No network connection available');
      }

      // Create socket instance with explicit configuration
      const socketInstance = io(SOCKET_URL, {
        ...SOCKET_CONFIG,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        forceNew: true,
        autoConnect: false // We'll connect manually after setup
      });

      // Set up event handlers before connecting
      socketInstance.on('connect', () => {
        console.log('Socket connected successfully:', {
          id: socketInstance.id,
          transport: socketInstance.io.engine.transport.name
        });
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('Socket disconnected:', {
          reason,
          transport: socketInstance.io.engine.transport.name
        });
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', {
          message: error.message,
          type: error.type,
          description: error.description
        });
        setIsConnected(false);
        setError(error.message);
      });

      socketInstance.on('test', (data) => {
        console.log('Received test event:', data);
      });

      socketInstance.on('notification', (notification) => {
        console.log('Received notification:', notification);
        setNotifications(prev => [...prev, notification]);
      });

      // Handle reconnection events
      socketInstance.io.on("reconnect_attempt", (attempt) => {
        console.log('Reconnection attempt:', attempt);
      });

      socketInstance.io.on("reconnect_error", (error) => {
        console.error('Reconnection error:', error);
      });

      socketInstance.io.on("reconnect_failed", () => {
        console.error('Reconnection failed');
        Alert.alert(
          'Connection Error',
          'Unable to establish a stable connection to the server. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      });

      // Now connect the socket
      socketInstance.connect();
      setSocket(socketInstance);

    } catch (err) {
      console.error('Socket initialization error:', err);
      setError(err.message);
      
      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          initializeSocket();
        }, 2000 * (retryCount + 1)); // Exponential backoff
      } else {
        Alert.alert(
          'Connection Error',
          'Unable to connect to the server. Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let socketInstance = null;

    const setupSocket = async () => {
      if (mounted) {
        await initializeSocket();
      }
    };

    setupSocket();

    // Monitor network connectivity
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && !isConnected) {
        setupSocket();
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      if (socketInstance) {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
      }
    };
  }, []);

  const joinUserRoom = (userId) => {
    if (!socket || !userId) {
      console.error('Socket not initialized or userId is missing:', {
        socket: !!socket,
        userId
      });
      return;
    }

    try {
      console.log('Attempting to join user room:', userId);
      socket.emit('joinUserRoom', { userId });
      console.log('Join user room request sent');
    } catch (err) {
      console.error('Error joining user room:', err);
      setError(err.message);
    }
  };

  const value = {
    socket,
    isConnected,
    error,
    notifications,
    setNotifications,
    joinUserRoom
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};