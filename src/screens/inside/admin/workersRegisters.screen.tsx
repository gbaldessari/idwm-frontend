import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Box, Text } from 'native-base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tokenUseStore from '../../../useStores/token.useStore';
import isAdminUseStore from '../../../useStores/isAdmin.useStore';
import getWorkersService from '../../../services/getWorkers.service';
import getRegistersOfWorkersService, { GetRegistersOfWorkersServiceResponseT } from '../../../services/getRegistersOfWorkers.service';
import Toast from 'react-native-toast-message';
import { workersRegistersStyles } from '../../../styles/workersRegisters.styles';
import selectedRegisterUseStore from '../../../useStores/selectedRegister.useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { adminCreateRegisterService } from '../../../services/schedule.service';

interface Worker {
  id: number;
  name: string;
  lastName: string;
}

interface Register {
  id: number;
  date: string;
  timeEntry: string;
  timeExit: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
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

      const response = await getWorkersService(storedToken);
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
      id: workerId.toString(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    const response: GetRegistersOfWorkersServiceResponseT = await getRegistersOfWorkersService(payload);
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
        id: selectedWorker?.id ?? 0,
        isEntry: true,
        date: selectedDate.toISOString().split('T')[0],
        time: "00:00:00"
      };
      adminCreateRegisterService(payload).then(response => {
        if (response.success && response.data) {
          const newRegister = {
            ...register,
            id: response.data.userId,
            userId: selectedWorker?.id ?? 0,
            date: payload.date,
            timeEntry: payload.time,
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
          <View style={workersRegistersStyles.buttonContainer}>
            <Button title="Semana Anterior" onPress={() => setCurrentWeekOffset(currentWeekOffset - 1)} />
            <Button title="Semana Siguiente" onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)} disabled={isNextWeekDisabled()} />
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
