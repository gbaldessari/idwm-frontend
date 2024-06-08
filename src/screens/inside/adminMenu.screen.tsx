import React, { useEffect, useState } from 'react';
import { View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { Box, Text } from 'native-base';
import tokenUseStore from '../../useStores/token.useStore';
import isAdminUseStore from '../../useStores/isAdmin.useStore';
import getWorkersService from '../../services/getWorkers.service';
import getRegistersByRangeService from '../../services/getRegistersByRange.service';
import Toast from 'react-native-toast-message';
import { adminMenuStyles } from '../../styles/adminMenu.styles';

const AdminMenuScreen = () => {
  const { storedToken } = tokenUseStore();
  const { storedIsAdmin } = isAdminUseStore();
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [registers, setRegisters] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      if (storedIsAdmin !== 3) {
        const response = await getWorkersService(storedToken);
        if (response.success) {
          setWorkers(response.data.data);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error al obtener trabajadores'
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Usuario no autorizado'
        });
      }
    };
    fetchWorkers();
  }, [storedToken, storedIsAdmin]);

  const fetchRegisters = async (workerToken: string) => {
    const endDate = new Date(); // use the current date
    const startDate = new Date(endDate); // clone the current date
    startDate.setDate(endDate.getDate() - 7); // one week back
    const payload = {
      token: workerToken || "",
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    const response = await getRegistersByRangeService(payload);
    if (response.success) {
      setRegisters(response.data);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener registros'
      });
    }
  };

  return (
    <StyledBox>
      <Text style={adminMenuStyles.title}>Administrar Trabajadores</Text>
      <ScrollView>
        {workers.map((worker: any) => (
          <TouchableOpacity key={worker.id} onPress={() => {
            setSelectedWorker(worker);
            fetchRegisters(worker.token); // Use worker's token
          }}>
            <View style={adminMenuStyles.workerContainer}>
              <Text style={adminMenuStyles.workerText}>{worker.name} {worker.lastName}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedWorker && (
        <>
          <Text style={adminMenuStyles.subtitle}>Entradas y Salidas de {selectedWorker.name} {selectedWorker.lastName}</Text>
          <FlatList
            data={registers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={adminMenuStyles.registerContainer}>
                <Text style={adminMenuStyles.registerText}>Fecha: {item.date}</Text>
                <Text style={adminMenuStyles.registerText}>Entrada: {item.timeEntry}</Text>
                <Text style={adminMenuStyles.registerText}>Salida: {item.timeExit}</Text>
              </View>
            )}
          />
        </>
      )}
    </StyledBox>
  );
};

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={adminMenuStyles.container}>
    <Box>{children}</Box>
  </View>
);

export default AdminMenuScreen;
