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
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { API_BASE } from '../config';

// Extract base URL without /api
const SOCKET_BASE = API_BASE.replace('/api', '');

export default function Chat({ route, navigation }) {
  const { recipientId, recipientName, recipientProfilePic } = route.params;
  console.log('Chat Screen - Route Params:', { recipientId, recipientName, recipientProfilePic });
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);
  const flatListRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image
            source={{ 
              uri: recipientProfilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent((recipientName || 'U')[0])}&background=E5E5E5&color=666666&size=40`,
              cache: 'reload'
            }}
            style={styles.headerImage}
            onError={(e) => console.log('Header image error:', e.nativeEvent.error)}
          />
          <Text style={styles.headerName}>{recipientName}</Text>
        </View>
      ),
      headerStyle: { 
        backgroundColor: '#5D5FEE', 
        height: 80 
      },
      headerTintColor: '#fff',
    });

    let isMounted = true;

    const initializeChat = async () => {
      try {
        if (!user?.uid) {
          console.error('No user ID found');
          setLoading(false);
          return;
        }

        setCurrentUserId(user.uid);
        setReceiverId(recipientId);

        console.log('Initializing chat with:', {
          senderId: user.uid,
          receiverId: recipientId
        });

        // Create or get conversation
        const conversationResponse = await axios.post(`${API_BASE}/conversations/create`, {
          senderId: user.uid,
          receiverId: recipientId
        });
        
        console.log('Conversation response:', conversationResponse.data);

        if (!conversationResponse.data.success) {
          throw new Error(conversationResponse.data.message || 'Failed to create conversation');
        }

        const conversation = conversationResponse.data.data;
        console.log('Conversation created/found:', conversation);

        if (!conversation || !conversation.id) {
          throw new Error('Invalid conversation data received');
        }

        setConversationId(conversation.id);

        // Initialize socket connection
        const socketInstance = io(SOCKET_BASE, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
          path: '/socket.io/',
          forceNew: true,
          autoConnect: true,
          query: {
            userId: user.uid
          }
        });

        // Handle connection events
        socketInstance.on('connect', () => {
          console.log('Socket connected');
          // Join the conversation room immediately after connection
          socketInstance.emit('join_room', conversation.id);
          console.log('Joined room:', conversation.id);
        });

        socketInstance.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          // Attempt to reconnect with exponential backoff
          setTimeout(() => {
            if (!socketInstance.connected) {
              socketInstance.connect();
            }
          }, Math.min(1000 * Math.pow(2, socketInstance.io.reconnectionAttempts), 5000));
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'transport error' || reason === 'transport close') {
            // Attempt to reconnect
            setTimeout(() => {
              if (!socketInstance.connected) {
                socketInstance.connect();
              }
            }, 2000);
          }
        });

        // Listen for new messages
        socketInstance.on('receive_message', (data) => {
          console.log('Received new message:', data);
          if (isMounted) {
            setMessages(prevMessages => {
              const isDuplicate = prevMessages.some(msg => 
                msg.id === data.id || 
                (msg._isLocal && msg.senderId === data.senderId && msg.text === data.text)
              );
              
              if (!isDuplicate) {
                const newMessages = [...prevMessages, data];
                console.log('Updated messages:', newMessages);
                return newMessages;
              }
              return prevMessages;
            });
          }
        });

        // Listen for message status updates
        socketInstance.on('message_status_update', ({ messageId, status }) => {
          console.log('Message status update:', { messageId, status });
          if (isMounted) {
            setMessages(prev => {
              const updated = prev.map(msg => 
                msg.id === messageId ? { ...msg, status } : msg
              );
              console.log('Updated message status:', updated);
              return updated;
            });
          }
        });

        setSocket(socketInstance);

        // Fetch initial messages
        try {
          console.log('Fetching messages for conversation:', conversation.id);
          const messagesResponse = await axios.get(`${API_BASE}/messages/room/${conversation.id}`);
          
          if (!messagesResponse.data.success) {
            console.error('Failed to fetch messages:', messagesResponse.data.message);
            // Continue without messages rather than failing completely
            setMessages([]);
          } else {
            console.log('Successfully fetched messages:', messagesResponse.data.data.length);
            setMessages(messagesResponse.data.data);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
          // Continue without messages rather than failing completely
          setMessages([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
        Alert.alert(
          'Error',
          'Failed to initialize chat. Please try again.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    };

    initializeChat();

    return () => {
      if (socket) {
        socket.off('receive_message');
        if (conversationId) {
          socket.emit('leave_room', conversationId);
        }
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || !socket || !currentUserId || !conversationId || !receiverId) {
      console.log('Cannot send message:', {
        message: message.trim(),
        socket: !!socket,
        currentUserId,
        conversationId,
        receiverId
      });
      return;
    }

    try {
      console.log('Sending message with data:', {
        text: message,
        roomId: conversationId,
        senderId: currentUserId,
        receiverId: receiverId
      });

      const messageData = {
        text: message,
        roomId: conversationId,
        senderId: currentUserId,
        receiverId: receiverId
      };

      // Save message to database
      const response = await axios.post(`${API_BASE}/messages`, messageData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to send message');
      }

      // Update local state immediately with the new message
      const newMessage = {
        ...response.data.data,
        status: 'sent',
        _isLocal: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Emit message through socket
      socket.emit('send_message', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderId === currentUserId;
    let displayTime = 'Invalid Date';
    const dateValue = item.timestamp || item.createdAt;
    if (dateValue && !isNaN(new Date(dateValue).getTime())) {
      displayTime = new Date(dateValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{displayTime}</Text>
        {isCurrentUser && (
          <Text style={styles.messageStatus}>
            {item.status === 'read' ? 'Seen' : 
             item.status === 'received' ? 'Delivered' : 
             'Sent'}
          </Text>
        )}
      </View>
    );
  };

  // Update message status when messages are viewed
  useEffect(() => {
    if (socket && conversationId && messages.length > 0) {
      const unreadMessages = messages.filter(msg => 
        msg.status === 'sent' && 
        msg.senderId !== currentUserId
      );

      if (unreadMessages.length > 0) {
        console.log('Marking messages as received:', unreadMessages.map(m => m.id));
        unreadMessages.forEach(msg => {
          // Update local state first
          setMessages(prev => prev.map(m => 
            m.id === msg.id ? { ...m, status: 'received' } : m
          ));
          
          // Send status update to server
          axios.patch(`${API_BASE}/messages/${msg.id}/status`, {
            status: 'received'
          }).catch(error => {
            console.error('Error updating message status:', error);
          });
        });
      }
    }
  }, [messages, socket, currentUserId]);

  // User info header for the chat
  const renderUserHeader = () => (
    <View style={styles.userHeader}>
      <Image
        source={{ uri: recipientProfilePic || 'https://via.placeholder.com/100' }}
        style={styles.userAvatar}
      />
      <Text style={styles.userName}>{recipientName}</Text>
    </View>
  );


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#EFD13D" />
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages.filter(msg => msg.text && (msg.timestamp || msg.createdAt))}
            renderItem={renderMessage}
            keyExtractor={item => `${item.id}-${item.senderId}-${item.timestamp || item.createdAt}`}
            contentContainerStyle={styles.messagesList}
            inverted={false}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}

            showsVerticalScrollIndicator={false}
            extraData={messages}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}



    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderTopRightRadius: 4,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#8d8ff3',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8d8ff3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  messageStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userHeader: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderWidth: 3,
    borderColor: '#8d8ff3',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
});