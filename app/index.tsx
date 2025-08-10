import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Home screen
const HomeScreen = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.subtitle}>You have successfully logged in.</Text>
      <Button title="Logout" onPress={onLogout}/>
    </View>
  );
};


// Accepts onLoginSuccess prop
const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Email and password cannot be empty.');
    } else {
      // Login logic
      if (email === 'test@example.com' && password === 'password123') {
        setErrorMessage(''); // Clear any previous error messages.
        
        // Call the function passed in the props to signal that the login was successful
        onLoginSuccess();

      } else { //Login will only work for set email and password
        setErrorMessage('Invalid email or password.');
      }
    }
  };

  const isEnabled = email.length > 0 && password.length > 0; // Enables button when there is input
  const buttonStyle = isEnabled ? styles.enabledLoginButton : styles.disabledLoginButton; // ternary operator

  return ( //view screen
    <View style={styles.container}>
      <Text style={styles.title}>Sano</Text>
      <Text style={styles.slogan}>Healthcare made easy.</Text>
      <View style={styles.box}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Sign in</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        /> 
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={buttonStyle} // conditional style
        onPress={handleLogin}
        disabled={!isEnabled} // disable button press
      >
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
    </View> //if there is an error, it will be shown with the errorText style, otherwise nothing. onPress handleLogin is called
  );
};

// This is the main component that controls which screen is visible
// It uses a state variable `isLoggedIn` to decide
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // If the user is logged in, show the HomeScreen. Otherwise, show the LoginScreen.
  if (isLoggedIn) {
    // Pass a function to HomeScreen to allow the user to log out
    return <HomeScreen onLogout={() => setIsLoggedIn(false)} />;
  }

  // Pass a function to LoginScreen that sets isLoggedIn to true on success.
  return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
};

const styles = StyleSheet.create({ //stylesheet for login
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 33,
  },
  title: {
    marginTop: 50,
    color: '#0F1A1D',
    fontSize: 64,
    fontWeight: 600,
    width: '100%',
    textAlign: 'left',
    marginBottom: -10,
  },
  slogan: {
    color: '#0F1A1D',
    fontSize: 20,
    fontWeight: 600,
    width: '100%',
    textAlign: 'right',
    paddingRight: 7,
  },
  box: {
    marginTop: 50,
    width: '100%',
    minHeight: '33%',
    maxHeight: '40%',
    backgroundColor: '#488286',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    marginBottom: 15,
  },
  headingContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 33,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 27,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: '15%',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 18,
    backgroundColor: '#F9F9F9',
    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
    fontSize: 12.5,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  enabledLoginButton: {
    width: '80%',
    backgroundColor: '#4DBBBB', // Enabled color
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    boxShadow: '0 5px 5px 0 rgba(0, 0, 0, 0.25)',
    marginTop: 15,
  },
  disabledLoginButton: {
    width: '80%',
    backgroundColor: '#77888C', // Disabled color
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 13,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;