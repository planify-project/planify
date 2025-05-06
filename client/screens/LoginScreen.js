import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const LoginScreen = ({ email, setEmail, password, setPassword, error, setError }) => {
  const auth = getAuth();
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setError('');
    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (err) {
      console.error(err.message);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
        setPassword('');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Login failed: ' + err.message);
      }
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
          <Image source={require('../assets/LOGOLOGO.png')} style={styles.illustration} resizeMode="contain" />
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
