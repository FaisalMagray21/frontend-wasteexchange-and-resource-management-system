import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../config/api';

export default function UserSearchItems() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [items, setItems] = useState([]);

  const handleSearch = async () => {
    if (!name && !location) {
      alert('Please enter item name or location');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/filter`, {
        params: { name, location },
      });
      setItems(res.data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.images?.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: `${API_BASE_URL}/${img.replace(/\\/g, '/')}` }}
            style={styles.image}
          />
        ))}
      </ScrollView>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.loc}>📍 {item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔍 Search Items</Text>

      <TextInput
        placeholder="Enter item name (optional)"
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Enter location (optional)"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No results found</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
    color: '#00FF99',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00FF99',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
  },
  card: {
    backgroundColor: '#1f1f1f',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 6,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  desc: {
    color: '#ccc',
    marginTop: 3,
  },
  loc: {
    color: '#aaa',
    marginTop: 2,
    fontStyle: 'italic',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
});
