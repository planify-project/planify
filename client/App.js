
// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   StyleSheet, 
//   ScrollView, 
//   Image, 
//   StatusBar,
//   SafeAreaView
// } from 'react-native';
// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// const firebaseConfig = {
//   apiKey: "AIzaSyCtcxLaRb4amBYm8sDSPfSrKra0K7He_dM",
//   authDomain: "planify-a9124.firebaseapp.com",
//   projectId: "planify-a9124",
//   storageBucket: "planify-a9124.firebasestorage.app",
//   messagingSenderId: "941109727528",
//   appId: "1:941109727528:web:5ed694e76e3840dac0801d",
//   measurementId: "G-8RQG4TJWVY"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Login Screen
// const LoginScreen = ({ email, setEmail, password, setPassword, handleLogin, error, switchToSignUp }) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* Header with "Login" text */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Login</Text>
//       </View>
      
//       {/* Main Container */}
//       <View style={styles.authContainer}>
//         {/* Illustration */}
//         <View style={styles.illustrationContainer}>
//           <Image 
//             source={require('./assets/icon.png')} 
//             style={styles.illustration}
//             resizeMode="contain"
//           />
//         </View>
        
//         {/* Welcome text */}
//         <Text style={styles.welcomeText}>WELCOME BACK</Text>
        
//         {/* Email Field */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>EMAIL/USER NAME</Text>
//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter your email"
//             placeholderTextColor="#888"
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />
//         </View>
        
//         {/* Password Field */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>PASSWORD</Text>
//           <TextInput
//             style={styles.input}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             placeholder="Enter your password"
//             placeholderTextColor="#888"
//           />
//           <TouchableOpacity style={styles.forgotPasswordContainer}>
//             <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
//           </TouchableOpacity>
//         </View>
        
//         {/* Error message if any */}
//         {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
//         {/* Sign in Button */}
//         <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
//           <Text style={styles.signInButtonText}>Sign in</Text>
//         </TouchableOpacity>
        
//         {/* Create account link */}
//         <TouchableOpacity 
//           style={styles.createAccountButton} 
//           onPress={switchToSignUp}
//         >
//           <Text style={styles.createAccountText}>Create new account</Text>
//         </TouchableOpacity>
        
//         {/* Bottom indicator */}
//         {/* <View style={styles.bottomIndicator}></View> */}
//       </View>
//     </SafeAreaView>
//   );
// };

// // Sign Up Screen
// const SignUpScreen = ({ username, setUsername, email, setEmail, password, setPassword, handleSignUp, error, switchToLogin }) => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* Header with text */}
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Sign Up</Text>
//       </View>
      
//       {/* Main Container */}
//       <View style={styles.authContainer}>
//         {/* Illustration */}
//         <View style={styles.illustrationContainer}>
//           <Image 
//             source={require('./assets/icon.png')} 
//             style={styles.illustration}
//             resizeMode="contain"
//           />
//         </View>
        
//         {/* Title */}
//         <Text style={styles.welcomeText}>CREATE YOUR ACCOUNT</Text>
        
//         {/* Username Field */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>USER NAME</Text>
//           <TextInput
//             style={styles.input}
//             value={username}
//             onChangeText={setUsername}
//             placeholder="Enter your username"
//             placeholderTextColor="#888"
//             autoCapitalize="none"
//           />
//         </View>
        
//         {/* Email Field */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>EMAIL</Text>
//           <TextInput
//             style={styles.input}
//             value={email}
//             onChangeText={setEmail}
//             placeholder="Enter your email"
//             placeholderTextColor="#888"
//             autoCapitalize="none"
//             keyboardType="email-address"
//           />
//         </View>
        
//         {/* Password Field */}
//         <View style={styles.inputContainer}>
//           <Text style={styles.inputLabel}>PASSWORD</Text>
//           <TextInput
//             style={styles.input}
//             value={password}
//             onChangeText={setPassword}
//             secureTextEntry
//             placeholder="Enter your password"
//             placeholderTextColor="#888"
//           />
//         </View>
        
//         {/* Error message if any */}
//         {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
//         {/* Sign Up Button */}
//         <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
//           <Text style={styles.signInButtonText}>Sign up</Text>
//         </TouchableOpacity>
        
//         {/* Already have account link */}
//         <TouchableOpacity 
//           style={styles.createAccountButton} 
//           onPress={switchToLogin}
//         >
//           <Text style={styles.createAccountText}>Already have an account</Text>
//         </TouchableOpacity>
        
//         {/* Bottom indicator */}
//         <View style={styles.bottomIndicator}></View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const AuthenticatedScreen = ({ user, handleLogout }) => {
//   return (
//     <View style={styles.welcomeContainer}>
//       <Text style={styles.welcomeTitle}>Welcome</Text>
//       <Text style={styles.emailText}>{user.email}</Text>
//       <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//         <Text style={styles.logoutButtonText}>Logout</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const Stack = createStackNavigator();

