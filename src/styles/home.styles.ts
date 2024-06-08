import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
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
    userText: {
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      alignSelf: 'center',
      width: '80%',
    },
    button: {
      justifyContent: 'center',
      backgroundColor: '#6200ee',
      height: 60,
      marginVertical: 10,
    }
});