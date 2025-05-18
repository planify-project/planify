import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
function normalize(size) {
  const scale = width / 375;
  return Math.round(scale * size);
}
const AGENT = {
  name: 'Amine',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  status: 'Online now'
};

const QUICK_REPLIES = [
  { label: '🗂️ Find venues' },
  { label: '💰 Budget planning' },
  { label: '👥 Guest management' },
  { label: '🍽️ Catering options' }
];

export default function AgentChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'agent',
      text: "Hello! I'm your personal event planning assistant. I can help you with venue selection, budget planning, guest management, and more! 👋",
      time: '03:26 PM'
    }
  ]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, { from: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setMessage('');
      setShowQuickReplies(false);
    }
  };

  const handleQuickReply = (label) => {
    setMessage(label);
  };

  return (
    <View style={styles.container}>

      {/* Agent Info */}
      <View style={styles.agentInfo}>
        <Image source={{ uri: AGENT.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.agentName}>{AGENT.name}</Text>
          <Text style={styles.agentStatus}>{AGENT.status}</Text>
        </View>
      </View>

      {/* Chat Area */}
      <FlatList
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        style={styles.chatArea}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) =>
          item.from === 'agent' ? (
            <View style={styles.agentMsgRow}>
              <Image source={{ uri: AGENT.avatar }} style={styles.msgAvatar} />
              <View style={styles.agentMsgBubble}>
                <Text style={styles.agentMsgText}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.userMsgRow}>
              <View style={styles.userMsgBubble}>
                <Text style={styles.userMsgText}>{item.text}</Text>
                <Text style={styles.msgTime}>{item.time}</Text>
              </View>
            </View>
          )
        }
      />

      {/* Quick Replies */}
      {showQuickReplies && (
        <View style={styles.quickReplies}>
          {QUICK_REPLIES.map((qr, idx) => (
            <TouchableOpacity key={idx} style={styles.quickReplyBtn} onPress={() => handleQuickReply(qr.label)}>
              <Text style={styles.quickReplyText}>{qr.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Message Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="arrow-up" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F7FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(16),
    paddingTop: normalize(48),
    paddingBottom: normalize(12),
    backgroundColor: '#F6F7FB'
  },
  headerTitle: { fontSize: normalize(18), fontWeight: '600', color: '#222' },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  avatar: { width: normalize(40), height: normalize(40), borderRadius: normalize(20), marginRight: normalize(12) },
  agentName: { fontWeight: '600', fontSize: normalize(16), color: '#222' },
  agentStatus: { fontSize: normalize(12), color: '#4CD964', marginTop: normalize(2) },
  chatArea: { flex: 1, backgroundColor: '#F6F7FB' },
  agentMsgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: normalize(16) },
  msgAvatar: { width: normalize(32), height: normalize(32), borderRadius: normalize(16), marginRight: normalize(8) },
  agentMsgBubble: {
    backgroundColor: '#BFE0F8',
    borderRadius: normalize(16),
    padding: normalize(12),
    maxWidth: '75%'
  },
  agentMsgText: { color: '#222', fontSize: normalize(16) },
  userMsgRow: { alignItems: 'flex-end', marginBottom: normalize(16) },
  userMsgBubble: {
    backgroundColor: '#4f78f1',
    borderRadius: normalize(16),
    padding: normalize(12),
    maxWidth: '75%'
  },
  userMsgText: { color: '#fff', fontSize: normalize(16) },
  msgTime: { fontSize: normalize(10), color: '#888', marginTop: normalize(4), alignSelf: 'flex-end' },
  quickReplies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(8),
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  quickReplyBtn: {
    backgroundColor: '#F6F7FB',
    borderRadius: normalize(16),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    margin: normalize(4)
  },
  quickReplyText: { color: '#222', fontSize: normalize(14) },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(8),
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  input: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    borderRadius: normalize(20),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    fontSize: normalize(16),
    marginRight: normalize(8)
  },
  sendBtn: {
    backgroundColor: '#4f78f1',
    borderRadius: normalize(20),
    padding: normalize(10),
    alignItems: 'center',
    justifyContent: 'center'
  }
});