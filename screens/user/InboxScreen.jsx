import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../config/api';

export default function InboxScreen() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInbox = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const grouped = {};
      res.data.forEach((msg) => {
        if (!grouped[msg.conversationId] ||
          new Date(msg.createdAt) > new Date(grouped[msg.conversationId].createdAt)) {
          grouped[msg.conversationId] = msg;
        }
      });

      const inboxArray = Object.values(grouped).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setInbox(inboxArray);
    } catch (err) {
      console.error('Inbox fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const openChat = (item) => {
    const isSender = item.senderId === user._id;
    const receiverId = isSender ? item.receiverId : item.senderId;
    const senderId = isSender ? item.senderId : item.receiverId;

    navigation.navigate('ChatScreen', {
      conversationId: item.conversationId,
      senderId,
      receiverId,
      itemId: item.itemId,
      senderName: item.senderName,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openChat(item)} style={styles.card}>
      <Text style={styles.name}>💬 {item.senderName || 'User'}</Text>
      <Text numberOfLines={1} style={styles.message}>{item.text}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📨 Inbox</Text>
      {loading ? (
        <ActivityIndicator color="#00FF99" />
      ) : (
        <FlatList
          data={inbox}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 15 },
  header: {
    color: '#00FF99',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00FF99',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});
