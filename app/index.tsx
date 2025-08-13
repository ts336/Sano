import AsyncStorage from '@react-native-async-storage/async-storage'; // for write to file
import React, { useState } from 'react';
import { ActivityIndicator, Button, Image, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './styles'; // importing stylesheet

const fixedUsername = 'test';
const fixedPassword = '123';
const months = [
  { label: 'January', value: 'January' }, { label: 'February', value: 'February' },
  { label: 'March', value: 'March' }, { label: 'April', value: 'April' },
  { label: 'May', value: 'May' }, { label: 'June', value: 'June' },
  { label: 'July', value: 'July' }, { label: 'August', value: 'August' },
  { label: 'September', value: 'September' }, { label: 'October', value: 'October' },
  { label: 'November', value: 'November' }, { label: 'December', value: 'December' }
];
const days = Array.from({ length: 31 }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
const times = [
  { label: '09:00', value: '09:00' }, { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' }, { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' }, { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' }
];

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
      if (email === fixedUsername && password === fixedPassword) {
        setErrorMessage(''); // Clear any previous error messages
        
        // Call the function to signal that the login was successful
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

// Home screen, accepts onLogout and onNavigateToInfo props
const HomeScreen = ({ onLogout, onNavigateToInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { paddingLeft: 13 }]}>Good morning{'\n'}{fixedUsername}</Text>
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
      <Text style={[styles.heading, { paddingLeft: 13 }]}>Before you book...</Text>
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
  // states for radio buttons
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);

  // states for dropdowns
  const [openMonth, setOpenMonth] = useState(false); // controls month dropdown visibility
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [openDay, setOpenDay] = useState(false); // controls day dropdown visibility
  const [selectedDay, setSelectedDay] = useState(null);

  const [openTime, setOpenTime] = useState(false); // controls time dropdown visibility
  const [selectedTime, setSelectedTime] = useState(null);

  // states for user input text boxes
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // states for save to file and error messages
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // error handling just in case button is not disabled, all must be selected to continue
  const handleSaveAppointment = async () => {
    if (!selectedAppointmentType || !selectedPractitioner || !selectedMonth || !selectedDay || !selectedTime || !email || !phoneNumber) {
      setErrorMessage('Please complete all sections');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    // save to file: options chosen
    try {
      const appointmentData = {
        type: selectedAppointmentType,
        practitioner: selectedPractitioner,
        month: selectedMonth,
        day: selectedDay,
        time: selectedTime,
        email: email,
        phoneNumber: phoneNumber,
      };
      
      const jsonValue = JSON.stringify(appointmentData);
      
      await AsyncStorage.setItem('appointment_data', jsonValue);
    } catch (error) {
      setErrorMessage(`Failed to save: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // conditional styling for continue button
  const isEnabled = selectedAppointmentType !== null && selectedPractitioner !== null && selectedMonth !== null && selectedDay !== null && selectedTime !== null && email.length > 0 && phoneNumber.length > 0;
  const buttonStyleForm = isEnabled ? styles.continueButton : styles.continueButtonDisabled;

  // if selected appointment type, changes style of button (radio button)
  // continue button disabled if saving or no appointment type has been selected
  return ( 
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: 40}]}>
      <Text style={[styles.heading, { width: '100%', textAlign: 'center'}]}>Enter your Details</Text>
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
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
      
      <View style={styles.line} />
      
      <Text style={[styles.heading, { width: '100%', textAlign: 'center' }]}>Appointment Type</Text>
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

      <View style={styles.line} />

      <Text style={[styles.heading, { width: '100%', textAlign: 'center'}]}>Select Practitioner</Text>
      <View style={styles.radioGroupContainer}>
        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedPractitioner === 'Dr. Bob' && styles.selectedRadioButton,
          ]}
          onPress={() => setSelectedPractitioner('Dr. Bob')}
        >
          <Text style={[
            styles.radioButtonText,
            selectedPractitioner === 'Dr. Bob' && styles.selectedRadioButtonText,
          ]}>
            Dr. Bob
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.radioButton,
            selectedPractitioner === 'Dr. Jane' && styles.selectedRadioButton,
          ]}
          onPress={() => setSelectedPractitioner('Dr. Jane')}
        >
          <Text style={[
            styles.radioButtonText,
            selectedPractitioner === 'Dr. Jane' && styles.selectedRadioButtonText,
          ]}>
            Dr. Jane
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <Text style={[styles.heading, { width: '100%', textAlign: 'center'}]}>Select Date and Time</Text>
      <View style={styles.pickerContainer}>
        <DropDownPicker
          open={openMonth}
          value={selectedMonth}
          items={months}
          setOpen={setOpenMonth}
          setValue={setSelectedMonth}
          setItems={() => {}} // not filling this in since not needed
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          containerStyle={styles.dropdownContainer}
          placeholder="Month"
          // To close other pickers when this one opens
          onOpen={() => { setOpenDay(false); setOpenTime(false); }}
          dropDownDirection="TOP" // Prevents overlapping with content below
          zIndex={3000} // Ensures that this picker is on top
          listMode="SCROLLVIEW"
        />

        <DropDownPicker
          open={openDay}
          value={selectedDay}
          items={days}
          setOpen={setOpenDay}
          setValue={setSelectedDay}
          setItems={() => {}}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          containerStyle={styles.dropdownContainer}
          placeholder="Day"
          // Close other pickers when this one opens
          onOpen={() => { setOpenMonth(false); setOpenTime(false); }}
          dropDownDirection="TOP"
          zIndex={2000} // Lower zIndex than month
          listMode="SCROLLVIEW"
        />

        <DropDownPicker
          open={openTime}
          value={selectedTime}
          items={times}
          setOpen={setOpenTime}
          setValue={setSelectedTime}
          setItems={() => {}}
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          containerStyle={styles.dropdownContainer}
          placeholder="Time"
          // Close other pickers when this one opens
          onOpen={() => { setOpenMonth(false); setOpenDay(false); }}
          dropDownDirection="TOP"
          zIndex={1000} // Lowest zIndex
          listMode="SCROLLVIEW"
        />
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