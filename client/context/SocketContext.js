import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { API_BASE } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && token) {
      const newSocket = io(API_BASE, {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setError(null);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setError('Connection error. Please check your internet connection.');
        setIsConnected(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        if (reason !== 'io client disconnect') {
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            initializeSocket();
          }, 5000);
        }
      });

      newSocket.on('error', (err) => {
        console.error('Socket general error:', err);
        setError('Connection error. Please check your internet connection.');
        setIsConnected(false);
      });

      newSocket.on('newBooking', (data) => {
        setNotifications(prev => [data.notification, ...prev]);
      });

      newSocket.on('bookingResponse', (data) => {
        setNotifications(prev => [data.notification, ...prev]);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, token]);

  const joinUserRoom = (userId) => {
    if (socket && isConnected) {
      socket.emit('join', userId);
    } else {
      console.warn('Socket not connected. Cannot join room.');
    }
  };

  const reconnect = () => {
    if (socket) {
      socket.connect();
    }
  };

  const value = {
    socket,
    notifications,
    setNotifications,
    joinUserRoom,
    isConnected,
    error,
    reconnect
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};