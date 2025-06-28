import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import API_BASE_URL from './config/api';

export default function Signup({ navigation }) {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignup = async () => {
    const { fullname, email, password, role } = form;

    if (!fullname || !email || !password || !role) {
      setError('All fields are required');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, form);      
      
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View style={styles.inner}>
        <Image
          source={{ uri: 'https://img.icons8.com/clouds/100/recycle.png' }}
          style={styles.logo}
        />
        <Text style={styles.appName}>Waste-to-Resource Exchange</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={form.fullname}
          onChangeText={(text) => handleChange('fullname', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
          style={styles.input}
        />
        <Picker
          selectedValue={form.role}
          style={styles.input}
          dropdownIconColor="#00FF99"
          onValueChange={(itemValue) => handleChange('role', itemValue)}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Donor" value="donor" />
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title={loading ? 'Signing up...' : 'Signup'}
          onPress={handleSignup}
          color="#00FF99"
          disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Waste Exchange</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'space-between' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  logo: { width: 100, height: 100, marginBottom: 20 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#00FF99', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#00FF99',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    color: 'white',
  },
  error: { color: 'red', marginBottom: 10 },
  link: { color: '#00FF99', marginTop: 15 },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
  },
  footerText: { color: '#888', fontSize: 12 },
});
