import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from './config/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch users', err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/items`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch items', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      Alert.alert('Error', 'Could not delete user');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      Alert.alert('Error', 'Could not delete item');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchItems();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>🛠 Admin Dashboard</Text>

      <Text style={styles.section}>👤 Registered Users</Text>
      {users.map((u) => (
        <View key={u._id} style={styles.card}>
          <View>
            <Text style={styles.cardText}>{u.fullname}</Text>
            <Text style={styles.subText}>Role: {u.role}</Text>
            <Text style={styles.subText}>Email: {u.email}</Text>
          </View>
          <TouchableOpacity onPress={() => deleteUser(u._id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.section}>📦 Listed Items</Text>
      {items.map((item) => (
        <View key={item._id} style={styles.card}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardText}>📌 {item.title}</Text>
            <Text style={styles.subText}>📍 {item.location}</Text>
            <Text style={styles.subText}>📝 {item.description}</Text>
            <Text style={styles.subText}>
              👤 Donor: {item.user?.fullname || 'Unknown'}
            </Text>

            {item.images?.length > 0 && (
              <ScrollView horizontal style={{ marginTop: 10 }}>
                {item.images.map((img, index) => (
                  <Image
                    key={index}
                    source={{ uri: `${API_BASE_URL}/${img.replace(/\\/g, '/')}` }}
                    style={styles.image}
                  />
                ))}
              </ScrollView>
            )}
          </View>
          <TouchableOpacity onPress={() => deleteItem(item._id)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FF99',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    color: '#00FF99',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  subText: {
    color: '#aaa',
    fontSize: 14,
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: '#cc0000',
    padding: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
    marginRight: 10,
  },
});
