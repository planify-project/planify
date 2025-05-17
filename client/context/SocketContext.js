import React, { createContext, useContext, useEffect, useState } from 'react';
 import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
   const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let newSocket = null; 
    let reconnectTimer = null; 

    const initializeSocket = () => {
      try {
        newSocket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true,
          path: '/socket.io',
          auth: {
            token: AsyncStorage.getItem('token')
          }
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setIsConnected(true);
          setError(null);
        });

         newSocket.on('connect_error', (err) => {
          console.error('Socket connection error details:', {
            error: err.message,
            description: err.description,
            context: err.context,
            type: err.type
          });
          setError(`Connection error: ${err.message}`);
          setIsConnected(false);
        });

         newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
          
          if (reason !== 'io client disconnect') {
            reconnectTimer = setTimeout(() => {
              console.log('Attempting to reconnect...');
              initializeSocket();
            }, 5000);
          }
        });

        newSocket.on('error', (err) => {
          console.error('Socket general error:', err);
          setError('Connection error. Please check your internet connection.');
        });

         newSocket.on('newBooking', (data) => {
          setNotifications(prev => [data.notification, ...prev]);
        });

         newSocket.on('bookingResponse', (data) => {
          setNotifications(prev => [data.notification, ...prev]);
        });

         setSocket(newSocket);
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize connection. Please try again.');
      }
    };

    initializeSocket();

     return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.close();
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