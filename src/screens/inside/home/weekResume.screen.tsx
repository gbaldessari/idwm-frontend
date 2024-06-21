import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Box, Text, VStack } from 'native-base';
import { Button } from 'react-native-elements';
import tokenUseStore from '../../../useStores/token.useStore';
import { getCurrentWeekDates, getPreviousWeekDates, getNextWeekDates } from '../../../utils/date.utils';
import { weekResumeStyles } from '../../../styles/weekResume.styles';
import Toast from 'react-native-toast-message';
import { getRegistersByRangeService } from '../../../services/registers/registers.service';

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

  const renderTable = () => {
    const startDate = new Date(currentWeek.startDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return (
      <View style={weekResumeStyles.table}>
        <View style={weekResumeStyles.tableHeader}>
          <Text style={weekResumeStyles.tableHeaderText}>Día</Text>
          <Text style={weekResumeStyles.tableHeaderText}>Registro</Text>
        </View>
        {dates.map((date, index) => {
          const register = registers.find((r: any) => new Date(r.date).toDateString() === date.toDateString());
          return (
            <View key={index} style={weekResumeStyles.tableRow}>
              <View style={weekResumeStyles.tableCell}>
                <Text style={weekResumeStyles.tableText}>{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</Text>
              </View>
              <View style={weekResumeStyles.tableCell}>
                {register ? (
                  <>
                    <Text style={weekResumeStyles.tableText}>Entrada: {register.timeEntry}</Text>
                    <Text style={weekResumeStyles.tableText}>Salida: {register.timeExit}</Text>
                  </>
                ) : (
                  <Text style={weekResumeStyles.tableText}>Sin registros</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const isNextWeekDisabled = () => {
    const today = new Date();
    const currentStartDate = new Date(currentWeek.startDate);
    return currentStartDate > today;
  };

  return (
    <StyledBox>
      <VStack space={4} alignItems="center">
        <Text style={weekResumeStyles.dateRangeText}>Semana del {currentWeek.startDate} al {currentWeek.endDate}</Text>
        <View style={weekResumeStyles.buttonContainer}>
          <Button
            title="Semana Anterior"
            onPress={handlePreviousWeek}
            containerStyle={weekResumeStyles.button}
            buttonStyle={weekResumeStyles.button}
            loading={loading}
          />
          <Button
            title="Semana Siguiente"
            onPress={handleNextWeek}
            containerStyle={weekResumeStyles.button}
            buttonStyle={weekResumeStyles.button}
            loading={loading}
            disabled={isNextWeekDisabled()}
          />
        </View>
        {renderTable()}
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
