import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';

const MainScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();
  const [loading, setLoading] = useState({ login: false, register: false });
  const [isPressed, setIsPressed] = useState({ login: false, register: false });

  const handleNavigation = (type: 'login' | 'register') => {
    if (isPressed.login || isPressed.register) return;

    setIsPressed((prevState) => ({ ...prevState, [type]: true }));
    setLoading((prevState) => ({ ...prevState, [type]: true }));

    setIsPressed((prevState) => ({ ...prevState, [type]: false }));
    setLoading((prevState) => ({ ...prevState, [type]: false }));
    navigation.navigate(type === 'login' ? 'Login' : 'Register');
  };

  return (
    <StyledContainer>
      <StyledBox text="MarcApp" />
      <LoginButton onPress={() => handleNavigation('login')} loading={loading.login} disabled={isPressed.register} />
      <RegisterButton onPress={() => handleNavigation('register')} loading={loading.register} disabled={isPressed.login} />
    </StyledContainer>
  );
};

const StyledBox = ({ text }: { text: string }) => (
  <Center>
    <Box>
      <Text style={styles.title}>{text}</Text>
    </Box>
  </Center>
);

const LoginButton = ({ onPress, loading, disabled }: { onPress: () => void; loading: boolean; disabled: boolean }) => (
  <Center>
    <Button
      title="Ingresar"
      onPress={onPress}
      loading={loading}
      buttonStyle={styles.button}
      disabled={disabled}
    />
  </Center>
);

const RegisterButton = ({ onPress, loading, disabled }: { onPress: () => void; loading: boolean; disabled: boolean }) => (
  <Center>
    <Button
      title="Registrarse"
      onPress={onPress}
      loading={loading}
      buttonStyle={styles.button}
      disabled={disabled}
    />
  </Center>
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 60,
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'serif',
  },
  button: {
    height: 45,
    width: 160,
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
});

export default MainScreen;
