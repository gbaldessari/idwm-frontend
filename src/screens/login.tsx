import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import 'text-encoding-polyfill';
import Joi from 'joi';
import loginService from '../services/login.service';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/useStore';

var validUser:boolean = false;
var validPassword:boolean = false;

const Login = () => {
  const navigation = useNavigation();
  const { setUser: setUserStore } = useStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string>('');
  const [errorMessageUser, setErrorMessageUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>('');

  useEffect(() => {
    const errors = loginSchema.validate({ user });

    if (errors?.error?.details[0]?.context?.key === 'user') {
      setErrorMessageUser(errors.error.details[0].message);
      validUser = false;
    } else{
      setErrorMessageUser('');
      validUser = true;
    }
    return;
  }, [user]);
  
  useEffect(() => {
    const errors = loginSchema.validate({ password });

    if (errors?.error?.details[0]?.context?.key === 'password') {
      setErrorMessagePassword(errors.error.details[0].message);
      validPassword = false;
    } else{
      setErrorMessagePassword('');
      validPassword = true;
    }
    return;
  }, [password]);

  const onLogin = async () => {
    if(!validPassword || !validUser){
      return;
    }
    //const payload = { user, password };
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUserStore(user);
      navigation.navigate('Home');
    }, 1000);
    // const response = await loginService(payload);
  };
  const NavigationButton = ({ title, loading }: { title: string, loading: boolean }) => (
    <Button title={title} onPress={onLogin} loading={loading} buttonStyle={{ marginVertical: 10, backgroundColor: 'red' }} />
  );

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}
    >
      <FormInput
        label="Usuario"
        placeholder="Usuario"
        errorMessage={errorMessageUser}
        onChangeText={(value: string) => setUser(value)}
      />
      <FormInput
        label="Contraseña"
        placeholder="********"
        errorMessage={errorMessagePassword}
        onChangeText={(value: string) => setPassword(value)}
        secureTextEntry
      />
      <NavigationButton title= 'Ingresar'  loading= {loading} />
    </View>
  );
 
};

const loginSchema = Joi.object({
  user: Joi.string().min(8).max(20),
  password: Joi.string().min(8).max(20),
});



const FormInput = ({ label, placeholder, errorMessage, onChangeText, secureTextEntry }: { label: string, placeholder: string, errorMessage: string, onChangeText: (value: string) => void, secureTextEntry?: boolean }) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);

export default Login;
