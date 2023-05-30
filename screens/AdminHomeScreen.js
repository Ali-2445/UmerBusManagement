import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import auth from '@react-native-firebase/auth';
import CustomButton from './components/CustomButton';

const AdminHomeScreen = ({navigation}) => {
  useEffect(() => {
    // Set the navigation options for the screen
    navigation.setOptions({
      headerRight: () => (
        <View style={{marginRight: 10}}>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ),
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
        }}>
        <CustomButton
          title="Assign Bus"
          onPress={() => {
            navigation.navigate('AssignBusScreen');
          }}
        />

        <View style={styles.mt} />
        <CustomButton
          title="Add Bus"
          onPress={() => {
            navigation.navigate('AddBusScreen');
          }}
        />
        <View style={styles.mt} />
        <CustomButton
          title="Add Route"
          onPress={() => {
            navigation.navigate('AddRouteScreen');
          }}
        />
        <View style={styles.mt} />

        <CustomButton
          title="Students List"
          onPress={() => {
            navigation.navigate('AssignedBusScreen');
          }}
        />
        <View style={styles.mt} />

        <CustomButton
          title="View Buses"
          onPress={() => {
            navigation.navigate('BusListScreen');
          }}
        />
      </ScrollView>
    </View>
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
  mt: {
    marginTop: '5%',
  },
});

export default AdminHomeScreen;
