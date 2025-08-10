import React, { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles'; // importing stylesheet

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
        <View style={styles.signInHeadingContainer}>
          <Text style={styles.signInHeading}>Sign in</Text>
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

export default App;