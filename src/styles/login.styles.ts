import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  forgottenButtonTitle: {
    color: 'black',
  }
});