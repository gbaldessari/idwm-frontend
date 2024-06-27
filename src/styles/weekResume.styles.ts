import { StyleSheet } from 'react-native';

export const weekResumeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  table: {
    marginTop: 16,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableText: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '45%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10
  },
  button: {
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#6200EE',
    marginVertical: 10,
  },
  dateRangeText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
});
