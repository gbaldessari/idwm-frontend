import { StyleSheet } from 'react-native';

export const recoverPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    lineHeight: 35,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  applyButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  backButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  }
});