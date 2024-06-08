import { StyleSheet } from 'react-native';

export const weekResumeStyles = StyleSheet.create({
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
    scrollView: {
      width: '100%',
    },
    registerItem: {
      marginVertical: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      backgroundColor: '#f9f9f9',
    },
    registerDate: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    registerTime: {
      fontSize: 16,
      marginBottom: 2,
    },
    buttonContainer: {
      alignSelf: 'center',
      width: '80%',
    },
    button: {
      justifyContent: 'center',
      backgroundColor: '#6200ee',
      height: 40,
      marginVertical: 5,
    }
});