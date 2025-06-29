import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext'; // adjust path if needed

export default function UserDashboard() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext); // contains fullname, email, role, etc.

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Wellcome, {user?.fullname} 👋 </Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserItemList')}>
        <Text style={styles.cardText}>📦 Browse Available Items</Text>
        <Text style={styles.subText}>View all items and send messages to donors</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('UserSearchItems')}>
        <Text style={styles.cardText}>🔍 Search & Filter</Text>
        <Text style={styles.subText}>Search by category or location</Text>
      </TouchableOpacity>

      

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.cardText}>🔔 Notifications</Text>
        <Text style={styles.subText}>See updates on your claim statuses</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Inbox')}
>
        <Text style={styles.cardText}>💬 Inbox</Text>
        <Text style={styles.subText}>Chat with donors</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FF99',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 6,
    borderLeftColor: '#00FF99',
  },
  cardText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 5,
  },
  subText: {
    color: '#aaa',
    fontSize: 14,
  },
});
