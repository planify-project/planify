import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // Make sure this path is correct

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { login, loading } = useContext(AuthContext);

  const handleLogin = async () => {
    setError('');
    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      await login(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Root' }], 
      });
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Try again later';
          break;
      }
      setError(errorMessage);
      setPassword('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Login</Text>
      </View>
      <View style={styles.authContainer}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/LOGOLOGO.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.welcomeText, { color: theme.text }]}>WELCOME BACK</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>EMAIL</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>PASSWORD</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#888"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={[styles.signInButton, { backgroundColor: theme.primary }]} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: normalize(20),
  },
  headerText: {
    fontSize: normalize(28),
    fontWeight: 'bold',
  },
  authContainer: {
    width: '90%',
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: normalize(20),
    alignItems: 'center',
  },
  illustration: {
    width: normalize(180),
    height: normalize(180),
  },
  welcomeText: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: normalize(15),
  },
  inputLabel: {
    fontSize: normalize(14),
    marginBottom: normalize(5),
  },
  input: {
    width: '100%',
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(15),
  },
  signInButton: {
    width: '100%',
    height: normalize(50),
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  signInButtonText: {
    color: '#fff',
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  linkText: {
    fontSize: normalize(14),
    marginTop: normalize(15),
  },
  errorText: {
    color: 'red',
    marginBottom: normalize(10),
    textAlign: 'center',
  },
});
