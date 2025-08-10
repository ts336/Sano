import AsyncStorage from '@react-native-async-storage/async-storage'; // for write to file
import React, { useState } from 'react';
import { ActivityIndicator, Button, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles'; // importing stylesheet

// Home screen, accepts onLogout and onNavigateToInfo props
const HomeScreen = ({ onLogout, onNavigateToInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Good morning{'\n'}Franca</Text>
      <TouchableOpacity style={styles.imageButton} onPress={onNavigateToInfo}>
        <ImageBackground
          source={require('../assets/images/background-appointment.png')} // For local image saved in assets
          style={styles.imageBackground}
        >
        <Text style={styles.imageBackgroundText}>Book an appointment</Text>
        </ImageBackground>
      </TouchableOpacity>
      <Button title="Logout" onPress={onLogout}/>
    </View>
  );
};

// Before you book screen, accepts onGoBackToHome prop
const BeforeYouBookScreen = ({ onGoBackToHome, onNavigateToAppointmentForm }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Before you book...</Text>
      <Text style={styles.normalColor}>Are you experiencing any of the following symptoms?</Text>
      <Image
        source={require('../assets/images/symptoms.png')}
        style={styles.symptoms}>
      </Image>
      <Text style={styles.bold}>If yes, call 111 immediately.</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBackToHome}>
          <Text style={styles.normalWhite}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onNavigateToAppointmentForm}
        >
          <Text style={styles.normalWhite}>No, I am not.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Appointment Form Screen
const AppointmentFormScreen = ({ onGoBackToInfo }) => {
  // states for radio button, saving to file and error message
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // error handling
  const handleSaveAppointment = async () => {
    if (!selectedAppointmentType) {
      setErrorMessage('Please select an appointment type.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    // save to file: options chosen
    try {
      const appointmentData = {
        type: selectedAppointmentType,
      };
      
      const jsonValue = JSON.stringify(appointmentData);
      
      await AsyncStorage.setItem('appointment_data', jsonValue);
    } catch (error) {
      setErrorMessage(`Failed to save: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // conditional styling for continue button
  const isEnabled = selectedAppointmentType !== null;
  const buttonStyleForm = isEnabled ? styles.continueButton : styles.continueButtonDisabled;

  // if selected appointment type, changes style of button (radio button)
  // continue button disabled if saving or no appointment type has been selected
  return ( 
    <View style={styles.container}>
      <Text style={styles.heading}>Appointment Type</Text>
      <View style={styles.radioGroupContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedAppointmentType === 'Virtual' && styles.selectedRadioButton,
          ]}
          onPress={() => setSelectedAppointmentType('Virtual')}
        >
          <Text style={[
            styles.radioButtonText,
            selectedAppointmentType === 'Virtual' && styles.selectedRadioButtonText,
          ]}>
            Virtual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedAppointmentType === 'In-person' && styles.selectedRadioButton,
          ]}
          onPress={() => setSelectedAppointmentType('In-person')}
        >
          <Text style={[
            styles.radioButtonText,
            selectedAppointmentType === 'In-person' && styles.selectedRadioButtonText,
          ]}>
            In-person
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBackToInfo}>
          <Text style={styles.normalWhite}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={buttonStyleForm}
          onPress={handleSaveAppointment}
          disabled={isSaving || !selectedAppointmentType}
        >
          {isSaving ? (
            <ActivityIndicator color="#4DBBBB" />
          ) : (
            <Text style={styles.normalWhite}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};


// Login screen, accepts onLoginSuccess prop
const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorMessage('Email and password cannot be empty.');
    } else {
      // Login logic
      if (email === 'test' && password === '123') {
        setErrorMessage(''); // Clear any previous error messages
        
        // Call the function passed in the props to signal that the login was successful
        onLoginSuccess();

      } else { //Login will only work for set email and password
        setErrorMessage('Invalid email or password.');
      }
    }
  };

  const isEnabled = email.length > 0 && password.length > 0; // Enables button when there is input
  const buttonStyleLogin = isEnabled ? styles.enabledLoginButton : styles.disabledLoginButton; // ternary operator

  return ( //view screen (what will be returned to the screen)
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
        style={buttonStyleLogin} // conditional style for enabled and disabled
        onPress={handleLogin}
        disabled={!isEnabled} // disable button press
      >
        <Text style={styles.loginButtonText}>Sign in</Text>
      </TouchableOpacity>
    </View> //if there is an error, it will be shown with the errorText style, otherwise nothing. onPress handleLogin is called
  );
};

// Main component that controls which screen is visible
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // New state to manage screens after login
  const [currentScreen, setCurrentScreen] = useState('home');

  // below are the navigation functions for moving the user across the app
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('home'); // Reset to home screen on logout
  };

  const navigateToInfo = () => {
    setCurrentScreen('info'); // Changes screen to before you book
  };

  const navigateToHomeFromInfo = () => {
    setCurrentScreen('home'); // Go back from before you book to home
  };

  const navigateToAppointmentForm = () => {
    setCurrentScreen('appointmentForm');
  };

  const goBackToInfo = () => {
    setCurrentScreen('info');
  };

  // If user is logged in, show the Home Screen or before you book screen
  if (isLoggedIn) {
    if (currentScreen === 'home') {
      return (
        <HomeScreen
          onLogout={handleLogout}
          onNavigateToInfo={navigateToInfo} // Pass the navigation function from above
        />
      );
    } else if (currentScreen === 'info') { // Currently, if logged in, can only be on home or info
      return (
        <BeforeYouBookScreen
          onGoBackToHome={navigateToHomeFromInfo}
          onNavigateToAppointmentForm={navigateToAppointmentForm}
        />
      );
    } else if (currentScreen === 'appointmentForm') {
      return <AppointmentFormScreen onGoBackToInfo={goBackToInfo} />;
    }
  }

  // If user is not logged in, show the Login Screen.
  return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
};

export default App;