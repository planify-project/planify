import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../configs/api';
import { useTheme } from '../context/ThemeContext';
import { getAuth } from 'firebase/auth';
import io from 'socket.io-client';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { socket: contextSocket } = useSocket();
  const { serviceId, serviceProviderId, serviceProviderName, serviceProviderImage } = route.params;
  const { theme } = useTheme();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [providerInfo, setProviderInfo] = useState(null);
  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const hasJoinedRef = useRef(false);
  const [socket, setSocket] = useState(null);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    console.log('ChatScreen mounted with params:', {
      serviceId,
      serviceProviderId,
      currentUserId,
      socket: !!contextSocket
    });

    if (!currentUserId) {
      console.log('No current user ID available');
      setLoading(false);
      return;
    }

    if (!contextSocket) {
      console.log('Initializing new socket connection');
      const newSocket = io('http://192.168.203.126:3000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      setSocket(newSocket);

      return () => {
        console.log('Cleaning up socket connection');
        newSocket.disconnect();
      };
    } else {
      setSocket(contextSocket);
    }
  }, [contextSocket]);

  useEffect(() => {
    if (!currentUserId || !serviceId || !serviceProviderId || initialFetchDone.current) {
      return;
    }

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchProviderInfo(),
          fetchChatHistory(),
          markMessagesAsRead()
        ]);
        initialFetchDone.current = true;
      } catch (error) {
        console.error('Error fetching initial data:', error);
        Alert.alert('Error', 'Failed to load chat data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [currentUserId, serviceId, serviceProviderId]);

  useEffect(() => {
    if (!socket || !currentUserId || !serviceId || !serviceProviderId) {
      return;
    }

    console.log('Setting up chat room:', {
      serviceId,
      currentUserId,
      serviceProviderId
    });

    const roomId = `chat_${serviceId}_${currentUserId}_${serviceProviderId}`;
    socket.emit('joinChat', {
      serviceId,
      userId: currentUserId,
      serviceProviderId
    });

    socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, message]);
      flatListRef.current?.scrollToEnd();
    });

    socket.on('userTyping', ({ userId, isTyping }) => {
      if (userId !== currentUserId) {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('userTyping');
    };
  }, [socket, currentUserId, serviceId, serviceProviderId]);

  const fetchProviderInfo = async () => {
    try {
      console.log('Fetching provider info for ID:', serviceProviderId);
      const response = await api.get(`/users/${serviceProviderId}`);
      console.log('Provider info response:', response.data);
      setProviderInfo(response.data);
    } catch (error) {
      console.error('Error fetching provider info:', error.response?.data || error.message);
    }
  };

  const fetchChatHistory = async () => {
    if (!currentUserId || !serviceId || !serviceProviderId) {
      console.log('Missing required IDs:', { currentUserId, serviceId, serviceProviderId });
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching chat history with params:', {
        serviceId,
        currentUserId,
        serviceProviderId
      });

      // Then fetch messages
      const response = await api.get(`/chat/${serviceId}/${currentUserId}/${serviceProviderId}`);
      console.log('Chat history response:', response.data);
      
      // Handle both array and empty response cases
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else if (response.data && response.data.error) {
        // If there's an error but it's just because there are no messages, set empty array
        if (response.data.error.includes('no messages') || response.data.error.includes('not found')) {
          setMessages([]);
        } else {
          throw new Error(response.data.error);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error.response?.data || error.message);
      // Set empty array instead of throwing error for no messages
      setMessages([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await api.put(`/chat/read/${serviceId}/${currentUserId}/${serviceProviderId}`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleTyping = () => {
    if (!socket || !currentUserId) return;

    socket.emit('typing', {
      serviceId,
      userId: currentUserId,
      serviceProviderId,
      isTyping: true,
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', {
        serviceId,
        userId: currentUserId,
        serviceProviderId,
        isTyping: false,
      });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) {
      console.log('Cannot send message:', {
        hasMessage: !!newMessage.trim(),
        hasUserId: !!currentUserId
      });
      return;
    }

    const messageData = {
      serviceId,
      fromUserId: currentUserId,
      toUserId: serviceProviderId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      console.log('Sending message:', messageData);
      // Add message to local state immediately for better UX
      setMessages(prev => [...prev, messageData]);
      setNewMessage('');
      flatListRef.current?.scrollToEnd();

      // Send to server
      const response = await api.post('/chat', messageData);
      console.log('Message sent successfully:', response.data);
      
      // Update the message in local state with the server response
      setMessages(prev => prev.map(msg => 
        msg === messageData ? response.data : msg
      ));
      
      // Try to emit socket event if socket is available
      if (socket) {
        socket.emit('sendMessage', response.data);
      }
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      // Remove failed message from local state
      setMessages(prev => prev.filter(msg => msg !== messageData));
      
      // Show error to user
      Alert.alert(
        'Error',
        error.response?.data?.details || 'Failed to send message. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.fromUserId === currentUserId;

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <Image
            source={{ uri: providerInfo?.image || serviceProviderImage || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
        )}
        <View style={styles.messageContent}>
          {!isOwnMessage && (
            <Text style={[styles.senderName, { color: theme.textSecondary }]}>
              {providerInfo?.name || serviceProviderName}
            </Text>
          )}
          <Text style={[
            styles.messageText,
            { color: isOwnMessage ? '#fff' : theme.text }
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.timestamp,
            { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : '#666' }
          ]}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  const onRefresh = () => {
    if (!refreshing) {
      setRefreshing(true);
      fetchChatHistory();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#5D5FEE" />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading chat...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Image
          source={{ uri: providerInfo?.image || serviceProviderImage || 'https://via.placeholder.com/40' }}
          style={styles.headerAvatar}
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {providerInfo?.name || serviceProviderName}
          </Text>
          <View style={styles.headerStatus}>
            <View style={[styles.statusIndicator, { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }]} />
            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#5D5FEE']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No messages yet. Start the conversation!
            </Text>
          </View>
        }
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={[styles.typingText, { color: theme.textSecondary }]}>
            {providerInfo?.name || serviceProviderName} is typing...
          </Text>
        </View>
      )}

      <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.background }]}
          value={newMessage}
          onChangeText={setNewMessage}
          onFocus={handleTyping}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            { 
              backgroundColor: newMessage.trim() ? '#5D5FEE' : '#E0E0E0',
              opacity: newMessage.trim() ? 1 : 0.5
            }
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim()}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? '#fff' : '#999'} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
  },
  messagesList: {
    padding: 15,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    maxWidth: '80%',
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 12,
    marginBottom: 2,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#5D5FEE',
    borderRadius: 15,
    padding: 10,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  typingContainer: {
    padding: 10,
    paddingLeft: 20,
  },
  typingText: {
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ChatScreen; 