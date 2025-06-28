import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import API_BASE_URL from './config/api';
//import DonorHome from './donor/DonorHome';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data?.token) {
        const userData = { ...res.data.user, token: res.data.token };
        login(userData);
console.log(userData)
        const role = userData.role;
        if (role === 'donor') {
          navigation.replace('DonorHome');
        } else if (role === 'admin') {
          navigation.replace('AdminDashboard');
        } else {
          navigation.replace('UserDashboard');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>♻️ Waste-to-Resource Exchange</Text>
      <Text style={styles.header}>Login</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor="#aaa"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don't have an account?{' '}
        <Text onPress={() => navigation.navigate('Signup')} style={styles.signupLink}>
          Sign up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#00FF99',
    textAlign: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00FF99',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#FF5C5C',
    textAlign: 'center',
    marginBottom: 10,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#ccc',
  },
  signupLink: {
    color: '#00FF99',
    fontWeight: 'bold',
  },
});
