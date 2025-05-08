import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { API_BASE } from '../config';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    let newSocket = null;
    let reconnectTimer = null;

    const initializeSocket = () => {
      try {
        // Get WebSocket URL by removing /api and ensuring proper protocol
        const wsUrl = API_BASE.replace('/api', '').replace('http://', 'ws://').replace('https://', 'wss://');
        console.log('Initializing socket connection to:', wsUrl);
        
        // Initialize socket connection with reconnection options
        newSocket = io(wsUrl, {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000,
          forceNew: true
        });

        // Connection event handlers
        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setIsConnected(true);
          setError(null);
          setReconnectAttempts(0);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setError(err.message);
          setIsConnected(false);
          setReconnectAttempts(prev => prev + 1);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          setIsConnected(false);
          
          // Attempt to reconnect if not manually disconnected
          if (reason !== 'io client disconnect') {
            reconnectTimer = setTimeout(() => {
              console.log('Attempting to reconnect...');
              initializeSocket();
            }, 5000);
          }
        });

        // Notification event handlers
        newSocket.on('newBooking', (data) => {
          console.log('Received new booking notification:', data);
          setNotifications(prev => [data.notification, ...prev]);
        });

        newSocket.on('bookingResponse', (data) => {
          console.log('Received booking response:', data);
          setNotifications(prev => [data.notification, ...prev]);
        });

        // Error event handler
        newSocket.on('error', (err) => {
          console.error('Socket error:', err);
          setError(err.message);
        });

        setSocket(newSocket);
      } catch (err) {
        console.error('Error initializing socket:', err);
        setError(err.message);
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (newSocket) {
        console.log('Cleaning up socket connection');
        newSocket.removeAllListeners();
        newSocket.close();
      }
    };
  }, []);

  const joinUserRoom = (userId) => {
    if (socket && isConnected) {
      console.log(`Joining room for user ${userId}`);
      socket.emit('join', userId);
    } else {
      console.warn('Cannot join room: Socket not connected');
      setError('Socket connection lost. Please try reconnecting.');
    }
  };

  const reconnect = () => {
    if (socket) {
      console.log('Manually reconnecting socket...');
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
    reconnect,
    reconnectAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 