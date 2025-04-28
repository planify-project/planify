import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = ({ username, setUsername, email, setEmail, password, setPassword, error, setError, switchToLogin }) => {
  const auth = getAuth();

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
      switchToLogin(); // Navigate to the login page after successful sign-up
    } catch (err) {
      console.error(err.message);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Registration failed');
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
          <Image source={require('../assets/image.png')} style={styles.illustration} resizeMode="contain" />
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
        <TouchableOpacity style={styles.signInButton} onPress={handleSignUp}>
          <Text style={styles.signInButtonText}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createAccountButton} onPress={switchToLogin}>
          <Text style={styles.createAccountText}>Already have an account</Text>
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
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  authContainer: {
    width: '90%',
    alignItems: 'center',
  },
  illustrationContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  illustration: {
    width: 180,
    height: 180,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    marginTop: 15,
  },
  createAccountText: {
    color: '#4a90e2',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});