// ✅ ChatScreen.js
import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { AuthContext } from '../../context/AuthContext';

export default function ChatScreen({ route }) {
  const { conversationId, senderId, receiverId, itemId, senderName } = route.params;
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/messages`,
        {
          senderId: user._id,
          receiverId: receiverId._id || receiverId,
          itemId,
          text,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessages((prev) => [...prev, res.data]);
      setText('');
    } catch (err) {
      console.error('Send error:', err);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.senderId === user._id;
    return (
      <View
        style={[
          styles.message,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.header}>Chat — {senderName}</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  header: {
    padding: 15,
    backgroundColor: '#00FF99',
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: '#00FF99',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#333',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#333',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#00FF99',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginLeft: 10,
    borderRadius: 20,
  },
  sendText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
