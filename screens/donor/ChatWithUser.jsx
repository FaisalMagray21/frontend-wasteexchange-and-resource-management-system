import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../config/api';

export default function ChatWithUser({ route }) {
  const { conversationId, senderId, receiverId, itemId, senderName } = route.params;
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    if (!socketRef.current) {
      socketRef.current = io(API_BASE_URL);
      socketRef.current.emit('register', user._id);
    }

    const socket = socketRef.current;

    socket.on('newMessage', (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          const alreadyExists = prev.some((m) => m._id === msg._id);
          return alreadyExists ? prev : [...prev, msg];
        });
      }
    });

    return () => socket.off('newMessage');
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      senderId: user._id,
      receiverId,
      itemId,
      text,
      conversationId,
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/api/messages`, newMsg, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages((prev) => [...prev, res.data]);
      socketRef.current.emit('sendMessage', res.data);
      setText('');
    } catch (err) {
      console.log('Send error:', err.message);
    }
  };

  const confirmDelete = (messageId) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMessage(messageId),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      console.error('Delete error:', err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isSender = item.senderId === user._id;
    return (
      <TouchableOpacity
        onLongPress={() => {
          if (isSender) confirmDelete(item._id);
        }}
        style={[
          styles.messageBubble,
          isSender ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.senderName}>{isSender ? 'You' : senderName || 'User'}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#00FF99',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0077cc',
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  senderName: {
    fontSize: 12,
    color: '#aaa',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
});
