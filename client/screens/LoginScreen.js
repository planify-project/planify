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
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
    <SafeAreaView style={[styles.container, { backgroundColor: '#F4F6FC' }]}>
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={require('../assets/event planner photo.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.authContainer}>
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../assets/PLANIFYY.png')}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        <Text style={[styles.welcomeText, { color: '#222' }]}>WELCOME BACK</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: '#222' }]}>EMAIL</Text>
          <TextInput
            style={[
              styles.input,
              emailFocused && styles.inputFocused
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: '#222' }]}>PASSWORD</Text>
          <TextInput
            style={[
              styles.input,
              passwordFocused && styles.inputFocused
            ]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#888"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity 
          style={[styles.signInButton, { backgroundColor: '#4f78f1' }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.signInButtonText}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={[styles.linkText, { color: 'grey' }]}>
            Don't have an account? Sign Up
          </Text>
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
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#222',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
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
    fontSize: normalize(17),
    fontWeight: 'bold',
    color: '#111',
    marginBottom: normalize(18),
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    width: '100%',
    marginBottom: normalize(15),
  },
  inputLabel: {
    fontSize: normalize(13),
    color: '#222',
    fontWeight: '600',
    marginBottom: normalize(5),
  },
  input: {
    width: '100%',
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: normalize(12),
    paddingHorizontal: normalize(15),
    backgroundColor: '#f5f6fa',
    color: '#222',
    fontSize: normalize(15),
    marginBottom: 0,
    shadowColor: '#e0e0e0',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  inputFocused: {
    backgroundColor: '#e4e7ef',
    borderColor: '#4f78f1',
  },
  signInButton: {
    width: '100%',
    height: normalize(54),
    backgroundColor: '#4f78f1',
    borderRadius: normalize(27),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(20),
    shadowColor: '#4f78f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
    zIndex: 0,
  },
});
