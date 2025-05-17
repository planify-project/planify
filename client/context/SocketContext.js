import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL, SOCKET_CONFIG } from '../config';

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

  useEffect(() => {
    let mounted = true;
    let socketInstance = null;

    const initializeSocket = async () => {
      try {
        // First verify server is accessible
        const response = await fetch(`${SOCKET_URL}/test`);
        if (!response.ok) {
          throw new Error('Server is not accessible');
        }

        console.log('Initializing socket connection to:', SOCKET_URL);
        
        socketInstance = io(SOCKET_URL, {
          ...SOCKET_CONFIG,
          transports: ['websocket', 'polling'],
          reconnection: true
        });

        // Connection event handlers
        socketInstance.on('connect', () => {
          if (!mounted) return;
          console.log('Socket connected successfully:', {
            id: socketInstance.id,
            transport: socketInstance.io.engine.transport.name
          });
          setIsConnected(true);
          setError(null);
        });

        socketInstance.on('disconnect', (reason) => {
          if (!mounted) return;
          console.log('Socket disconnected:', {
            reason,
            transport: socketInstance.io.engine.transport.name
          });
          setIsConnected(false);
        });

        socketInstance.on('connect_error', (error) => {
          if (!mounted) return;
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
          if (!mounted) return;
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
        });

        setSocket(socketInstance);
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError(err.message);
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
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