import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_BASE } from '../config';
import { useAuth } from '../context/AuthContext';

export default function MessagesScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      if (!user?.uid) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      console.log('Fetching conversations for user:', user.uid);
      const response = await axios.get(`${API_BASE}/conversations/user/${user.uid}`);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const conversationsData = response.data;

      // Get user details for each conversation
      const conversationsWithUsers = await Promise.all(
        conversationsData.map(async (conv) => {
          try {
            const members = Array.isArray(conv.members) ? conv.members : JSON.parse(conv.members);
            const otherUserId = members.find(id => id !== user.uid);
            if (!otherUserId) return null;

            const userResponse = await axios.get(`${API_BASE}/users/firebase/${otherUserId}`);
            console.log('User data received:', userResponse.data);
            return {
              ...conv,
              otherUser: userResponse.data.data
            };
          } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
          }
        })
      );

      // Filter out any null conversations
      const validConversations = conversationsWithUsers.filter(conv => conv !== null);
      setConversations(validConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      Alert.alert(
        'Error',
        'Failed to load conversations. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderConversationItem = ({ item }) => {
    if (!item.otherUser) return null;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('Chat', {
          recipientId: item.otherUser.id,
          recipientName: item.otherUser.name || 'Unknown User',
          recipientProfilePic: item.otherUser.image
        })}
      >
        <Image
          source={{ 
            uri: item.otherUser.image || `https://ui-avatars.com/api/?name=${encodeURIComponent((item.otherUser.name || 'U')[0])}&background=E5E5E5&color=666666&size=50`
          }}
          style={styles.avatar}
        />
        <View style={styles.conversationInfo}>
          <Text style={styles.userName}>{item.otherUser.name || 'Unknown User'}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage || 'Start a conversation'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

   
      {conversations.length > 0 ? (
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-outline" size={80} color="#e0e0e0" />
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptySubtext}>
            Start chatting with other users to see your conversations here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  startChatButton: {
    backgroundColor: '#00C44F',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});