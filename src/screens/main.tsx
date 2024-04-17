import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [isLoginPressed, setIsLoginPressed] = useState<boolean>(false);
  const [isRegisterPressed, setIsRegisterPressed] = useState<boolean>(false);

  const onLogin = async () => {
    if (isRegisterPressed) {
      return;
    }
    setIsLoginPressed(true);
    setLoadingLogin(true);
    setTimeout(() => {
      setIsLoginPressed(false);
      setLoadingLogin(false);
      navigation.navigate('Login');
    }, 1000);
  };

  const onRegister = async () => {
    if (isLoginPressed) {
      return;
    }
    setIsRegisterPressed(true);
    setLoadingRegister(true);
    setTimeout(() => {
      setIsRegisterPressed(false);
      setLoadingRegister(false);
      navigation.navigate('Register');
    }, 1000);
  };

  const LoginButton = () => (
    <Center>
      <Button 
        title={'Ingresar'}
        onPress={onLogin}
        loading={loadingLogin}
        buttonStyle={{
          marginVertical: 10,
          backgroundColor: 'red'
        }}
        disabled = {isRegisterPressed}
      />
    </Center>
  );

  const RegisterButton = () => (
    <Center>
      <Button
        title={'Registrarse'}
        onPress={onRegister}
        loading={loadingRegister}
        buttonStyle={{
          marginVertical: 10,
          backgroundColor: 'red'
        }}
        disabled = {isLoginPressed}
      />
    </Center>
  );
  return (
    <View style={styles.container}>
      <StyledBox
        text='MarcApp'
      />
      <LoginButton/>
      <RegisterButton/>
    </View>
  );
};

const StyledBox = ({ text }: { text: string }) => (
  <View style = {styles.containerBox}>
    <Box>
      <Text style={styles.title}>
        {text}
      </Text>
    </Box>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  containerBox: {
    flex: 0,
    justifyContent: 'center',
    marginVertical: 100
  },
  title: {
    fontSize: 60,
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'serif'
  }
});

export default Main;
