import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Box, Text, VStack } from 'native-base';
import { Button } from 'react-native-elements';
import tokenUseStore from '../../useStores/token.useStore';
import getRegistersByRangeService from '../../services/getRegistersByRange.service';
import { getCurrentWeekDates, getPreviousWeekDates, getNextWeekDates } from '../../utils/date.utils';

const WeekResumeScreen = () => {
  const { storedToken } = tokenUseStore();
  const token = storedToken || '';
  const [loading, setLoading] = useState<boolean>(false);
  const [registers, setRegisters] = useState<any[]>([]);
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeekDates());

  useEffect(() => {
    fetchRegisters();
  }, [currentWeek]);

  const fetchRegisters = async () => {
    setLoading(true);
    const response = await getRegistersByRangeService({
      token,
      startDate: currentWeek.startDate,
      endDate: currentWeek.endDate,
    });
    setLoading(false);

    if (response.success) {
      setRegisters(response.data);
    } else {
      console.error(response.error);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(getPreviousWeekDates(currentWeek.startDate));
  };

  const handleNextWeek = () => {
    setCurrentWeek(getNextWeekDates(currentWeek.startDate));
  };

  return (
    <StyledBox>
      <Text style={styles.title}>Resumen Semanal</Text>
      <VStack space={4} alignItems="center">
        <Button
          title="Semana Anterior"
          onPress={handlePreviousWeek}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          loading={loading}
        />
        <Button
          title="Semana Siguiente"
          onPress={handleNextWeek}
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          loading={loading}
        />
        {registers.length > 0 ? (
          <ScrollView style={styles.scrollView}>
            {registers.map((register, index) => (
              <View key={index} style={styles.registerItem}>
                <Text style={styles.registerDate}>{register.date}</Text>
                <Text style={styles.registerTime}>Entrada: {register.timeEntry}</Text>
                <Text style={styles.registerTime}>Salida: {register.timeExit || '---'}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>No hay registros para esta semana.</Text>
        )}
      </VStack>
    </StyledBox>
  );
};

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Box>{children}</Box>
  </View>
);

const styles = StyleSheet.create({
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
  },
});

export default WeekResumeScreen;
