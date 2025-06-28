import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import API_BASE_URL from '../config/api';

export default function DonorAddItem({ navigation }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const pickImage = () => {
    if (images.length >= 3) {
      Alert.alert('Limit Reached', 'You can only upload 3 images');
      return;
    }

    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (res) => {
      if (res.didCancel || res.errorCode) return;

      const img = res.assets[0];
      setImages([...images, img]);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (loading) return;

    const { title, description, location } = form;
    if (!title || !description || !location || images.length === 0) {
      setError('Please complete all fields and upload images');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('location', location);

    images.forEach((img, i) => {
      data.append('images', {
        uri: img.uri,
        type: img.type || 'image/jpeg',
        name: img.fileName || `image_${i}.jpg`
      });
    });

    try {
      await axios.post(`${API_BASE_URL}/api/items/add`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      Alert.alert('Success', 'Item uploaded!');
      navigation.navigate('DonorItemList');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Failed to upload item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Donation</Text>

      <TextInput
        placeholder="Title"
        value={form.title}
        onChangeText={(text) => handleChange('title', text)}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        style={styles.input}
        placeholderTextColor="#ccc"
      />
      <TextInput
        placeholder="Location"
        value={form.location}
        onChangeText={(text) => handleChange('location', text)}
        style={styles.input}
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
        <Text style={styles.imageBtnText}>+ Add Image ({images.length}/3)</Text>
      </TouchableOpacity>

      <View style={styles.imagePreview}>
        {images.map((img, idx) => (
          <View key={idx} style={styles.imgBox}>
            <Image source={{ uri: img.uri }} style={styles.thumbnail} />
            <TouchableOpacity onPress={() => removeImage(idx)} style={styles.removeBtn}>
              <Text style={styles.removeText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color="#00FF99" />
      ) : (
        <Button title="Submit Item" onPress={handleSubmit} color="#00FF99" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#00FF99',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#00FF99',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    color: 'white',
  },
  imageBtn: {
    backgroundColor: '#00FF99',
    padding: 10,
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 15,
  },
  imageBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  imagePreview: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  imgBox: {
    position: 'relative',
    marginRight: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  removeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
