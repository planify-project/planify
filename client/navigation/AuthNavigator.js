// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// import LoginScreen from '../screens/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen';
// import HomeScreen from '../screens/HomeScreen';
// import app from "../configs/config.js";
// import AppNavigator from './AppNavigator';

// const Stack = createNativeStackNavigator();
// const auth = getAuth(app);

// const AuthNavigator = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const handleLogin = async () => {
//     setError('');
//     try {
//       if (!email || !password) {
//         setError('Email and password are required');
//         return;
//       }
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error(error.message);
//       if (error.code === 'auth/invalid-email') {
//         setError('Invalid email address');
//       } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//         setError('Invalid email or password');
//       } else {
//         setError('Authentication failed: ' + error.message);
//       }
//     }
//   };

//   const handleSignUp = async () => {
//     setError('');
//     try {
//       if (!username || !email || !password) {
//         setError('Username, email, and password are required');
//         return;
//       }
//       if (password.length < 6) {
//         setError('Password should be at least 6 characters');
//         return;
//       }
      
//      createUserWithEmailAndPassword(auth, email, password);
//       console.log('User registered successfully');
//     } catch (error) {
//       console.error(error.message);
//       if (error.code === 'auth/invalid-email') {
//         setError('Invalid email address');
//       } else if (error.code === 'auth/email-already-in-use') {
//         setError('Email already in use');
//       } else {
//         setError('Registration failed: ' + error.message);
//       }
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const switchToLogin = () => {
//     setError('');
//   };

//   const switchToSignUp = () => {
//     setError('');
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }


//   return
//    user ? <AppNavigator /> :(
// <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//   <Stack.Screen name="Login">
//     {(props) => (
//       <LoginScreen
//         {...props}
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleLogin={handleLogin}
//         error={error}
//         setError={setError}
//         switchToSignUp={switchToSignUp}
//       />
//     )}
//   </Stack.Screen>
//   <Stack.Screen name="SignUp">
//     {(props) => (
//       <SignUpScreen
//         {...props}
//         username={username}
//         setUsername={setUsername}
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleSignUp={handleSignUp}
//         error={error}
//         setError={setError}
//         switchToLogin={switchToLogin}
//       />
//     )}
//   </Stack.Screen>
// </Stack.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default AuthNavigator;

// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// import LoginScreen from '../screens/LoginScreen';
// import SignUpScreen from '../screens/SignUpScreen';
// import HomeScreen from '../screens/HomeScreen';
// import app from "../configs/config.js";

// const Stack = createNativeStackNavigator();
// const auth = getAuth(app);

// const AuthNavigator = () => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const handleLogin = async () => {
//     setError('');
//     try {
//       if (!email || !password) {
//         setError('Email and password are required');
//         return;
//       }
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error(error.message);
//       if (error.code === 'auth/invalid-email') {
//         setError('Invalid email address');
//       } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
//         setError('Invalid email or password');
//       } else {
//         setError('Authentication failed: ' + error.message);
//       }
//     }
//   };

//   const handleSignUp = async () => {
//     setError('');
//     try {
//       if (!username || !email || !password) {
//         setError('Username, email, and password are required');
//         return;
//       }
//       if (password.length < 6) {
//         setError('Password should be at least 6 characters');
//         return;
//       }
//       await createUserWithEmailAndPassword(auth, email, password);
//       console.log('User registered successfully');
//     } catch (error) {
//       console.error(error.message);
//       if (error.code === 'auth/invalid-email') {
//         setError('Invalid email address');
//       } else if (error.code === 'auth/email-already-in-use') {
//         setError('Email already in use');
//       } else {
//         setError('Registration failed: ' + error.message);
//       }
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const switchToLogin = () => {
//     setError('');
//   };

//   const switchToSignUp = () => {
//     setError('');
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
// <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
//   <Stack.Screen 
//     name="Login" 
//     children={(props) => (
//       <LoginScreen
//         {...props}
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleLogin={handleLogin}
//         error={error}
//         setError={setError}
//         switchToSignUp={() => props.navigation.navigate('SignUp')} // Navigate to SignUp
//       />
//     )}
//   />
//   <Stack.Screen 
//     name="SignUp" 
//     children={(props) => (
//       <SignUpScreen
//         {...props}
//         username={username}
//         setUsername={setUsername}
//         email={email}
//         setEmail={setEmail}
//         password={password}
//         setPassword={setPassword}
//         handleSignUp={handleSignUp}
//         error={error}
//         setError={setError}
//         switchToLogin={() => props.navigation.navigate('Login')} // Navigate to Login
//       />
//     )}
//   />
// </Stack.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default AuthNavigator;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import app from "../configs/firebase_config";

const Stack = createNativeStackNavigator();
const auth = getAuth(app);

const AuthNavigator = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    setError('');
    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.message);
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else {
        setError('Authentication failed: ' + error.message);
      }
    }
  };

  const handleSignUp = async () => {
    setError('');
    try {
      if (!username || !email || !password) {
        setError('Username, email, and password are required');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters');
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully');
    } catch (error) {
      console.error(error.message);
      if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use');
      } else {
        setError('Registration failed: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="Login" 
        children={(props) => (
          <LoginScreen
            {...props}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            error={error}
            setError={setError}
            switchToSignUp={() => props.navigation.navigate('SignUp')} // Navigate to SignUp
          />
        )}
      />
      <Stack.Screen 
        name="SignUp" 
        children={(props) => (
          <SignUpScreen
            {...props}
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSignUp={handleSignUp}
            error={error}
            setError={setError}
            switchToLogin={() => props.navigation.navigate('Login')} // Navigate to Login
          />
        )}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthNavigator;