import React, { useState } from 'react';
import { View } from 'react-native';
import { Box, Text } from 'native-base';
import { Button } from 'react-native-elements';
import tokenUseStore from '../../useStores/token.useStore';
import scheduleService from '../../services/schedule.service';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';
import isAdminUseStore from '../../useStores/isAdmin.useStore';
import { homeStyles } from '../../styles/home.styles';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const { storedToken } = tokenUseStore();
  const { storedIsAdmin } = isAdminUseStore();
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handlePressEntry = async () => {
    const token: string = storedToken || "";
    const isEntry: boolean = true;

    setLoading(true);
    const response = await scheduleService({ token, isEntry});
    setLoading(false);

    if(response.success){
      Toast.show({
        type: 'success',
        text1: 'Entrada marcada con exito'
      });
    }else{
      Toast.show({
        type: 'error',
        text1: 'Error al marcar entrada'
      });
    }
  };

  const handlePressExit = async () => {
    const token: string = storedToken || "";
    const isEntry: boolean = false;

    setLoading(true);
    const response = await scheduleService({ token, isEntry});
    setLoading(false);

    if(response.success){
      Toast.show({
        type: 'success',
        text1: 'Salida marcada con exito'
      });
    }else{
      Toast.show({
        type: 'error',
        text1: 'Error al marcar salida'
      });
    }
  };

  const handlePressWeekResume = async () => {
    navigation.navigate('WeekResume');
  };

  const handlePressAdmin = async () => {
    navigation.navigate('AdminMenu');
  };

  return (
    <StyledBox>
      <Text style={homeStyles.title}>Bienvenido</Text>
      <ScheduleButton title="Marcar Entrada" onPress={handlePressEntry} loading={loading} />
      <ScheduleButton title="Marcar Salida" onPress={handlePressExit} loading={loading} />
      <ScheduleButton title="Resumen de la semana" onPress={handlePressWeekResume} loading={loading} />
      {storedIsAdmin !== 3&& (
        <ScheduleButton title="Menu Administrador" onPress={handlePressAdmin} loading={loading} />
      )}
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
