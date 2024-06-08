import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Box, Text, VStack } from 'native-base';
import { Button } from 'react-native-elements';
import tokenUseStore from '../../useStores/token.useStore';
import getRegistersByRangeService from '../../services/getRegistersByRange.service';
import { getCurrentWeekDates, getPreviousWeekDates, getNextWeekDates } from '../../utils/date.utils';
import { weekResumeStyles } from '../../styles/weekResume.styles';
import Toast from 'react-native-toast-message';

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
      Toast.show({
        type: 'error',
        text1: 'Error al obtener los registros del Usuario'
      });
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
      <Text style={weekResumeStyles.title}>Resumen Semanal</Text>
      <VStack space={4} alignItems="center">
        <Button
          title="Semana Anterior"
          onPress={handlePreviousWeek}
          containerStyle={weekResumeStyles.buttonContainer}
          buttonStyle={weekResumeStyles.button}
          loading={loading}
        />
        <Button
          title="Semana Siguiente"
          onPress={handleNextWeek}
          containerStyle={weekResumeStyles.buttonContainer}
          buttonStyle={weekResumeStyles.button}
          loading={loading}
        />
        {registers.length > 0 ? (
          <ScrollView style={weekResumeStyles.scrollView}>
            {registers.map((register, index) => (
              <View key={index} style={weekResumeStyles.registerItem}>
                <Text style={weekResumeStyles.registerDate}>{register.date}</Text>
                <Text style={weekResumeStyles.registerTime}>Entrada: {register.timeEntry}</Text>
                <Text style={weekResumeStyles.registerTime}>Salida: {register.timeExit || '---'}</Text>
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
  <View style={weekResumeStyles.container}>
    <Box>{children}</Box>
  </View>
);

export default WeekResumeScreen;
