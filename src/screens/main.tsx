import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
    <View style={styles.container}>
      <StyledBox text="MarcApp" />
      <LoginButton onPress={() => handleNavigation('login')} loading={loading.login} disabled={isPressed.register} />
      <RegisterButton onPress={() => handleNavigation('register')} loading={loading.register} disabled={isPressed.login} />
    </View>
  );
};

const StyledBox = ({ text }: { text: string }) => (
  <View style={styles.containerBox}>
    <Box>
      <Text style={styles.title}>{text}</Text>
    </Box>
  </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  containerBox: {
    flex: 0,
    justifyContent: 'center',
    marginVertical: 100,
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

export default Main;
