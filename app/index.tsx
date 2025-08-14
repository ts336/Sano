import AsyncStorage from '@react-native-async-storage/async-storage'; // for write to file
import React, { useEffect, useState } from 'react'; // for hooks
import { ActivityIndicator, Alert, Button, Image, ImageBackground, Keyboard, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'; // basic components of React Native
import DropDownPicker from 'react-native-dropdown-picker';
import styles from './styles'; // importing stylesheet

// constants to be used across the program
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
const times = [
  { label: '09:00', value: '09:00' }, { label: '10:00', value: '10:00' },
  { label: '11:00', value: '11:00' }, { label: '13:00', value: '13:00' },
  { label: '14:00', value: '14:00' }, { label: '15:00', value: '15:00' },
  { label: '16:00', value: '16:00' }
];

// Login screen, accepts onLoginSuccess prop
const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleLogin = () => {
    if (username === '' || password === '') {
      setErrorMessage('Username and password cannot be empty.');
    } else {
      // Login logic
      if (username === fixedUsername && password === fixedPassword) {
        setErrorMessage(''); // Clear any previous error messages
        
        // Call the function to signal that the login was successful
        onLoginSuccess();

      } else { //Login will only work for set username and password
        setErrorMessage('Invalid username or password.');
      }
    }
  };

  const isEnabled = username.length > 0 && password.length > 0; // Enables button when there is input
  const buttonStyleLogin = isEnabled ? styles.enabledLoginButton : styles.disabledLoginButton; // ternary operator

  return ( //view screen (what will be returned to the screen)
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sano</Text>
        <Text style={styles.slogan}>Healthcare made easy.</Text>
        <View style={styles.box}>
          <View style={styles.signInHeadingContainer}>
            <Text style={styles.signInHeading}>Sign in</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
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
      </View>
    </TouchableWithoutFeedback>
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
const AppointmentFormScreen = ({ onGoBackToInfo, onNavigateToConfirmBooking }) => {
  // states for radio buttons
  const [selectedAppointmentType, setSelectedAppointmentType] = useState(null);
  const [selectedPractitioner, setSelectedPractitioner] = useState(null);

  // states for dropdowns
  const [openMonth, setOpenMonth] = useState(false); // controls month dropdown visibility
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [openDay, setOpenDay] = useState(false); // controls day dropdown visibility
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayItems, setDayItems] = useState([]); // for dynamic list

  const [openTime, setOpenTime] = useState(false); // controls time dropdown visibility
  const [selectedTime, setSelectedTime] = useState(null);

  // states for user input text boxes
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // states for save to file and error messages
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // For days in drop down menu
  useEffect(() => {
    let daysInMonth = 31;
    // Determine the number of days for the selected month
    if (selectedMonth === 'February') {
      daysInMonth = 28; // Simple case, not handling leap years
    } else if (['April', 'June', 'September', 'November'].includes(selectedMonth)) {
      daysInMonth = 30;
    }
    
    // Generate a new array of days
    const newDays = Array.from({ length: daysInMonth }, (_, i) => ({ label: (i + 1).toString(), value: i + 1 }));
    setDayItems(newDays);

    // Reset the selected day if the month changes to avoid invalid dates
    setSelectedDay(null);
  }, [selectedMonth]);

  // function for validating the name given
  const validateFullName = (name) => {
    setErrorMessage(''); // Clear previous error messages before validation

    // To check for characters that are not letters, spaces, apostrophes or hyphens
    const invalidCharsRegex = /[^a-zA-Z\s-']/;

    if (invalidCharsRegex.test(name)) {
      setErrorMessage('Full name can only contain letters, spaces and hyphens.');
      return false;
    }

    return true; // full name is valid
  };

  // function for validating (simple check) phone number entered
  const validatePhoneNumber = (number) => {
    setErrorMessage(''); // Clear previous error messages before validation

    // Remove any spaces from the string to check no. of digits
    const numericOnly = number.replace(/\s/g, '');

    // 1. Ensure the string contains only numbers
    if (!/^\d+$/.test(numericOnly)) {
      setErrorMessage('Phone number must contain only digits. Spaces are fine.');
      return false;
    }

    // 2. Ensure the number starts with 0
    if (!numericOnly.startsWith('0')) {
      setErrorMessage('Phone number must start with 0.');
      return false;
    }

    // 3. Ensure the number has a length of 9 to 10 digits
    if (numericOnly.length < 9 || numericOnly.length > 10) {
      setErrorMessage('Phone number must be between 9 and 10 digits long.');
      return false;
    }

    return true; // Phone number is valid
  };

  // error handling just in case button is not disabled, all must be selected to continue
  const handleSaveAppointment = async () => {
    if (!selectedAppointmentType || !selectedPractitioner || !selectedMonth || !selectedDay || !selectedTime || !fullName || !phoneNumber) {
      setErrorMessage('Please complete all sections');
      return;
    }

    if (!validateFullName(fullName)) {
      return; // If validation fails, stop the function. The error message is already set.
    }

    // Validate phone number specifically
    if (!validatePhoneNumber(phoneNumber)) {
      // The error message is already set by validatePhoneNumber
      return;
    }

    setIsSaving(true);
    setErrorMessage('');

    // Save to file: options chosen
    try {
      const appointmentData = {
        type: selectedAppointmentType,
        practitioner: selectedPractitioner,
        month: selectedMonth,
        day: selectedDay,
        time: selectedTime,
        fullName: fullName,
        phoneNumber: phoneNumber.replace(/\s/g, ''), // saving phone no. without spaces
      };
      
      const jsonValue = JSON.stringify(appointmentData);
      
      await AsyncStorage.setItem('appointment_data', jsonValue);

      onNavigateToConfirmBooking();
      
    } catch (error) {
      setErrorMessage(`Failed to save: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // conditional styling for continue button
  const isEnabled = selectedAppointmentType !== null && 
                   selectedPractitioner !== null && 
                   selectedMonth !== null && 
                   selectedDay !== null && 
                   selectedTime !== null && 
                   fullName.length > 0 && 
                   phoneNumber.length > 0; // Check if phone number has content
  const buttonStyleForm = isEnabled ? styles.continueButton : styles.continueButtonDisabled;

  // if selected appointment type, changes style of button (radio button)
  // continue button disabled if saving or no appointment type has been selected
  return ( 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: 40}]}>
        <Text style={[styles.heading, { width: '100%', textAlign: 'center'}]}>Enter your Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
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
            items={dayItems} // changed for dyanamic listing
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
        
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

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
      </View>
    </TouchableWithoutFeedback>
  );
};

// Confirm Booking Screen
const ConfirmBookingScreen = ({ onGoBackToAppointmentForm, onNavigateToHome }) => {
  // used to fetch data from saved file
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect is a hook for handling external systems and syncing them with componenets
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('appointment_data');
        if (jsonValue != null) {
          setAppointmentData(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Failed to fetch appointment data", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointmentData();
  }, []); // empty array stop further runs, only one run of the function is needed 

  const handleSubmit = () => {
    Alert.alert(
      "Success",
      "Your appointment has been successfully booked!",
      [
        {
          text: "OK",
          onPress: onNavigateToHome
        }
      ]
    );
  };

  // display loading indicator while data is being fetched
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4DBBBB" />
      </View>
    );
  }

  // display error message if no data was found
  if (!appointmentData) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Booking Not Found</Text>
        <Text style={styles.normalColor}>There was an error loading your appointment details.</Text>
        <TouchableOpacity style={styles.continueButton} onPress={onNavigateToHome}>
          <Text style={styles.normalWhite}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { paddingLeft: 13, marginBottom: 30 }]}>Confirm Booking</Text>
      
      <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 15 }}>
        <Text style={styles.subheading}>Type</Text>
        <View style={styles.line2}></View>
        <Text style={styles.normalColor}>{appointmentData.type}</Text>

        <Text style={styles.subheading}>Practitioner</Text>
        <View style={styles.line2}></View>
        <Text style={styles.normalColor}>{appointmentData.practitioner}</Text>

        <Text style={styles.subheading}>Date and Time</Text>
        <View style={styles.line2}></View>
        <Text style={styles.normalColor}>
          {appointmentData.month} {appointmentData.day}, {appointmentData.time}
        </Text>

        <Text style={styles.subheading}>Details</Text>
        <View style={styles.line2}></View>
        <Text style={styles.normalColor}>Full Name: {appointmentData.fullName}</Text>
        <Text style={styles.normalColor}>Phone: {appointmentData.phoneNumber}</Text>
      </View>

      <View style={[styles.buttonContainer, { marginTop: 160 }]}>
        <TouchableOpacity style={styles.backButton} onPress={onGoBackToAppointmentForm}>
          <Text style={styles.normalWhite}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <Text style={styles.normalWhite}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    setCurrentScreen('appointmentForm'); // Go to form from before you book
  };

  const goBackToInfo = () => {
    setCurrentScreen('info'); // Go back to info
  };

  const navigateToConfirmBooking = () => {
    setCurrentScreen('confirmBooking'); // go to confirm booking page
  };

  const goBackToAppointmentForm = () => {
    setCurrentScreen('appointmentForm'); // go back to form from confirm booking page
  };

  const navigateToHomeFromConfirm = () => {
    setCurrentScreen('home'); // go home from confirm booking
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
      return (
        <AppointmentFormScreen
          onGoBackToInfo={goBackToInfo}
          onNavigateToConfirmBooking={navigateToConfirmBooking}
        />
      );
    } else if (currentScreen === 'confirmBooking') {
      return (
        <ConfirmBookingScreen
          onGoBackToAppointmentForm={goBackToAppointmentForm}
          onNavigateToHome={navigateToHomeFromConfirm}
        />
      );
    }
  }

  // If user is not logged in, show the Login Screen.
  return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
};

export default App;