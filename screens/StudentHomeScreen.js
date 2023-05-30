import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ToastAndroid, Button} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const QRScannerScreen = ({navigation}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the authenticated user's data from the "Users" collection
    const fetchUser = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userSnapshot = await firestore()
            .collection('users')
            .where('email', '==', currentUser.email)
            .limit(1)
            .get();

          if (!userSnapshot.empty) {
            setUser(userSnapshot.docs[0].data());
          }
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleScan = async ({data}) => {
    try {
      const [busNumber] = data.split(' ');

      const querySnapshot = await firestore()
        .collection('AssignedBuses')
        .where('bus', '==', busNumber)
        .where('user', '==', user?.name + ' ' + user?.regNo)
        .get();

      if (!querySnapshot.empty) {
        ToastAndroid.show('This is your assigned bus', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          'This bus is not assigned to you',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.log('Error querying assigned buses:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  // Set the navigation options for the screen
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ),
    });
  }, [navigation, handleLogout]);

  return (
    <View style={styles.container}>
      <Text style={styles.userName}>
        {user ? `Welcome, ${user.name}` : 'Loading user...'}
      </Text>
      <QRCodeScanner onRead={handleScan} />
      <Text style={styles.instructions}>
        Scan a bus QR code to check if it is assigned to you
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default QRScannerScreen;
