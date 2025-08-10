/*import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}*/
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

//State is for handling data that changes over time or that comes from user interaction. Memory for components.
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Email and password cannot be empty.');
    } else {
      // Simulating login logic
      if (email === 'test@example.com' && password === 'password123') {
        setErrorMessage(''); // This will clear error on successful login
        alert('Login Successful!');
        // (later) Navigate to home screen or perform other actions
      } else { //Login will only work for set email and password
        setErrorMessage('Invalid email or password.');
      }
    }
  };

  return ( //view screen
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
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
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} /> 
    </View> //if there is an error, it will be shown with the errorText style, otherwise nothing. onPress handleLogin is called
  );
};

const styles = StyleSheet.create({ //stylesheet for login
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;