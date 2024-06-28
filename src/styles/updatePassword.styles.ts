import { StyleSheet } from 'react-native';

export const updatePasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});