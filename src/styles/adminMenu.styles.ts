import { StyleSheet } from 'react-native';

export const adminMenuStyles = StyleSheet.create({
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
    subtitle: {
      fontSize: 25,
      textAlign: 'center',
      lineHeight: 25,
      marginVertical: 20,
    },
    workerContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    workerText: {
      fontSize: 18,
    },
    registerContainer: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    registerText: {
      fontSize: 16,
    }
});