import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StatusBar, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the import based on your project structure

const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const SignUpScreen = ({ username, setUsername, email, setEmail, password, setPassword, error, setError, switchToLogin }) => {
  // const handleSignUp = () => {
  //   console.log('Sign up button pressed');
  // };
const navigation = useNavigation();
  const handleSignUp = async () => {
    setError('');
    try {
      if (!username || !email || !password) {
        setError('All fields are required');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User registered successfully');
      switchToLogin();
    } catch (err) {
      console.error(err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please try logging in instead.');
        setEmail('');
        setPassword('');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Registration failed: ' + err.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      <View style={styles.authContainer}>
        <View style={styles.illustrationContainer}>
          <Image source={require('../assets/LOGOLOGO.png')} style={styles.illustration} resizeMode="contain" />
        </View>
        <Text style={styles.welcomeText}>CREATE YOUR ACCOUNT</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>USER NAME</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#888"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#888"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity style={styles.googleButton}>
          <Image source={require('../assets/google-logo.png')} style={styles.logo} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.facebookButton}>
          <Image source={require('../assets/facebook-logo.png')} style={styles.logo} />
          <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
          <Text style={styles.signInButtonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('Login')}>
  <Text style={styles.createAccountText}>Already have an account? Log in</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: normalize(20),
  },
  headerText: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#333',
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
    color: '#000',
    marginBottom: normalize(20),
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: normalize(15),
  },
  inputLabel: {
    fontSize: normalize(14),
    color: '#555',
    marginBottom: normalize(5),
  },
  input: {
    width: '100%',
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(15),
    backgroundColor: '#fff',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    width: '90%', // Adjust width to make it consistent with inputs
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(25), // Fully rounded corners
    backgroundColor: '#fff',
    marginBottom: normalize(15),
    alignSelf: 'center', // Center the button horizontally
  },
  googleButtonText: {
    color: '#555',
    fontSize: normalize(16),
    fontWeight: '600',
    marginLeft: normalize(10),
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the content horizontally
    width: '90%', // Adjust width to make it consistent with inputs
    height: normalize(50),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: normalize(25), // Fully rounded corners
    backgroundColor: '#fff',
    marginBottom: normalize(15),
    alignSelf: 'center', // Center the button horizontally
  },
  facebookButtonText: {
    color: '#555',
    fontSize: normalize(16),
    fontWeight: '600',
    marginLeft: normalize(10),
  },
  logo: {
    width: normalize(20),
    height: normalize(20),
  },
  signInButton: {
    width: '100%',
    height: normalize(50),
    backgroundColor: '#4a90e2',
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
  createAccountButton: {
    marginTop: normalize(15),
  },
  createAccountText: {
    color: '#4a90e2',
    fontSize: normalize(14),
  },
  errorText: {
    color: 'red',
    marginBottom: normalize(10),
    textAlign: 'center',
  },
});