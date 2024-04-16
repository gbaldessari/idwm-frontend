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

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser: setUserStore } = useStore();
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingForgotten, setLoadingForgotten] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [errorMessageUser, setErrorMessageUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>('');
  const [isForgottenPressed, setIsForgottenPressed] = useState<boolean>(false);
  const [isLoginPressed, setIsLoginPressed] = useState<boolean>(false);
  const [validUser, setValidUser] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);

  useEffect(() => {
    const errors = loginSchema.validate({ user });
    if (errors?.error?.details[0]?.context?.key === 'user') {
      setErrorMessageUser(errors.error.details[0].message);
      setValidUser(false);
    } else{
      setErrorMessageUser('');
      setValidUser(true);
    }
    return;
  }, [user]);
  
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
    if(!validPassword || !validUser || isForgottenPressed){
      return;
    }
    setIsLoginPressed(true);
    setIsDisabledText(true);
    setLoadingLogin(true);
    //const payload = { user, password };
    setTimeout(() => {
      setIsLoginPressed(false);
      setIsDisabledText(false);
      setLoadingLogin(false);
      setUserStore(user);
      navigation.navigate('Home');
    }, 1000);
    // const response = await loginService(payload);
  };

  const onForgotten = async () => {
    if(isLoginPressed){
      return;
    }
    setIsForgottenPressed(true);
    setIsDisabledText(true);
    setLoadingForgotten(true);
    setTimeout(() => {
      setIsForgottenPressed(false);
      setIsDisabledText(false);
      setLoadingForgotten(false);
      setUserStore(user);
      navigation.navigate('Forgotten');
    }, 1000);
  };

  const LoginButton = () => (
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
  );

  const ForgottenButton = () => (
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
  );
  
  return (
    <View style={styles.container}>
      <FormInput
        label="Usuario"
        placeholder="Usuario"
        errorMessage={errorMessageUser}
        onChangeText={(value: string) => setUser(value)}
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
  user: Joi.string().min(8).max(20),
  password: Joi.string().min(8).max(20),
});

const FormInput = ({ label, placeholder, errorMessage, onChangeText, secureTextEntry, disabled }: { label: string, placeholder: string, errorMessage: string, onChangeText: (value: string) => void, secureTextEntry?: boolean, disabled: boolean}) => (
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
