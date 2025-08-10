import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({ //stylesheet for login
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 33,
  },
  title: {
    marginTop: 135,
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
  signInHeadingContainer: {
    width: '100%',
    alignItems: 'flex-start',
    paddingLeft: 33,
  },
  signInHeading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 27,
    color: '#FFFFFF',
  },
  heading: {

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

export default styles;