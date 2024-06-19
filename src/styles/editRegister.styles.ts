import { StyleSheet } from 'react-native';

export const editRegisterStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 8
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  }
});
