import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import app from "../configs/firebase_config";

const Stack = createNativeStackNavigator();
const auth = getAuth(app);

const AuthNavigator = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigation will be handled by App.js
        setLoading(false);
      } else {
        setLoading(false);
      }
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
      // Navigation will be handled by App.js auth state change
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
      // Navigation will be handled by App.js auth state change
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
            switchToSignUp={() => props.navigation.navigate('SignUp')}
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
            switchToLogin={() => props.navigation.navigate('Login')}
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