// export default function App() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [user, setUser] = useState(null);
//   const [isLogin, setIsLogin] = useState(true);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);
 
//   const handleLogin = async () => {
//     setError('');
    
//     try {
//       if (!email || !password) {
//         setError('Email and password are required');
//         return;
//       }

//       // Sign in
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log('User signed in successfully!');
//     } catch (error) {
//       console.error('Authentication error:', error.message);
      
//       // Translate Firebase error messages to user-friendly messages
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
//         setError('Username, email and password are required');
//         return;
//       }

//       if (password.length < 6) {
//         setError('Password should be at least 6 characters');
//         return;
//       }

//       // Sign up
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       console.log('User created successfully!');
      
//       // Add username to user profile (Firebase doesn't have username built-in)
//       // You may want to store the username in Firestore or another database
//     } catch (error) {
//       console.error('Authentication error:', error.message);
      
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
//       console.log('User logged out successfully!');
//     } catch (error) {
//       console.error('Logout error:', error.message);
//     }
//   };

//   const switchToLogin = () => {
//     setIsLogin(true);
//     setError('');
//   };

//   const switchToSignUp = () => {
//     setIsLogin(false);
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
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {user ? (
//           <Stack.Screen 
//             name="Home" 
//             component={() => <AuthenticatedScreen user={user} handleLogout={handleLogout} />} 
//           />
//         ) : (
//           <>
//             <Stack.Screen 
//               name="Login" 
//               component={() => (
//                 <LoginScreen
//                   email={email}
//                   setEmail={setEmail}
//                   password={password}
//                   setPassword={setPassword}
//                   handleLogin={handleLogin}
//                   error={error}
//                   switchToSignUp={switchToSignUp}
//                 />
//               )}
//             />
//             <Stack.Screen 
//               name="SignUp" 
//               component={() => (
//                 <SignUpScreen
//                   username={username}
//                   setUsername={setUsername}
//                   email={email}
//                   setEmail={setEmail}
//                   password={password}
//                   setPassword={setPassword}
//                   handleSignUp={handleSignUp}
//                   error={error}
//                   switchToLogin={switchToLogin}
//                 />
//               )}
//             />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fa',
//   },
//   header: {
//     backgroundColor: '#e6eef8',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingHorizontal: 15,
//   },
//   headerText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#333',
//   },
//   authContainer: {
//     flex: 1,
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 15,
//   },
//   illustrationContainer: {
//     marginTop: 30,
//     marginBottom: 20,
//     alignItems: 'center',
//     width: 160,
//     height: 160,
//     justifyContent: 'center',
//   },
//   illustration: {
//     width: 160,
//     height: 160,
//   },
//   welcomeText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     color: '#000',
//     letterSpacing: 1,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 11,
//     color: '#888',
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   input: {
//     width: '100%',
//     height: 45,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 4,
//     paddingHorizontal: 12,
//     backgroundColor: '#f9f9f9',
//     fontSize: 14,
//   },
//   forgotPasswordContainer: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   forgotPasswordText: {
//     color: '#444',
//     fontSize: 13,
//   },
//   signInButton: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#4a90e2',
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 25,
//     marginBottom: 15,
//   },
//   signInButtonText: {
//     color: '#fff',
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   createAccountButton: {
//     width: '100%',
//     height: 50,
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#4a90e2',
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   createAccountText: {
//     color: '#4a90e2',
//     fontSize: 15,
//   },
//   bottomIndicator: {
//     width: 35,
//     height: 5,
//     backgroundColor: '#000',
//     borderRadius: 3,
//     marginTop: 40,
//   },
//   errorText: {
//     color: 'red',
//     marginBottom: 10,
//     textAlign: 'center',
//     width: '100%',
//     fontSize: 13,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   welcomeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 20,
//   },
//   welcomeTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   emailText: {
//     fontSize: 18,
//     marginBottom: 30,
//   },
//   logoutButton: {
//     width: '80%',
//     height: 50,
//     backgroundColor: '#f44336',
//     borderRadius: 4,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoutButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AuthNavigator from './navigation/AuthNavigator';

// export default function App() {
//   return (
//     <NavigationContainer>
//       <AuthNavigator />
//     </NavigationContainer>
//   );
// }






import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { initializeApp } from 'firebase/app';
import AuthNavigator from './navigation/AuthNavigator';

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCtcxLaRb4amBYm8sDSPfSrKra0K7He_dM",
//   authDomain: "planify-a9124.firebaseapp.com",
//   projectId: "planify-a9124",
//   storageBucket: "planify-a9124.firebasestorage.app",
//   messagingSenderId: "941109727528",
//   appId: "1:941109727528:web:5ed694e76e3840dac0801d",
//   measurementId: "G-8RQG4TJWVY"
// };

// // Initialize Firebase
// const app=initializeApp(firebaseConfig);

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  )
}