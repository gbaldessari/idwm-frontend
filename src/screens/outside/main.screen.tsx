import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { mainStyles } from '../../styles/main.styles';

const MainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <StyledContainer>
      <StyledBox text="GeoMarcaje Pro" />
      <CustomButton title='Ingresar' onPress={handleLogin} />
      <CustomButton title='Registrarse' onPress={handleRegister} />
    </StyledContainer>
  );
};

const StyledBox = ({ text }: { text: string }) => (
  <Center>
    <Box>
      <Text style={mainStyles.title}>{text}</Text>
    </Box>
  </Center>
);

const CustomButton = ({ title, onPress }: { title: string; onPress: () => void; }) => (
  <Center>
    <Button
      title={title}
      onPress={onPress}
      buttonStyle={mainStyles.button}
    />
  </Center>
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={mainStyles.container}>{children}</View>
);

export default MainScreen;
