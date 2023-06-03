import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import {captureRef} from 'react-native-view-shot';
import ViewShot from 'react-native-view-shot';

const BusListScreen = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Fetch data from the "Buses" collection in Firestore
    const unsubscribe = firestore()
      .collection('Buses')
      .onSnapshot(snapshot => {
        const busData = [];
        snapshot.forEach(doc => {
          const bus = doc.data();
          busData.push({id: doc.id, ...bus});
        });
        setBuses(busData);
        console.log(busData);
      });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const handleEdit = bus => {
    // Handle edit functionality for the selected bus
    // You can navigate to another screen to edit the bus details
    console.log('Edit:', bus);
  };

  const handleDelete = busId => {
    firestore()
      .collection('Buses')
      .doc(busId)
      .delete()
      .then(() => {
        console.log('Bus deleted successfully!');
      })
      .catch(error => {
        console.log('Error deleting bus:', error);
      });
  };
  const qrCodeRef = useRef(null);

  const handleShare = async busNumber => {
    try {
      const fileName = `${busNumber}.png`;
      await captureRef(qrCodeRef.current, {
        format: 'png',
      }).then(uri => {
        const shareOptions = {
          title: 'Share QR Code',
          url: `file://${uri}`,
          failOnCancel: false,
          filename: fileName,
        };

        Share.open(shareOptions)
          .then(res => {
            console.log('QR Code shared successfully');
          })
          .catch(err => {
            console.log('Error sharing QR Code:', err);
          });
      });
    } catch (error) {
      console.log('Error capturing QR Code:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bus List</Text>
      {buses.length > 0
        ? buses.map(bus => (
            <View key={bus.id} style={styles.card}>
              <Text style={styles.busNumber}>{bus.busNumber}</Text>
              <View style={styles.qrCodeContainer}>
                <ViewShot ref={qrCodeRef} options={{format: 'png', quality: 1}}>
                  <QRCode value={bus.busNumber} size={120} ref={qrCodeRef} />
                </ViewShot>
              </View>
              <Text style={styles.driverName}>
                Driver Name: {bus.driverName}
              </Text>
              <Text style={styles.driverPhone}>
                Driver Phone: {bus.driverPhone}
              </Text>
              <Text style={styles.route}>Route: {bus.route}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(bus)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShare(bus.busNumber)}>
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(bus.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  driverName: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  driverPhone: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  route: {
    fontSize: 16,
    marginBottom: 12,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  shareButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginLeft: 8,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF0000',
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusListScreen;
