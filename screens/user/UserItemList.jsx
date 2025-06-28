// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import axios from 'axios';
// import { AuthContext } from '../../context/AuthContext';
// import { useNavigation } from '@react-navigation/native';

// export default function UserItemList() {
//   const { user } = useContext(AuthContext);
//   const [items, setItems] = useState([]);
//   const navigation = useNavigation();

//   useEffect(() => {
//     fetchItems();
//   }, []);

//   const fetchItems = async () => {
//     try {
//       const res = await axios.get('http://192.168.100.59:3000/api/items/all');
//       setItems(res.data);
//     } catch (err) {
//       console.error('Error fetching items:', err);
//     }
//   };

//   const handleClaim = async (itemId) => {
//     try {
//       await axios.post(
//         'http://192.168.100.59:3000/api/claims',
//         { item: itemId },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       Alert.alert('Claim Sent', 'Your claim request has been submitted.');
//     } catch (error) {
//       console.log('Claim error:', error.response?.data || error.message);
//       Alert.alert('Error', 'Could not send claim request.');
//     }
//   };

//   const messageDonor = (donorId, itemId) => {
//     navigation.navigate('ChatScreen', {
//       senderId: user._id,
//       receiverId: donorId,
//       itemId: itemId,
//     });
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
//         {item.images?.map((img, idx) => {
//           const imageUrl = `http://192.168.100.59:3000/uploads/${img}`;
//           return (
//             <Image
//               key={idx}
//               source={{ uri: imageUrl }}
//               style={styles.image}
//               onError={() => console.warn('Image load failed:', imageUrl)}
//             />
//           );
//         })}
//       </ScrollView>

//       <View style={styles.info}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//         <Text style={styles.location}>📍 {item.location}</Text>

//         <View style={styles.buttons}>
//           <TouchableOpacity
//             style={styles.messageBtn}
//             onPress={() => messageDonor(item.user?._id, item._id)}
//           >
//             <Text style={styles.btnText}>Message Donor</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.claimBtn}
//             onPress={() => handleClaim(item._id)}
//           >
//             <Text style={styles.btnText}>Claim Item</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>📦 Browse Available Items</Text>
//       <FlatList
//         data={items}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#121212',
//     flex: 1,
//     padding: 10,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#00FF99',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#1f1f1f',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: '#00FF99',
//   },
//   imageRow: {
//     marginBottom: 10,
//     flexDirection: 'row',
//   },
//   image: {
//     width: 120,
//     height: 100,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   info: {
//     marginTop: 5,
//   },
//   title: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   description: {
//     color: '#ccc',
//     marginVertical: 5,
//   },
//   location: {
//     color: '#aaa',
//     fontStyle: 'italic',
//     marginBottom: 10,
//   },
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 10,
//   },
//   messageBtn: {
//     backgroundColor: '#00FF99',
//     padding: 10,
//     borderRadius: 6,
//     flex: 1,
//     alignItems: 'center',
//   },
//   claimBtn: {
//     backgroundColor: '#0077cc',
//     padding: 10,
//     borderRadius: 6,
//     flex: 1,
//     alignItems: 'center',
//   },
//   btnText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   empty: {
//     textAlign: 'center',
//     color: '#888',
//     marginTop: 50,
//   },
// });














import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../config/api';

export default function UserItemList() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/items/all`);
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err.message);
    }
  };

  

  const messageDonor = (donorId, itemId) => {
    navigation.navigate('ChatWithUser', {
      senderId: user._id,
      receiverId: donorId,
      itemId: itemId,
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageRow}>
        {item.images?.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: `${API_BASE_URL}/${img.replace(/\\/g, '/')}` }}
            style={styles.image}
          />
        ))}
      </ScrollView>

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>
        {item.user?.fullname && (
          <Text style={styles.donor}>👤 Donor: {item.user.fullname}</Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => messageDonor(item.user?._id, item._id)}
          >
            <Text style={styles.btnText}>Message Donor</Text>
          </TouchableOpacity>

          
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📦 Browse Available Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No items found</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00FF99',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00FF99',
  },
  imageRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  description: {
    color: '#ccc',
    marginVertical: 5,
  },
  location: {
    color: '#aaa',
    fontStyle: 'italic',
  },
  donor: {
    color: '#00FF99',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
  },
  messageBtn: {
    backgroundColor: '#00FF99',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  claimBtn: {
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
});

  