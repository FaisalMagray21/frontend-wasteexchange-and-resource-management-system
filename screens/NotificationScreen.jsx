import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
//import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from './config/api';
import { AuthContext } from '../context/AuthContext';
export default function NotificationScreen() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking as read:', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.notificationItem,
        item.isRead ? styles.read : styles.unread,
      ]}
    >
      <View style={styles.notificationText}>
        <Text style={styles.message}>{item.message}</Text>
        {item.itemTitle && (
          <Text style={styles.itemTitle}>Item: {item.itemTitle}</Text>
        )}
        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      {!item.isRead && (
        <TouchableOpacity
          style={styles.markButton}
          onPress={() => markAsRead(item._id)}
        >
          <Text style={styles.buttonText}>Mark as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!user?.token) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>🔔 Notifications</Text>
        <Text style={styles.message}>Please login to view notifications.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔔 Notifications</Text>
      {loading ? (
        <ActivityIndicator color="#10B981" size="large" />
      ) : notifications.length === 0 ? (
        <Text style={styles.message}>No notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    color: '#34D399',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  unread: {
    borderColor: '#10B981',
    backgroundColor: '#374151',
  },
  read: {
    borderColor: '#4B5563',
    backgroundColor: '#1F2937',
  },
  notificationText: {
    flex: 1,
    paddingRight: 10,
  },
  message: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '600',
  },
  itemTitle: {
    color: '#D1D5DB',
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  markButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
