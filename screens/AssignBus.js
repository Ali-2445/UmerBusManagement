// AssignBusScreen.js
import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';

const AssignBusScreen = ({}) => {
  const routee = useRoute();
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [allRoutes, setAllRoutes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  useEffect(() => {
    // Fetch users with role "student" from the "Users" collection in Firebase Firestore
    firestore()
      .collection('users')
      .where('role', '==', 'student')
      .onSnapshot(snapshot => {
        const userData = [];
        snapshot.forEach(doc => {
          const user = doc.data();
          userData.push({
            label: user.name + ' ' + user.regNo,
            value: user.name + ' ' + user.regNo,
          });
        });
        setUsers(userData);
      });

    // Fetch routes from the "Routes" collection in Firebase Firestore
    firestore()
      .collection('Routes')
      .onSnapshot(snapshot => {
        const routeData = [];
        const allRoutess = [];
        snapshot.forEach(doc => {
          const route = doc.data();
          allRoutes.push(route);
          routeData.push({
            label: route.route,
            value: route.route,
          });
        });
        setRoutes(routeData);
        setAllRoutes(allRoutess);
      });
  }, []);

  useEffect(() => {
    if (selectedRoute) {
      firestore()
        .collection('Routes')
        .where('route', '==', selectedRoute)
        .onSnapshot(snapshot => {
          const sttops = [];
          snapshot.forEach(doc => {
            const data = doc?.data();
            data?.stops?.map((item, _) => {
              sttops.push({
                label: item,
                value: item,
              });
            });
          });
          console.log(sttops);
          setStops(sttops);
        });
    }
  }, [selectedRoute]);

  useEffect(() => {
    // Fetch buses from the "Buses" collection in Firebase Firestore
    if (selectedRoute) {
      firestore()
        .collection('Buses')
        .where('route', '==', selectedRoute)
        .onSnapshot(snapshot => {
          const busData = [];
          snapshot.forEach(doc => {
            const bus = doc.data();
            busData.push({
              label: bus.busNumber,
              value: bus.busNumber,
            });
          });
          setBuses(busData);
        });
    }
  }, [selectedRoute]);

  useEffect(() => {
    if (routee?.params && routee?.params?.isEdit) {
      navigation.setOptions({title: 'Edit Student Info'});
      setIsEdit(true);
      const {bus, route, stop, user} = routee?.params?.data;
      setSelectedBus(bus);
      setSelectedUser(user);
      setSelectedRoute(route);
      setSelectedStop(stop);
    }
  }, []);
  const handleAssignBus = () => {
    // Store the assigned bus data in the "AssignedBuses" collection in Firestore
    // firestore()
    //   .collection('AssignedBuses')
    //   .add({
    //     user: selectedUser,
    //     route: selectedRoute,
    //     stop: selectedStop,
    //     bus: selectedBus,
    //   })
    //   .then(() => {
    //     setSelectedBus('');
    //     setSelectedStop('');
    //     setSelectedRoute('');
    //     setSelectedUser('');
    //     alert('Bus assigned successfully');
    //     console.log('Bus assigned successfully!');
    //   })
    //   .catch(error => {
    //     alert('Some error occured');

    //     console.log('Error assigning bus:', error);
    //   });
    if (!selectedBus || !selectedRoute || !selectedStop || !selectedUser) {
      alert('Complete all details');
      return;
    }
    if (isEdit) {
      // Handle edit functionality
      firestore()
        .collection('AssignedBuses')
        .doc(routee?.params?.data?.id)
        .update({
          user: selectedUser,
          route: selectedRoute,
          stop: selectedStop,
          bus: selectedBus,
        })
        .then(() => {
          setSelectedBus('');
          setSelectedStop('');
          setSelectedRoute('');
          setSelectedUser('');
          alert('Bus updated successfully');
          console.log('Data updated successfully!');
          navigation.goBack();
        })
        .catch(error => {
          alert('Some error occurred');
          console.log('Error updating bus:', error);
        });
    } else {
      // Handle assign functionality
      firestore()
        .collection('AssignedBuses')
        .add({
          user: selectedUser,
          route: selectedRoute,
          stop: selectedStop,
          bus: selectedBus,
        })
        .then(() => {
          setSelectedBus('');
          setSelectedStop('');
          setSelectedRoute('');
          setSelectedUser('');
          alert('Bus assigned successfully');
          console.log('Bus assigned successfully!');
        })
        .catch(error => {
          alert('Some error occurred');
          console.log('Error assigning bus:', error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Edit Info' : 'Assign Bus to Student'}
      </Text>
      <Picker
        selectedValue={selectedUser}
        onValueChange={(itemValue, itemIndex) => setSelectedUser(itemValue)}>
        <Picker.Item label="Select User" value={null} />
        {users.map(user => (
          <Picker.Item key={user.value} label={user.label} value={user.value} />
        ))}
      </Picker>
      <Picker
        selectedValue={selectedRoute}
        onValueChange={(itemValue, itemIndex) => setSelectedRoute(itemValue)}>
        <Picker.Item label="Select Route" value={null} />
        {routes.map(route => (
          <Picker.Item
            key={route.value}
            label={route.label}
            value={route.value}
          />
        ))}
      </Picker>
      {selectedRoute && (
        <Picker
          selectedValue={selectedBus}
          onValueChange={(itemValue, itemIndex) => setSelectedBus(itemValue)}>
          <Picker.Item label="Select Bus" value={null} />
          {buses.map(bus => (
            <Picker.Item key={bus.value} label={bus.label} value={bus.value} />
          ))}
        </Picker>
      )}
      {selectedRoute && (
        <Picker
          selectedValue={selectedStop}
          onValueChange={(itemValue, itemIndex) => setSelectedStop(itemValue)}>
          <Picker.Item label="Select Stop" value={null} />
          {stops.map(stop => (
            <Picker.Item
              key={stop.value}
              label={stop.label}
              value={stop.value}
            />
          ))}
        </Picker>
      )}
      <Button
        title={isEdit ? 'Confirm Edit' : 'Assign Bus'}
        onPress={handleAssignBus}
      />
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
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    borderWidth: 0,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownDropdown: {
    backgroundColor: '#fafafa',
  },
});

export default AssignBusScreen;
