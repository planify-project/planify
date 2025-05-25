import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuth } from './AuthContext';
import api from '../configs/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [toast, setToast] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success'
  });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.dbUser?.id) {
        throw new Error('No user data found');
      }

      const response = await api.get(`/notifications/user/${user.dbUser.id}`);

      if (response.data.success) {
        setNotifications(response.data.data);
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    showToast(notification);
  };

  const showToast = (notification) => {
    let title = '';
    let type = 'success';

    switch (notification.type) {
      case 'booking_request':
        title = 'New Booking Request';
        break;
      case 'booking_response':
        title = 'Booking Response';
        break;
      case 'booking_cancelled':
        title = 'Booking Cancelled';
        type = 'error';
        break;
      default:
        title = 'New Notification';
    }

    setToast({
      visible: true,
      title,
      message: notification.message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const dismissNotification = async (notificationId) => {
    try {
      if (!user?.dbUser?.id) {
        throw new Error('No user data found');
      }

      await api.put(`/notifications/${notificationId}/dismiss`, {
        userId: user.dbUser.id
      });

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );
    } catch (error) {
      console.error('Error dismissing notification:', error);
      showToast({
        type: 'error',
        message: 'Failed to dismiss notification'
      });
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      if (!user?.dbUser?.id) {
        throw new Error('No user data found');
      }

      await api.delete(`/notifications/${notificationId}`, {
        data: { userId: user.dbUser.id }
      });

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast({
        type: 'error',
        message: 'Failed to delete notification'
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        toast,
        fetchNotifications,
        handleNewNotification,
        dismissNotification,
        deleteNotification,
        hideToast
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 