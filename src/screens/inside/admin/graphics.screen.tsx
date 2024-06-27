import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { Button } from 'react-native-elements';
import { BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import tokenUseStore from '../../../useStores/token.useStore';
import isAdminUseStore from '../../../useStores/isAdmin.useStore';
import Toast from 'react-native-toast-message';
import { getWorkersService } from '../../../services/auth/auth.service';
import { getWeekHoursService, getYearHoursService } from '../../../services/registers/registers.service';
import { graphicsStyles } from '../../../styles/graphics.styles';

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
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [monthlyData, setMonthlyData] = useState<number[]>(Array(12).fill(0));
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [weekRange, setWeekRange] = useState('');
  const [yearRange, setYearRange] = useState('');
  const [loading, setLoading] = useState(false);

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

  const fetchWeeklyData = async (workerId: number, offset: number) => {
    setLoading(true);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + offset * 7 - startDate.getDay() + 1);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    setWeekRange(`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);

    const payload = {
      token: storedToken,
      id: workerId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };

    const response = await getWeekHoursService(payload);
    setLoading(false);

    if (response.success) {
      if (response.data && response.data.length > 0) {
        const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
        const weeklyHours = Array(7).fill(0);
        response.data.forEach((item: any) => {
          const dayIndex = daysOfWeek.indexOf(item.day.toLowerCase());
          if (dayIndex !== -1) {
            weeklyHours[dayIndex] = parseFloat(item.hoursWorked);
          }
        });
        setWeeklyData(weeklyHours);
      } else {
        setWeeklyData([0, 0, 0, 0, 0, 0, 0]);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener horas semanales'
      });
    }
  };

  const fetchMonthlyData = async (workerId: number, year: number) => {
    setLoading(true);

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    setYearRange(String(year));

    const payload = {
      token: storedToken,
      id: workerId,
      startDate,
      endDate
    };

    const response = await getYearHoursService(payload);
    setLoading(false);

    if (response.success) {
      if (response.data && response.data.length > 0) {
        const monthlyHours = Array(12).fill(0);
        response.data.forEach((item: any) => {
          const monthIndex = item.month - 1;
          if (monthIndex >= 0 && monthIndex < 12) {
            monthlyHours[monthIndex] += parseFloat(item.hoursWorked);
          }
        });
        setMonthlyData(monthlyHours);
      } else {
        setMonthlyData(Array(12).fill(0));
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

  const renderWeeklyChart = () => {
    return (
      <View style={graphicsStyles.chartContainer}>
        <Text style={graphicsStyles.chartTitle}>Horas Trabajadas Semanales</Text>
        <BarChart
          data={{
            labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
            datasets: [{ data: weeklyData }]
          }}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=" h"
          chartConfig={chartConfig}
          fromZero={true}
          yAxisInterval={2}
        />
      </View>
    );
  };

  const renderMonthlyChart = () => (
    <View style={graphicsStyles.chartContainer}>
      <Text style={graphicsStyles.chartTitle}>Horas Promedio Mensuales</Text>
      <BarChart
        data={{
          labels: [
            "En", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ag", "Sep", "Oct", "Nov", "Dic"
          ],
          datasets: [{ data: monthlyData }]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" h"
        chartConfig={chartConfig}
        fromZero={true}
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
    <ScrollView contentContainerStyle={graphicsStyles.container}>
      {workers.map((worker: Worker) => (
        <TouchableOpacity key={worker.id} onPress={() => {
          setSelectedWorker(worker);
          fetchWeeklyData(worker.id, currentWeekOffset);
          fetchMonthlyData(worker.id, currentYear);
        }}>
          <View style={graphicsStyles.workerContainer}>
            <Text style={graphicsStyles.workerText}>{worker.name} {worker.lastName}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {selectedWorker && (
        <>
          <Text style={graphicsStyles.subtitle}>Horas de Trabajo de {selectedWorker.name} {selectedWorker.lastName}</Text>
          <Text style={graphicsStyles.dateRange}>{weekRange}</Text>
          <View style={graphicsStyles.buttonsContainer}>
            <Button
              containerStyle={graphicsStyles.buttonContainer}
              buttonStyle={graphicsStyles.button}
              loading={loading}
              title="Semana Anterior"
              onPress={() => setCurrentWeekOffset(currentWeekOffset - 1)}
            />
            <Button
              containerStyle={graphicsStyles.buttonContainer}
              buttonStyle={graphicsStyles.button}
              loading={loading}
              title="Semana Siguiente"
              onPress={() => setCurrentWeekOffset(currentWeekOffset + 1)}
              disabled={isNextWeekDisabled()}
            />
          </View>
          {renderWeeklyChart()}
          <Text style={graphicsStyles.dateRange}>{yearRange}</Text>
          <View style={graphicsStyles.buttonsContainer}>
            <Button
              containerStyle={graphicsStyles.buttonContainer}
              buttonStyle={graphicsStyles.button}
              loading={loading}
              title="Año Anterior"
              onPress={() => setCurrentYear(currentYear - 1)}
            />
            <Button
              containerStyle={graphicsStyles.buttonContainer}
              buttonStyle={graphicsStyles.button}
              loading={loading}
              title="Año Siguiente"
              onPress={() => setCurrentYear(currentYear + 1)}
              disabled={currentYear >= new Date().getFullYear()}
            />
          </View>
          {renderMonthlyChart()}
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: "#ffffff",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#ffffff",
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false
};

export default GraphicsMenuScreen;
