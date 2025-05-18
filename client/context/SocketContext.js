import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';
import api from '../configs/api';
import { useAuth } from './AuthContext';

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
  const { user, loading: authLoading } = useAuth();

  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log('Disconnecting existing socket connection');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  }, [socket]);

  const connectSocket = useCallback(async () => {
    if (authLoading) {
      console.log('Auth still loading, waiting to initialize socket...');
      return;
    }

    if (!user?.uid) {
      console.log('No user ID available, skipping socket initialization');
      disconnectSocket();
      return;
    }

    try {
      console.log('Initializing socket connection for user:', user.uid);
      
      // Disconnect existing socket if any
      disconnectSocket();

      const userResponse = await api.get(`/users/firebase/${user.uid}`);
      if (!userResponse.data.success || !userResponse.data.data?.id) {
        throw new Error('Failed to get user data');
      }

      const dbUserId = userResponse.data.data.id;
      console.log('Got database user ID:', dbUserId);
      
      // Initialize socket connection
      const newSocket = io('http://192.168.70.126:3000', {
        query: { userId: dbUserId },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
        setError(null);
        setRetryCount(0);

        // Join user's room after connection
        newSocket.emit('joinRoom', `user_${dbUserId}`);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not disconnected intentionally
        if (reason !== 'io client disconnect' && retryCount < 3) {
          setTimeout(() => {
            console.log('Attempting to reconnect...');
            setRetryCount(prev => prev + 1);
            connectSocket();
          }, 2000);
        }
      });

      newSocket.on('error', (err) => {
        console.error('Socket error:', err);
        setError(err.message);
      });

      // Handle new booking notifications
      newSocket.on('newBooking', (data) => {
        console.log('Received new booking notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      // Handle booking response notifications
      newSocket.on('bookingResponse', (data) => {
        console.log('Received booking response notification:', data);
        setNotifications(prev => [data.notification, ...prev]);
      });

      // Handle notification deletion
      newSocket.on('notificationDeleted', (data) => {
        console.log('Notification deleted:', data);
        setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
      });

      setSocket(newSocket);

    } catch (err) {
      console.error('Socket initialization error:', err);
      setError('Failed to initialize connection. Please try again.');
      setIsConnected(false);
      
      if (retryCount < 3) {
        setTimeout(() => {
          console.log('Retrying socket connection...');
          setRetryCount(prev => prev + 1);
          connectSocket();
        }, 2000);
      }
    }
  }, [user?.uid, authLoading, retryCount, disconnectSocket]);

  // Initialize socket connection when user changes
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [user?.uid, connectSocket, disconnectSocket]);

  const joinUserRoom = (userId) => {
    const socket = io('http://192.168.70.126:3000', {
      query: { userId }
    });
    if (!socket || !userId) {
      console.error('Socket not initialized or userId is missing:', {
        socket: !!socket,
        userId
      });
      return;
    }

    try {
      console.log('Attempting to join user room:', userId);
      socket.emit('joinRoom', `user_${userId}`);
      console.log('Join user room request sent');
    } catch (err) {
      console.error('Error joining user room:', err);
      setError(err.message);
    }
  };

  // Function to send a booking notification to a service provider
  const sendBookingNotification = (providerId, bookingData) => {
    const socket = io('http://192.168.70.126:3000', {
      query: { userId: user?.uid }
    });
    if (!socket?.connected) {
      console.error('Socket not connected, cannot send booking notification');
      return;
    }

      console.log('Sending booking notification to provider:', providerId);
      socket.emit('sendBookingNotification', {
        providerId,
        bookingId: bookingData.id,
      customerId: user?.uid,
      customerName: user?.displayName,
      message: `New booking request from ${user?.displayName || 'a customer'}`
      });
  };

  // Test function to send a test notification
  const sendTestNotification = () => {
    const socket = io('http://192.168.70.126:3000', {
      query: { userId: user?.uid }
    });
    if (!socket?.connected) {
      console.error('Socket not connected, cannot send test notification');
      // Try to reconnect
      connectSocket();
      return;
    }

      console.log('Sending test notification...');
      socket.emit('testNotification', { message: 'This is a test notification' });
  };

  const value = {
    socket,
    isConnected,
    error,
    notifications,
    setNotifications,
    joinUserRoom,
    sendTestNotification,
    sendBookingNotification,
    reconnect: connectSocket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};