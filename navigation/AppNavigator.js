// ✅ AppNavigator.js — NO NavigationContainer here!
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';

// Screens
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import UserDashboard from '../screens/user/UserDashboard';
import UserItemList from '../screens/user/UserItemList';
import UserSearchItems from '../screens/user/UserSearchItems';
import ChatScreen from '../screens/user/ChatScreen';
import InboxScreen from '../screens/user/InboxScreen';
import DonorHome from '../screens/donor/DonorHome';
import DonorItemList from '../screens/donor/DonorItemList';
import DonorAddItem from '../screens/donor/DonorAddItem';
import ChatWithUser from '../screens/donor/ChatWithUser';
import AdminDashboard from '../screens/AdminDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'donor') {
    return (
      <Stack.Navigator>
      <Stack.Screen name="DonorHome" component={DonorHome} />
      <Stack.Screen name="DonorItemList" component={DonorItemList} />
      <Stack.Screen name="DonorAddItem" component={DonorAddItem} />
      <Stack.Screen name="ChatWithUser" component={ChatWithUser} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} /> 
    </Stack.Navigator>
    );
  }

  if (user.role === 'admin') {
    return (
      <Stack.Navigator>
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="UserDashboard" component={UserDashboard} options={{ headerShown: false }} />
      <Stack.Screen name="UserItemList" component={UserItemList} />
      <Stack.Screen name="UserSearchItems" component={UserSearchItems} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChatWithUser" component={ChatWithUser} />
      <Stack.Screen name="Inbox" component={InboxScreen} />
    </Stack.Navigator>
  );
}
