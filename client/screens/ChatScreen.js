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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
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
            source={{ uri: recipientProfilePic || 'https://via.placeholder.com/40' }}
            style={styles.headerImage}
          />
          <Text style={styles.headerName}>{recipientName}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setIsDropdownVisible(true)}
        >
          <Ionicons name="information-circle" size={28} color="#EFD13D" />
        </TouchableOpacity>
      ),
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

  const submitReport = async () => {
    try {
      const finalReason = reportReason === 'other' ? customReason : reportReason;
      
      if (!finalReason) {
        Alert.alert('Error', 'Please select or enter a reason for reporting');
        return;
      }

      if (!currentUserId) {
        Alert.alert('Error', 'You must be logged in to report a user');
        return;
      }

      await axios.post(`${API_BASE}/report/createReport`, {
        reason: finalReason,
        userId: currentUserId,
        reportedUserId: recipientId,
        itemType: 'user'
      });

      Alert.alert('Success', 'Thank you for your report. We will review it shortly.');
      setReportModalVisible(false);
      setReportReason('');
      setCustomReason('');
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

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
            ListHeaderComponent={renderUserHeader}
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

      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setIsDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setIsDropdownVisible(false);
                navigation.navigate('OtherUser', { userId: recipientId });
              }}
            >
              <Ionicons name="person-outline" size={20} color="#333" />
              <Text style={styles.dropdownText}>View Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setIsDropdownVisible(false);
                setReportModalVisible(true);
              }}
            >
              <Ionicons name="warning-outline" size={20} color="#FF6B6B" />
              <Text style={styles.dropdownText}>Report User</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1} 
          onPress={() => setReportModalVisible(false)}
        >
          <View style={styles.reportModalContent}>
            <Text style={styles.reportModalTitle}>Report User</Text>
            <Text style={styles.reportModalSubtitle}>Why are you reporting this user?</Text>

            <TouchableOpacity 
              style={[styles.reportOption, reportReason === 'inappropriate' && styles.reportOptionSelected]}
              onPress={() => setReportReason('inappropriate')}
            >
              <Text style={styles.reportOptionText}>Inappropriate Behavior</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.reportOption, reportReason === 'spam' && styles.reportOptionSelected]}
              onPress={() => setReportReason('spam')}
            >
              <Text style={styles.reportOptionText}>Spam or Scam</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.reportOption, reportReason === 'harassment' && styles.reportOptionSelected]}
              onPress={() => setReportReason('harassment')}
            >
              <Text style={styles.reportOptionText}>Harassment</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.reportOption, reportReason === 'other' && styles.reportOptionSelected]}
              onPress={() => setReportReason('other')}
            >
              <Text style={styles.reportOptionText}>Other</Text>
            </TouchableOpacity>

            {reportReason === 'other' && (
              <TextInput
                style={styles.reportCustomInput}
                placeholder="Please specify the reason"
                value={customReason}
                onChangeText={setCustomReason}
                multiline
              />
            )}

            <TouchableOpacity 
              style={styles.reportSubmitButton} 
              onPress={submitReport}
            >
              <Text style={styles.reportSubmitButtonText}>Submit Report</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.reportCancelButton}
              onPress={() => {
                setReportModalVisible(false);
                setReportReason('');
                setCustomReason('');
              }}
            >
              <Text style={styles.reportCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#EFD13D',
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
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
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFD13D',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  userAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
    backgroundColor: '#e0e0e0',
  },
  userName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
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
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  reportModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    maxWidth: 400,
    marginTop: 'auto',
    marginBottom: 'auto',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reportModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  reportModalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  reportOption: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  reportOptionSelected: {
    backgroundColor: '#EFD13D20',
    borderColor: '#EFD13D',
    borderWidth: 1,
  },
  reportOptionText: {
    fontSize: 16,
    color: '#333',
  },
  reportCustomInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  reportSubmitButton: {
    backgroundColor: '#EFD13D',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  reportSubmitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportCancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  reportCancelButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
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