import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import 'text-encoding-polyfill';
import Joi from 'joi';
import loginService from '../services/login.service';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Center } from 'native-base';

type FormDataT = {
  email: string;
  password: string;
};

const InitData = {
  email: '',
  password: '',
};

const Login = () => {
  const [data, setData] = useState<FormDataT>(InitData);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {setMail: setMailStore} = useStore();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingForgotten, setLoadingForgotten] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [isForgottenPressed, setIsForgottenPressed] = useState<boolean>(false);
  const [isLoginPressed, setIsLoginPressed] = useState<boolean>(false);
  const [validMail, setValidMail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [mail, setMail] = useState<string>('');
  const [errorMessageMail, setErrorMessageMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>('');

  useEffect(() => {
    const errors = loginSchema.validate({ mail });
    if (errors?.error?.details[0]?.context?.key === 'mail') {
      setErrorMessageMail(errors.error.details[0].message);
      setValidMail(false);
    } else{
      setErrorMessageMail('');
      setValidMail(true);
    }
    return;
  }, [mail]);
  
  useEffect(() => {
    const errors = loginSchema.validate({ password });
    if (errors?.error?.details[0]?.context?.key === 'password') {
      setErrorMessagePassword(errors.error.details[0].message);
      setValidPassword(false);
    } else{
      setErrorMessagePassword('');
      setValidPassword(true);
    }
    return;
  }, [password]);

  const onLogin = async () => {
    if(!validPassword || !validMail || isForgottenPressed){
      return;
    }
    setIsLoginPressed(true);
    setIsDisabledText(true);
    setLoadingLogin(true);

    const dataObj = {
      email: mail,
      password: password
    }
    const response = await loginService(dataObj);
    setIsLoginPressed(false);
    setIsDisabledText(false);
    setLoadingLogin(false);
    setMailStore(mail);
    if (response?.success) {
      setData(InitData);
      navigation.navigate('Home');
    }
  };

  const onForgotten = async () => {
    if(isLoginPressed){
      return;
    }
    setIsForgottenPressed(true);
    setIsDisabledText(true);
    setLoadingForgotten(true);
    setTimeout(() => {
      setMailStore(mail);
      setIsForgottenPressed(false);
      setIsDisabledText(false);
      setLoadingForgotten(false);
      setMailStore(mail);
      navigation.navigate('Forgotten');
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
        disabled={isForgottenPressed}
      />
    </Center>
  );

  const ForgottenButton = () => (
    <Center>
      <Button
        title={'¿Olvido su contraseña?'}
        onPress={onForgotten}
        loading={loadingForgotten}
        type="clear"
        titleStyle={{
          color: 'black'
        }}
        disabled={isLoginPressed}
      />
    </Center>
  );
  
  return (
    <View style={styles.container}>
      <FormInput
        label="Mail"
        placeholder="user@example.com"
        errorMessage={errorMessageMail}
        onChangeText={(value: string) => setMail(value)}
        disabled = {isDisabledText}
      />
      <FormInput
        label="Contraseña"
        placeholder="********"
        errorMessage={errorMessagePassword}
        onChangeText={(value: string) => setPassword(value)}
        secureTextEntry
        disabled = {isDisabledText}
      />
      <LoginButton/>
      <ForgottenButton/>
    </View>
  );
};

const loginSchema = Joi.object({
  mail: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/),
  password: Joi.string().min(8).max(12),
});

const FormInput = ({ 
  label, 
  placeholder, 
  errorMessage, 
  onChangeText, 
  secureTextEntry, 
  disabled }: { 
    label: string, 
    placeholder: string, 
    errorMessage: string, 
    onChangeText: (value: string) => void, 
    secureTextEntry?: boolean, disabled: boolean}) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    disabled = {disabled}
  />
);

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white'
  }
});

export default Login;
