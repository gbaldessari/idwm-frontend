import React, { useEffect, useRef, useState } from 'react';
import { Box, Center, VStack, AlertDialog } from 'native-base';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
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

const InitData: FormDataT = {
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
  const [loading, setLoading] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);

  const [errors, setErrors] = useState<Record<keyof FormDataT, string>>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: ''
  });

  const handleInputChange = (field: keyof FormDataT) => (value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const validateField = (field: keyof FormDataT, value: string) => {
    const schema = Joi.object({ [field]: registerSchema.extract(field) });
    const { error } = schema.validate({ [field]: value });
    setErrors(prev => ({
      ...prev,
      [field]: error ? error.details[0].message : '',
    }));
  };

  const isValidForm = () => {
    const { error } = registerSchema.validate(data, { abortEarly: false });
    if (!error) return true;

    const fieldErrors = error.details.reduce((acc, { context, message }) => {
      if (context?.key) acc[context.key as keyof FormDataT] = message;
      return acc;
    }, {} as Record<keyof FormDataT, string>);

    setErrors(fieldErrors);
    return false;
  };

  const onCreateAccount = async () => {
    if (!isValidForm()) return;

    setIsDisabledText(true);
    setLoading(true);

    const response = await registerService(data);
    setIsDisabledText(false);
    setLoading(false);
    setMessage(response?.data || response?.error || '');
    setAlert(true);

    if (response?.success) {
      setData(InitData);
      navigation.navigate('Main');
    }
  };

  return (
    <View style={styles.container}>
      <Box style={styles.containerBox}>
        <CustomAlertDialog alert={alert} message={message} onClose={() => setAlert(false)} cancelRef={cancelRef} />
        <VStack space={4} alignItems='center'>
          {Object.keys(data).map((field) => (
            <FormInput
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              placeholder={field === 'birthdate' ? 'DD/MM/AAAA' : field === 'password' ? '*********' : ''}
              errorMessage={errors[field as keyof FormDataT]}
              onChangeText={handleInputChange(field as keyof FormDataT)}
              secureTextEntry={field === 'password'}
              disabled={isDisabledText}
            />
          ))}
          <NavigationButton title='Crear cuenta' onPress={onCreateAccount} loading={loading} />
        </VStack>
      </Box>
    </View>
  );
};

const FormInput = ({ label, placeholder, errorMessage, onChangeText, secureTextEntry, disabled }: { label: string; placeholder: string; errorMessage: string; onChangeText: (value: string) => void; secureTextEntry?: boolean; disabled: boolean; }) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    disabled={disabled}
  />
);

const NavigationButton = ({ title, onPress, loading }: { title: string; onPress: () => void; loading: boolean }) => (
  <Center>
    <Button
      title={title}
      onPress={onPress}
      loading={loading}
      buttonStyle={{ marginVertical: 10, backgroundColor: 'red' }}
    />
  </Center>
);

const CustomAlertDialog = ({ alert, message, onClose, cancelRef }: { alert: boolean; message: string; onClose: () => void; cancelRef: React.RefObject<any>; }) => (
  <AlertDialog leastDestructiveRef={cancelRef} isOpen={alert} onClose={onClose}>
    <AlertDialog.Content>
      <AlertDialog.CloseButton />
      <AlertDialog.Body>{message}</AlertDialog.Body>
    </AlertDialog.Content>
  </AlertDialog>
);

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(20).required(),
  lastName: Joi.string().min(1).max(20).required(),
  email: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/).required(),
  password: Joi.string().min(8).max(12).required(),
  birthdate: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().custom((value, helpers) => {
    const [day, month, year] = value.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const now = new Date();
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
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
    padding: 10,
  },
  containerBox: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    margin: 30,
  },
});

export default Register;
