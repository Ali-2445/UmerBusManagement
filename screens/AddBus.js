// AddBusScreen.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import 'firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

const AddBusScreen = ({navigation}) => {
  const [busNumber, setBusNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    // Fetch routes from the "Routes" collection in Firebase Firestore
    firestore()
      .collection('Routes')
      .onSnapshot(snapshot => {
        const routeData = [];
        snapshot.forEach(doc => {
          const route = doc.data();

          routeData.push({
            label: route.route,
            value: route.route,
          });
        });
        console.log(routeData);
        setRoutes(routeData);
      });
  }, []);

  const handleAddBus = () => {
    if (!busNumber || !driverName || !driverPhone || !selectedRoute) {
      alert('Enter complete info');
      return;
    }
    // Add the new bus to the "Buses" collection in Firestore
    firestore()
      .collection('Buses')
      .add({
        busNumber: busNumber,
        driverName: driverName,
        driverPhone: driverPhone,
        route: selectedRoute,
      })
      .then(() => {
        alert('Bus added successfully!');
        setSelectedRoute(null);
        setBusNumber('');
        setDriverName('');
        setDriverName('');
        navigation.goBack();
      })
      .catch(error => {
        console.log('Error adding bus:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Bus</Text>
      <TextInput
        style={styles.input}
        placeholder="Bus Number"
        onChangeText={text => setBusNumber(text)}
        value={busNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Driver Name"
        onChangeText={text => setDriverName(text)}
        value={driverName}
      />
      <TextInput
        style={styles.input}
        placeholder="Driver Phone"
        onChangeText={text => setDriverPhone(text)}
        value={driverPhone}
        keyboardType="numeric"
      />
      {/* <DropDownPicker
        items={routes}
        defaultValue={selectedRoute}
        placeholder="Select Route"
        schema={{
          label: 'title',
          value: 'val',
        }}
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
        itemStyle={styles.dropdownItem}
        dropDownStyle={styles.dropdownDropdown}
        onChangeItem={item => setSelectedRoute(item.value)}
      /> */}
      <Picker
        selectedValue={selectedRoute}
        onValueChange={(itemValue, itemIndex) => setSelectedRoute(itemValue)}>
        <Picker.Item label="Select Route" value={null} />
        {routes.map(user => (
          <Picker.Item key={user.value} label={user.label} value={user.value} />
        ))}
      </Picker>
      <View style={styles.mt} />
      <Button title="Add Bus" onPress={handleAddBus} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#fafafa',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
    zIndex: 10000,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderWidth: 0,
    zIndex: 1000,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
    zIndex: 1000,
  },
  dropdownDropdown: {
    backgroundColor: '#fafafa',
  },
  mt: {
    marginTop: '4%',
  },
});

export default AddBusScreen;
