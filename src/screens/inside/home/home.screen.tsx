import React, { useState } from 'react';
import { View } from 'react-native';
import { Box, Text } from 'native-base';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location';
import tokenUseStore from '../../../useStores/token.useStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { homeStyles } from '../../../styles/home.styles';
import Toast from 'react-native-toast-message';
import { createRegisterService } from '../../../services/registers/registers.service';

const HomeScreen = () => {
  const { storedToken } = tokenUseStore();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const getLocation = async (): Promise<{ latitude: number, longitude: number }> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      console.log(location);

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      throw error;
    }
  };

  const handlePressEntry = async () => {
    const token: string = storedToken || "";
    const isEntry: boolean = true;

    setLoading(true);
    try {
      const { latitude, longitude } = await getLocation();
      const response = await createRegisterService({ token, isEntry, latitude, longitude });
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Entrada marcada con éxito'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al marcar entrada'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener la ubicación'
      });
    }
    setLoading(false);
  };

  const handlePressExit = async () => {
    const token: string = storedToken || "";
    const isEntry: boolean = false;

    setLoading(true);
    try {
      const { latitude, longitude } = await getLocation();
      const response = await createRegisterService({ token, isEntry, latitude, longitude });
      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Salida marcada con éxito'
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error al marcar salida'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al obtener la ubicación'
      });
    }
    setLoading(false);
  };

  const handlePressWeekResume = async () => {
    navigation.navigate('WeekResume');
  };

  return (
    <StyledBox>
      <Text style={homeStyles.title}>Bienvenido</Text>
      <ScheduleButton title="Marcar Entrada" onPress={handlePressEntry} loading={loading} />
      <ScheduleButton title="Marcar Salida" onPress={handlePressExit} loading={loading} />
      <ScheduleButton title="Resumen de la semana" onPress={handlePressWeekResume} loading={loading} />
    </StyledBox>
  );
};

const ScheduleButton = ({ title, onPress, loading }: { title: string; onPress: () => void; loading: boolean }) => (
  <Button
    title={title}
    onPress={onPress}
    loading={loading}
    containerStyle={homeStyles.buttonContainer}
    buttonStyle={homeStyles.button}
  />
);

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={homeStyles.container}>
    <Box>{children}</Box>
  </View>
);

export default HomeScreen;
