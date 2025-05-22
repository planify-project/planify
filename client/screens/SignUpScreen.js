import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StatusBar, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext'; // Adjust the path if needed



const { width } = Dimensions.get('window');
const scale = width / 375;
function normalize(size) {
  return Math.round(scale * size);
}

const SignUpScreen = ({ username, setUsername, email, setEmail, password, setPassword, error, setError, switchToLogin }) => {

  const { register } = useContext(AuthContext);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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
const name=username
    await register(email, password, name);
    console.log('User registered successfully');
    switchToLogin(); // Navigate back to login after successful registration
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
      <ImageBackground
        source={require('../assets/event planner photo.jpg')} // <-- Use your events/wedding background image here
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>
      <View style={styles.authContainer}>
        <View style={styles.illustrationContainer}>
          <Image source={require('../assets/PLANIFYY.png')} style={styles.illustration} resizeMode="contain" />
        </View>
        <Text style={styles.welcomeText}>CREATE YOUR ACCOUNT</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>USER NAME</Text>
          <TextInput
            style={[
              styles.input,
              usernameFocused && styles.inputFocused
            ]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#888"
            autoCapitalize="none"
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>EMAIL</Text>
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
          <Text style={styles.inputLabel}>PASSWORD</Text>
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
    backgroundColor: '#e4e7ef', // slightly darker grey when focused
    borderColor: '#4f78f1', // optional: highlight border
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
  createAccountButton: {
    marginTop: normalize(15),
  },
  createAccountText: {
    color: 'grey',
    fontSize: normalize(14),
  },
  errorText: {
    color: 'red',
    marginBottom: normalize(10),
    textAlign: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)', // lighter, more subtle
    zIndex: 0,
  },
});