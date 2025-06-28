import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function DonorHome({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header with welcome and logout */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.welcomeText}>Welcome, {user?.fullname} 👋</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://img.icons8.com/color/96/experimental-box--v2.png' }}
          style={styles.icon}
        />
      </View>

      {/* Menu options */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonorAddItem')}>
          <Text style={styles.cardTitle}>➕ Upload Item</Text>
          <Text style={styles.cardDesc}>Add items you want to donate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DonorItemList')}>
          <Text style={styles.cardTitle}>📦 My Items</Text>
          <Text style={styles.cardDesc}>Manage your uploaded items</Text>
        </TouchableOpacity>

       


<TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Inbox')}>
  <Text style={styles.cardTitle}>💬 Chats</Text>
  <Text style={styles.cardDesc}>Talk with interested users</Text>
</TouchableOpacity>



        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Notifications')}>
          <Text style={styles.cardTitle}>🔔 Alerts</Text>
          <Text style={styles.cardDesc}>Get notified for requests/messages</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Your contribution matters 💚</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  welcomeText: {
    color: '#00FF99',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: '#cc0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    width: 70,
    height: 70,
    alignSelf: 'center',
  },
  menu: {
    flex: 1,
    marginTop: 30,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#00FF99',
  },
  cardTitle: {
    color: '#00FF99',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  cardDesc: {
    color: '#aaa',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    padding: 10,
    borderTopColor: '#333',
    borderTopWidth: 1,
  },
  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});
