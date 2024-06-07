import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Box, Text } from 'native-base';
import { ListItem } from 'react-native-elements';
import tokenUseStore from '../../useStores/token.useStore';
import isAdminUseStore from '../../useStores/isAdmin.useStore';
import getWorkersService from '../../services/getWorkers.service';
import getRegistersByRangeService from '../../services/getRegistersByRange.service';

const AdminMenuScreen = () => {
  const { storedToken } = tokenUseStore();
  const { storedIsAdmin } = isAdminUseStore();
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [registers, setRegisters] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkers = async () => {
      if (storedIsAdmin !== 3) {
        console.log("Fetching workers...");
        const response = await getWorkersService(storedToken);
        if (response.success) {
          console.log("Workers fetched:", response.data);
          setWorkers(response.data);
        } else {
          console.log("Failed to fetch workers:", response.error);
        }
      } else {
        console.log("User is not admin, skipping fetch workers.");
      }
    };
    fetchWorkers();
  }, [storedToken, storedIsAdmin]);

  const fetchRegisters = async (workerId: number) => {
    const endDate = new Date(); // use the current date
    const startDate = new Date(endDate); // clone the current date
    startDate.setDate(endDate.getDate() - 7); // one week back
    const payload = {
      token: storedToken || "",
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
    console.log("Fetching registers for worker:", workerId, "with payload:", payload);
    const response = await getRegistersByRangeService(payload);
    if (response.success) {
      console.log("Registers fetched:", response.data);
      setRegisters(response.data);
    } else {
      console.log("Failed to fetch registers:", response.error);
    }
  };

  return (
    <StyledBox>
      <Text style={styles.title}>Administrar Trabajadores</Text>
      <FlatList
        data={workers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListItem bottomDivider onPress={() => {
            setSelectedWorker(item);
            fetchRegisters(item.id);
          }}>
            <ListItem.Content>
              <ListItem.Title>{item.name}</ListItem.Title>
              <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        )}
      />
      {selectedWorker && (
        <>
          <Text style={styles.subtitle}>Entradas y Salidas de {selectedWorker.name}</Text>
          <FlatList
            data={registers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListItem bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{item.date}</ListItem.Title>
                  <ListItem.Subtitle>Entrada: {item.timeEntry}</ListItem.Subtitle>
                  <ListItem.Subtitle>Salida: {item.timeExit}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
          />
        </>
      )}
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
  subtitle: {
    fontSize: 25,
    textAlign: 'center',
    lineHeight: 25,
    marginVertical: 20,
  },
});

export default AdminMenuScreen;
