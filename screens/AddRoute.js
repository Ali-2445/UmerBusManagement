// AddRouteScreen.js
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddRouteScreen = () => {
  const [route, setRoute] = useState('');
  const [stops, setStops] = useState(['']);

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleRemoveStop = index => {
    const updatedStops = stops.filter((stop, i) => i !== index);
    setStops(updatedStops);
  };

  const handleStopChange = (index, value) => {
    const updatedStops = [...stops];
    updatedStops[index] = value;
    setStops(updatedStops);
  };

  const handleAddRoute = () => {
    // Add the new route and stops to the "Routes" collection in Firestore
    if (!route || stops.length == 0) {
      alert('Enter complete details');
      return;
    }
    firestore()
      .collection('Routes')
      .add({
        route: route,
        stops: stops,
      })
      .then(() => {
        alert('Route added successfully!');
        setRoute('');
        setStops(['']);
      })
      .catch(error => {
        alert(error.message);
        console.log('Error adding route:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Route</Text>
      <TextInput
        style={styles.input}
        placeholder="Route"
        onChangeText={text => setRoute(text)}
        value={route}
      />
      {stops.map((stop, index) => (
        <View style={styles.stopContainer} key={index}>
          <TextInput
            style={styles.input}
            placeholder="Stop"
            onChangeText={text => handleStopChange(index, text)}
            value={stop}
          />
          {index > 0 && (
            <View style={{marginLeft: '10%'}}>
              <Button title="Remove" onPress={() => handleRemoveStop(index)} />
            </View>
          )}
        </View>
      ))}
      <Button title="Add Stop" onPress={handleAddStop} />
      <View style={styles.mt} />
      <Button title="Save" onPress={handleAddRoute} />
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
  stopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mt: {
    marginTop: '4%',
  },
});

export default AddRouteScreen;
