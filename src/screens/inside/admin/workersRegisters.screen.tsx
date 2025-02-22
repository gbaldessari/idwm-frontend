import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Box, Text } from 'native-base';
import { Button } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tokenUseStore from '../../../useStores/token.useStore';
import isAdminUseStore from '../../../useStores/isAdmin.useStore';
import Toast from 'react-native-toast-message';
import { workersRegistersStyles } from '../../../styles/workersRegisters.styles';
import selectedRegisterUseStore from '../../../useStores/selectedRegister.useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { getWorkersService } from '../../../services/auth/auth.service';
import { adminCreateRegisterService, getRegistersOfWorkersService } from '../../../services/registers/registers.service';
import { Register, ServiceResponse } from '../../../types/services.types';

interface Worker {
  id: number;
  name: string;
  lastName: string;
}

const emptyRegister: Register = {
  id: 0,
  date: '',
  timeEntry: '',
  timeExit: '',
  createdAt: '',
  updatedAt: '',
  userId: 0,
};

interface DateRange {
  startDate: string;
  endDate: string;
}

const WorkersRegistersScreen: React.FC = () => {
  const { storedToken } = tokenUseStore();
  const { storedIsAdmin } = isAdminUseStore();
  const { setSelectedRegister } = selectedRegisterUseStore();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [registers, setRegisters] = useState<Register[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();


  useEffect(() => {
    const fetchWorkers = async () => {
      if (storedIsAdmin === 3) {
        Toast.show({
          type: 'error',
          text1: 'Usuario no autorizado'
        });
        return;
      }
      setLoading(true);
      const response = await getWorkersService(storedToken);
      setLoading(false);
      if (response.success) {
        setWorkers(response.data.data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al obtener trabajadores'
        });
      }
    };
    fetchWorkers();
  }, [storedToken, storedIsAdmin]);

  const fetchRegisters = async (workerId: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + currentWeekOffset * 7 - startDate.getDay() + 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });

    const payload = {
      token: storedToken,
      id: workerId.toString(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    setLoading(true);
    const response: ServiceResponse<Register[]> = await getRegistersOfWorkersService(payload);
    setLoading(false);
    if (response.success) {
      if (response.data?.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No se encontraron registros para este trabajador'
        });
      }
      setRegisters(response.data ?? []);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener registros'
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedWorker) {
        fetchRegisters(selectedWorker.id);
      }
    }, [selectedWorker, currentWeekOffset])
  );

  const handleOnEdit = (register: Register, selectedDate: Date) => {
    if (register.id === 0) {
      const payload = {
        token: storedToken,
        id: selectedWorker?.id ?? 0,
        date: selectedDate.toISOString().split('T')[0],
      };
      adminCreateRegisterService(payload).then(response => {
        if (response.success && response.data) {
          console.log(response);
          const newRegister: Register = {
            id: response.data,
            userId: selectedWorker?.id ?? 0,
            date: payload.date,
            timeEntry: '00:00:00',
            timeExit: '00:00:00',
            createdAt: '',
            updatedAt: ''
          };
          setSelectedRegister(newRegister);
          navigation.navigate('EditRegister');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error al crear el registro'
          });
        }
      });
    } else {
      setSelectedRegister(register);
      navigation.navigate('EditRegister');
    }
  };

  const renderTable = () => {
    const startDate = new Date(dateRange.startDate);
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return (
      <View style={workersRegistersStyles.table}>
        <View style={workersRegistersStyles.tableHeader}>
          <Text style={workersRegistersStyles.tableHeaderText}>Día</Text>
          <Text style={workersRegistersStyles.tableHeaderText}>Registro</Text>
        </View>
        {dates.map((date, index) => {
          const register = registers.find((r: Register) => new Date(r.date).toDateString() === date.toDateString()) || emptyRegister;
          return (
            <TouchableOpacity key={index} style={workersRegistersStyles.tableRow} onPress={() => handleOnEdit(register, date)}>
              <View style={workersRegistersStyles.tableCell}>
                <Text style={workersRegistersStyles.tableText}>{date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}</Text>
              </View>
              <View style={workersRegistersStyles.tableCell}>
                {register.timeEntry || register.timeExit ? (
                  <>
                    <Text style={workersRegistersStyles.tableText}>Entrada: {register.timeEntry}</Text>
                    <Text style={workersRegistersStyles.tableText}>Salida: {register.timeExit}</Text>
                  </>
                ) : (
                  <Text style={workersRegistersStyles.tableText}>Sin registros</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const isNextWeekDisabled = () => {
    const today = new Date();
    const currentStartDate = new Date();
    currentStartDate.setDate(currentStartDate.getDate() + currentWeekOffset * 7 - currentStartDate.getDay() + 1);
    return currentStartDate > today;
  };

  return (
    <StyledBox>
      <ScrollView>
        {workers.map((worker: Worker) => (
          <TouchableOpacity key={worker.id} onPress={() => {
            setSelectedWorker(worker);
            fetchRegisters(worker.id);
          }}>
            <View style={workersRegistersStyles.workerContainer}>
              <Text style={workersRegistersStyles.workerText}>{worker.name} {worker.lastName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedWorker && (
        <>
          <Text style={workersRegistersStyles.subtitle}>Entradas y Salidas de {selectedWorker.name} {selectedWorker.lastName}</Text>
          <Text style={workersRegistersStyles.dateRangeText}>Semana del {dateRange.startDate} al {dateRange.endDate}</Text>
          <View style={workersRegistersStyles.buttonsContainer}>
            <Button
              containerStyle={workersRegistersStyles.buttonContainer}
              buttonStyle={workersRegistersStyles.button}
              title="Semana Anterior"
              loading={loading}
              onPress={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            />
            <Button
              containerStyle={workersRegistersStyles.buttonContainer}
              buttonStyle={workersRegistersStyles.button}
              title="Semana Siguiente"
              onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              loading={loading}
              disabled={isNextWeekDisabled()}
            />
          </View>
          {renderTable()}
        </>
      )}
    </StyledBox>
  );
};

const StyledBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={workersRegistersStyles.container}>
    <Box>{children}</Box>
  </View>
);

export default WorkersRegistersScreen;
