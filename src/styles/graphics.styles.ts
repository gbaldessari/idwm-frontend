import { StyleSheet } from 'react-native';

export const graphicsStyles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#F5F5F5'
    },
    workerContainer: {
      padding: 12,
      backgroundColor: '#FFF',
      borderRadius: 8,
      marginBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 2
    },
    workerText: {
      fontSize: 18
    },
    subtitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center'
    },
    dateRange: {
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom: 10,
      textAlign: 'center'
    },
    chartContainer: {
      marginVertical: 10
    },
    chartTitle: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 10
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      marginBottom: 10
    }
  });