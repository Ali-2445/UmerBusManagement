// SignupScreen.js
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomButton from './components/CustomButton';

// const backgroundImage = require('./assets/background.jpg'); // Replace with your own background image

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [classs, setClass] = useState('');
  const [regNo, setRegno] = useState('');

  const handleSignup = () => {
    if (!name || !email || !classs || !regNo) {
      alert('Fill all details');
      return;
    }
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        // Add additional user data to Firebase Firestore or Realtime Database
        firestore()
          .collection('users')
          .doc(user.uid)
          .set({
            name,
            email,
            classs,
            role: 'student',
            regNo,
          })
          .then(r => {
            alert('Sucessfully signed up. Login to continue');
            setName('');
            setEmail('');
            setClass('');
            setPassword('');
          });
      })
      .catch(error => {
        alert(error.message);
        console.log('Signup error:', error);
      });
  };

  return (
    // <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={text => setName(text)}
        value={name}
      />
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
      {/* <TextInput
        style={styles.input}
        placeholder="Image URL"
        onChangeText={text => setImage(text)}
        value={image}
      /> */}
      <TextInput
        style={styles.input}
        placeholder="Class"
        onChangeText={text => setClass(text)}
        value={classs}
      />
      <TextInput
        style={styles.input}
        placeholder="Registration Number"
        onChangeText={text => setRegno(text)}
        value={regNo}
      />
      <CustomButton title="Signup" onPress={handleSignup} />
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#A0B3C6',
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default SignupScreen;
