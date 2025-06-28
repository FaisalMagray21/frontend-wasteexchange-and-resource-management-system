import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../config/api';

export default function DonorItemList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchMyItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/my`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/api/items/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
              });
              setItems((prev) => prev.filter((item) => item._id !== id));
            } catch (err) {
              console.error('Delete failed:', err.message);
              Alert.alert('Error', 'Failed to delete item.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openImage = (uri) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {item.images?.map((img, idx) => {
          const imageUrl = img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`;
          return (
            <TouchableOpacity key={idx} onPress={() => openImage(imageUrl)}>
              <Image source={{ uri: imageUrl }} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <Text style={styles.title}>Title: {item.title}</Text>
      <Text style={styles.description}>Description: {item.description}</Text>
      <Text style={styles.location}>Location 📍 {item.location}</Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteItem(item._id)}>
        <Text style={styles.deleteText}>🗑️ Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FF99" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧾 Your Donations</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
      />

      {/* Fullscreen Image Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 15,
  },
  header: {
    fontSize: 24,
    color: '#00FF99',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00FF99',
    shadowColor: '#00FF99',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    color: '#CCCCCC',
    marginBottom: 4,
    fontSize: 14,
  },
  location: {
    color: '#AAAAAA',
    marginBottom: 10,
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: '#FF4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
});
