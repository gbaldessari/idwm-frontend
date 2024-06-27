import { StyleSheet } from 'react-native';

export const workersRegistersStyles = StyleSheet.create({
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
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
  table: {
    marginTop: 16
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  tableCell: {
    flex: 1,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableText: {
    fontSize: 14,
    textAlign: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  dateRangeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '45%',
  },
  button: {
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#6200EE',
    marginVertical: 10,
  }
});
