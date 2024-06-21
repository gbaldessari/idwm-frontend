import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Button, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import tokenUseStore from '../../../useStores/token.useStore';
import isAdminUseStore from '../../../useStores/isAdmin.useStore';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { getWorkersService } from '../../../services/auth/auth.service';
import { getWeekHoursService, getYearHoursService } from '../../../services/registers/registers.service';

interface Worker {
  id: number;
  name: string;
  lastName: string;
}

const screenWidth = Dimensions.get('window').width;

const GraphicsMenuScreen = () => {
  const { storedToken } = tokenUseStore();
  const { storedIsAdmin } = isAdminUseStore();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<number[]>([]);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

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

  const fetchWeeklyData = async (workerId: number, offset: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + offset * 7 - startDate.getDay() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  
    const payload = {
      token: storedToken,
      id: workerId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  
    const response = await getWeekHoursService(payload);
    if (response.success) {
      // Verifica si response.data es definido antes de asignar el estado
      if (response.data) {
        setWeeklyData(response.data);
      } else {
        setWeeklyData([]); // Asigna un arreglo vacío si response.data es undefined
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener horas semanales'
      });
    }
  };
  
  const fetchMonthlyData = async (workerId: number, year: number) => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
  
    const payload = {
      token: storedToken,
      id: workerId,
      startDate,
      endDate
    };
  
    const response = await getYearHoursService(payload);
    if (response.success) {
      // Verifica si response.data es definido antes de asignar el estado
      if (response.data) {
        setMonthlyData(response.data);
      } else {
        setMonthlyData([]); // Asigna un arreglo vacío si response.data es undefined
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener horas anuales'
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (selectedWorker) {
        fetchWeeklyData(selectedWorker.id, currentWeekOffset);
        fetchMonthlyData(selectedWorker.id, currentYear);
      }
    }, [selectedWorker, currentWeekOffset, currentYear])
  );

  const renderWeeklyChart = () => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Horas Trabajadas Semanales</Text>
      <LineChart
        data={{
          labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
          datasets: [{ data: weeklyData }]
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );

  const renderMonthlyChart = () => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Horas Promedio Mensuales</Text>
    <BarChart
      data={{
        labels: [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ],
        datasets: [{ data: monthlyData }]
      }}
      width={screenWidth - 40}
      height={220}
      yAxisLabel="h"
      yAxisSuffix="h"
      chartConfig={chartConfig}
    />
  </View>
);


  const isNextWeekDisabled = () => {
    const today = new Date();
    const currentStartDate = new Date();
    currentStartDate.setDate(currentStartDate.getDate() + currentWeekOffset * 7 - currentStartDate.getDay() + 1);
    return currentStartDate > today;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {workers.map((worker: Worker) => (
        <TouchableOpacity key={worker.id} onPress={() => {
          setSelectedWorker(worker);
          fetchWeeklyData(worker.id, currentWeekOffset);
          fetchMonthlyData(worker.id, currentYear);
        }}>
          <View style={styles.workerContainer}>
            <Text style={styles.workerText}>{worker.name} {worker.lastName}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {selectedWorker && (
        <>
          <Text style={styles.subtitle}>Horas de Trabajo de {selectedWorker.name} {selectedWorker.lastName}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Semana Anterior" onPress={() => setCurrentWeekOffset(currentWeekOffset - 1)} />
            <Button title="Semana Siguiente" onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)} disabled={isNextWeekDisabled()} />
          </View>
          {renderWeeklyChart()}
          <View style={styles.buttonContainer}>
            <Button title="Año Anterior" onPress={() => setCurrentYear(currentYear - 1)} />
            <Button title="Año Siguiente" onPress={() => setCurrentYear(currentYear + 1)} disabled={currentYear >= new Date().getFullYear()} />
          </View>
          {renderMonthlyChart()}
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  workerContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
  },
  workerText: {
    fontSize: 18
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  }
});

export default GraphicsMenuScreen;
