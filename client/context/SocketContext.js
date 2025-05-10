import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';

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
        newSocket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 10000
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          setIsConnected(true);
          setError(null);
          setReconnectAttempts(0);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setError('Socket connection error: ' + err.message);
          setIsConnected(false);
          setReconnectAttempts(prev => prev + 1);
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
          setError('Socket error: ' + err.message);
        });

        newSocket.on('newBooking', (data) => {
          setNotifications(prev => [data.notification, ...prev]);
        });

        newSocket.on('bookingResponse', (data) => {
          setNotifications(prev => [data.notification, ...prev]);
        });

        setSocket(newSocket);
      } catch (err) {
        setError('Socket initialization error: ' + err.message);
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
    if (socket && isConnected) {
      socket.emit('join', userId);
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
    reconnect,
    reconnectAttempts
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};