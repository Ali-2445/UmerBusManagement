import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useIsFocused} from '@react-navigation/native';

const AssignedBusesScreen = ({navigation}) => {
  const focused = useIsFocused();
  const [busData, setBusData] = useState([]);

  useEffect(() => {
    fetchBusData();
  }, [focused]);

  const fetchBusData = async () => {
    const snapshot = await firestore().collection('AssignedBuses').get();
    const buses = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setBusData(buses);
  };

  const handleEdit = bus => {
    // Handle edit functionality for the selected bus
    navigation.navigate('AssignBusScreen', {data: bus, isEdit: true});
    console.log('Edit:', bus);
  };

  const handleDelete = async bus => {
    try {
      await firestore().collection('AssignedBuses').doc(bus.id).delete();
      setBusData(prevData => prevData.filter(item => item.id !== bus.id));
    } catch (error) {
      Alert('Some error occured');
      console.log('Error deleting bus:', error);
    }
  };

  const renderCard = ({item}) => {
    console.log(item);
    return (
      <View style={styles.card}>
        <Text style={styles.busName}>{item.user}</Text>
        <Text style={styles.route}>{item.route}</Text>
        <Text style={styles.stop}>{item.stop}</Text>
        <Text style={styles.user}>{item.bus}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={busData}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={renderCard}
        keyExtractor={item => item.bus}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  busName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  route: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  stop: {
    marginTop: 4,
  },
  user: {
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  editButton: {
    marginRight: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'blue',
    borderRadius: 4,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default AssignedBusesScreen;
