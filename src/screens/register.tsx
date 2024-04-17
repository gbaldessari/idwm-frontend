import React, { useEffect, useRef, useState } from 'react';
import { Box, Center, VStack, AlertDialog } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { Button,Input} from 'react-native-elements';
import registerService from '../services/register.services';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';

type FormDataT = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: string;
};

const InitData = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  birthdate: '',
};

const Register = () => {
  const [data, setData] = useState<FormDataT>(InitData);
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const cancelRef = useRef(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');

  const [validName, setValidName] = useState<boolean>(false);
  const [validLastName, setValidLastName] = useState<boolean>(false);
  const [validMail, setValidMail] = useState<boolean>(false);
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [validBirthdate, setValidBirthdate] = useState<boolean>(false);
  
  const [errorMessageName, setErrorMessageName] = useState<string>('');
  const [errorMessageLastName, setErrorMessageLastName] = useState<string>('');
  const [errorMessageMail, setErrorMessageMail] = useState<string>('');
  const [errorMessagePassword, setErrorMessagePassword] = useState<string>('');
  const [errorMessageBirthdate, setErrorMessageBirthdate] = useState<string>('');

  const setValue = (key: string, value: string) => {
    setData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };
  
  useEffect(() => {
    const errors = registerSchema.validate({ name });
    if (errors?.error?.details[0]?.context?.key === 'name') {
      setErrorMessageName(errors.error.details[0].message);
      setValidName(false);
    } else{
      setErrorMessageName('');
      setValidName(true);
    }
    return;
  }, [name]);

  useEffect(() => {
    const errors = registerSchema.validate({ lastName });
    if (errors?.error?.details[0]?.context?.key === 'lastName') {
      setErrorMessageLastName(errors.error.details[0].message);
      setValidLastName(false);
    } else{
      setErrorMessageLastName('');
      setValidLastName(true);
    }
    return;
  }, [lastName]);

  useEffect(() => {
    const errors = registerSchema.validate({ mail });
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
    const errors = registerSchema.validate({ password });
    if (errors?.error?.details[0]?.context?.key === 'password') {
      setErrorMessagePassword(errors.error.details[0].message);
      setValidPassword(false);
    } else{
      setErrorMessagePassword('');
      setValidPassword(true);
    }
    return;
  }, [password]);

  useEffect(() => {
    const errors = registerSchema.validate({ birthdate });
    if (errors?.error?.details[0]?.context?.key === 'birthdate') {
      setErrorMessageBirthdate(errors.error.details[0].message);
      setValidBirthdate(false);
    } else{
      setErrorMessageBirthdate('');
      setValidBirthdate(true);
    }
    return;
  }, [birthdate]);

  const onCreateAccount = async () => {
    if(!validName || !validLastName || !validMail || !validPassword || !validBirthdate){
      return;
    }
    setIsDisabledText(true);
    setLoading(true);
    //const response = await registerService(data);
    setTimeout(() => {
      setIsDisabledText(false);
      setLoading(false);
      //setMessage((response?.data || response?.error) as string);
      //setAlert(true);

      //if (response?.success) {
        //setData(InitData);
        navigation.navigate('Main');
      //}
    },1000);
  };

  const NavigationButton = () => (
    <Center>
      <Button
      title = {'Crear cuenta'}
      onPress = {onCreateAccount}
      loading = {loading}
      buttonStyle={{ 
        marginVertical: 10,
        backgroundColor: 'red'
        }}
      />
    </Center>
  );

  const CustomAlertDialog = () => (
    <AlertDialog 
      leastDestructiveRef={cancelRef}
      isOpen={alert}
      onClose={() => setAlert(false)}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton/>
        <AlertDialog.Body>{message}</AlertDialog.Body>
      </AlertDialog.Content>
    </AlertDialog>
  );

  return (
    <View style = {styles.container}>
      <Box style={styles.containerBox}>
        <CustomAlertDialog/>
        <VStack space={4} alignItems='center'>
        <FormInput
            label='Nombre'
            placeholder='Eric'
            errorMessage={errorMessageName}
            onChangeText={(value: string) => setName(value)}
            disabled={isDisabledText}
          />
          <FormInput
            label='Apellido'
            placeholder='Ross'
            errorMessage={errorMessageLastName}
            onChangeText={(value: string) => setLastName(value)}
            disabled={isDisabledText}
          />
          <FormInput
            label='Email'
            placeholder='user@example.com'
            errorMessage={errorMessageMail}
            onChangeText={(value: string) => setMail(value)}
            disabled={isDisabledText}
          />
          <FormInput
            label='Contraseña'
            placeholder='*********'
            errorMessage={errorMessagePassword}
            onChangeText={(value: string) => setPassword(value)}
            disabled={isDisabledText}
            secureTextEntry
          />
          <FormInput
            label='Fecha de nacimiento'
            placeholder='DD/MM/AAAA'
            errorMessage={errorMessageBirthdate}
            onChangeText={(value: string) => setBirthdate(value)}
            disabled={isDisabledText}
          />
          <NavigationButton/>
        </VStack>
      </Box>
    </View>
  );
};

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

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(20),
  lastName: Joi.string().min(1).max(20),
  mail: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/),
  password: Joi.string().min(8).max(12),
  birthdate: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).custom((value, helpers) => {
    const [day, month, year] = value.split('/');
    const date = new Date(year, month - 1, day);
    const now = new Date();
    if (date.getFullYear() !== parseInt(year) || date.getMonth() + 1 !== parseInt(month) || date.getDate() !== parseInt(day)) {
      return helpers.error('any.invalid');
    }
    if (date > now) {
      return helpers.error('Fecha de nacimiento no puede ser en el futuro');
    }
    return value;
  }, 'Fecha de nacimiento')
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10
  },
  containerBox: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    margin: 30
  }
});

export default Register;
