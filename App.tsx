// // import React, {useEffect} from 'react';
// // import {initializeApp} from 'firebase/app';
// // import {firebaseConfig} from './config/firebase';
// // import {NavigationContainer} from '@react-navigation/native';
// // import {createStackNavigator} from '@react-navigation/stack';
// // import LoginScreen from './screens/Login';
// // import SignupScreen from './screens/SignupScreen';
// // import StudentHomeScreen from './screens/StudentHomeScreen';
// // import AdminHomeScreen from './screens/AdminHomeScreen';
// // import AssignBusScreen from './screens/AssignBus';
// // import AddBusScreen from './screens/AddBus';
// // import AddRouteScreen from './screens/AddRoute';
// // import AssignedBusesScreen from './screens/AssignedBusScreen';
// // import BusListScreen from './screens/ViewBus';

// // const App = () => {
// //   const Stack = createStackNavigator();
// //   useEffect(() => {
// //     initializeApp(firebaseConfig);
// //   }, []);
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator initialRouteName="LoginScreen">
// //         <Stack.Screen name="LoginScreen" component={LoginScreen} />
// //         <Stack.Screen name="SignupScreen" component={SignupScreen} />
// //         <Stack.Screen name="StudentHomeScreen" component={StudentHomeScreen} />
// //         <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
// //         <Stack.Screen name="AssignBusScreen" component={AssignBusScreen} />
// //         <Stack.Screen name="AddBusScreen" component={AddBusScreen} />
// //         <Stack.Screen name="AddRouteScreen" component={AddRouteScreen} />
// //         <Stack.Screen
// //           name="AssignedBusScreen"
// //           component={AssignedBusesScreen}
// //         />
// //         <Stack.Screen name="BusListScreen" component={BusListScreen} />
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // };

// // export default App;

// import React, {useEffect} from 'react';
// import {initializeApp} from 'firebase/app';
// import {firebaseConfig} from './config/firebase';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import LoginScreen from './screens/Login';
// import SignupScreen from './screens/SignupScreen';
// import StudentHomeScreen from './screens/StudentHomeScreen';
// import AdminHomeScreen from './screens/AdminHomeScreen';
// import AssignBusScreen from './screens/AssignBus';
// import AddBusScreen from './screens/AddBus';
// import AddRouteScreen from './screens/AddRoute';
// import AssignedBusesScreen from './screens/AssignedBusScreen';
// import BusListScreen from './screens/ViewBus';
// import auth from '@react-native-firebase/auth';

// const App = ({navigation}) => {
//   const Stack = createStackNavigator();

//   useEffect(() => {
//     initializeApp(firebaseConfig);
//   }, []);

//   // Check if a user is already logged in
//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(user => {
//       console.log(user);
//       if (user) {
//         // User is logged in, navigate to their respective screen based on role
//         const userRole = user?.role;
//         if (userRole === 'student') {
//           navigation?.navigate('StudentHomeScreen');
//         } else if (userRole === 'admin') {
//           navigation?.navigate('AdminHomeScreen');
//         }
//       } else {
//         // User is not logged in, stay on the LoginScreen
//       }
//     });

//     // Clean up the listener when the component unmounts
//     return () => unsubscribe();
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="LoginScreen">
//         <Stack.Screen name="LoginScreen" component={LoginScreen} />
//         <Stack.Screen name="SignupScreen" component={SignupScreen} />
//         <Stack.Screen name="StudentHomeScreen" component={StudentHomeScreen} />
//         <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
//         <Stack.Screen name="AssignBusScreen" component={AssignBusScreen} />
//         <Stack.Screen name="AddBusScreen" component={AddBusScreen} />
//         <Stack.Screen name="AddRouteScreen" component={AddRouteScreen} />
//         <Stack.Screen
//           name="AssignedBusScreen"
//           component={AssignedBusesScreen}
//         />
//         <Stack.Screen name="BusListScreen" component={BusListScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import React, {useEffect, useState} from 'react';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from './config/firebase';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/SignupScreen';
import StudentHomeScreen from './screens/StudentHomeScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import AssignBusScreen from './screens/AssignBus';
import AddBusScreen from './screens/AddBus';
import AddRouteScreen from './screens/AddRoute';
import AssignedBusesScreen from './screens/AssignedBusScreen';
import BusListScreen from './screens/ViewBus';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const App = () => {
  const Stack = createStackNavigator();
  const [initialRouteName, setInitialRouteName] = useState();

  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        // User is logged in, retrieve user data from Firestore and set initialRouteName based on role
        firestore()
          .collection('users')
          .where('email', '==', user.email)
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data();
              if (userData.role === 'student') {
                setInitialRouteName('StudentHomeScreen');
              } else if (userData.role === 'admin') {
                setInitialRouteName('AdminHomeScreen');
              }
            } else {
              // User data not found, stay on the LoginScreen
            }
          })
          .catch(error => {
            console.log('Firestore query error:', error);
          });
      } else {
        setInitialRouteName('LoginScreen');

        // User is not logged in, stay on the LoginScreen
      }
    });

    // Clean up the listener when the component unmounts
    // return () => unsubscribe();
  }, []);

  if (!initialRouteName) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="StudentHomeScreen" component={StudentHomeScreen} />
        <Stack.Screen name="AdminHomeScreen" component={AdminHomeScreen} />
        <Stack.Screen name="AssignBusScreen" component={AssignBusScreen} />
        <Stack.Screen name="AddBusScreen" component={AddBusScreen} />
        <Stack.Screen name="AddRouteScreen" component={AddRouteScreen} />
        <Stack.Screen
          name="AssignedBusScreen"
          component={AssignedBusesScreen}
        />
        <Stack.Screen name="BusListScreen" component={BusListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
