// LoginScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomButton from './components/CustomButton';

import 'firebase/auth';

// const backgroundImage = require('./assets/background.jpg'); // Replace with your own background image

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Check if a user is already logged in
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is logged in, navigate to their respective screen based on role
        const userRole = user.role;
        if (userRole === 'student') {
          navigation.navigate('StudentHomeScreen');
        } else if (userRole === 'admin') {
          navigation.navigate('AdminHomeScreen');
        }
      } else {
        // User is not logged in
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter all details');
      return;
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        // Retrieve user role from Firebase Firestore or Realtime Database
        firestore()
          .collection('users')
          .doc(user.uid)
          .get()
          .then(doc => {
            if (doc.exists) {
              const userData = doc.data();
              if (userData.role === 'student') {
                navigation.navigate('StudentHomeScreen');
              } else if (userData.role === 'admin') {
                navigation.navigate('AdminHomeScreen');
              }
            } else {
              alert('Incorrect username or password');
            }
          })
          .catch(error => {
            alert(error.message);
            console.log('Firestore retrieval error:', error);
          });
      })
      .catch(error => {
        alert(error.message);
        console.log('Login error:', error);
      });
  };
  return (
    // <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <CustomButton title="Login" onPress={handleLogin} />

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}>
          <Text style={styles.signupButton}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#A0B3C6',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: 'black',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: 'white',
    fontSize: 16,
  },
  signupButton: {
    color: '#64b5f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
