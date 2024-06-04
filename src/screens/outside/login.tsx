import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Center, Text, AlertDialog } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';
import loginService from '../../services/login.service';
import mailUseStore from '../../stores/mailUseStore';
import tokenUseStore from '../../stores/tokenUseStore';
import { RootStackParamList } from '../../navigators/navigationTypes';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.empty': 'El correo electrónico es requerido.',
    'string.email': 'El correo electrónico debe ser válido.'
  }),
  password: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La contraseña es requerida.',
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'string.max': 'La contraseña no puede exceder los 12 caracteres.'
  }),
});

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setMail: setMailStore } = mailUseStore();
  const { setToken: setTokenStore } = tokenUseStore();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingForgotten, setLoadingForgotten] = useState(false);
  const [alert, setAlert] = useState(false);
  const cancelRef = React.useRef(null);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errorMessages: Errors = error.details.reduce((acc: Errors, item) => {
        acc[item.path[0] as string] = item.message;
        return acc;
      }, {});
      setErrors(errorMessages);
    } else {
      setErrors({});
    }
  }, [formData]);

  const handleSubmit = async () => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (error) {
      const errorMessages: Errors = error.details.reduce((acc: Errors, item) => {
        acc[item.path[0] as string] = item.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    setLoadingLogin(true);
    const response = await loginService(formData);
    setLoadingLogin(false);

    if (response?.success) {
      const access_token = response?.data?.token;
      setMailStore(formData.email);
      setTokenStore(access_token || "");
      setFormData({ email: '', password: '' });
      navigation.navigate('Inside');
    } else {
      setAlert(true);
    }
  };

  return (
    <View style={styles.container}>
      <CustomInput
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(value: string) => handleChange('email', value)}
        errorMessage={errors.email}
      />
      <CustomInput
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(value: string) => handleChange('password', value)}
        errorMessage={errors.password}
        secureTextEntry
      />
      <Center>
        <Button
          title="Ingresar"
          onPress={handleSubmit}
          loading={loadingLogin}
          buttonStyle={styles.button}
        />
        <Button
          title="¿Olvidó su contraseña?"
          onPress={() => navigation.navigate('Forgotten')}
          type="clear"
          titleStyle={styles.forgottenButtonTitle}
        />
      </Center>
      <CustomAlertDialog
        alert={alert}
        message="Inicio de sesión fallido"
        onClose={() => setAlert(false)}
        cancelRef={cancelRef}
      />
    </View>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry }: { placeholder: string; value: string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?: boolean }) => (
  <>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </>
);

const CustomAlertDialog = ({ alert, message, onClose, cancelRef }: { alert: boolean; message: string; onClose: () => void; cancelRef: React.RefObject<any> }) => (
  <AlertDialog leastDestructiveRef={cancelRef} isOpen={alert} onClose={onClose}>
    <AlertDialog.Content>
      <AlertDialog.CloseButton />
      <AlertDialog.Body>{message}</AlertDialog.Body>
    </AlertDialog.Content>
  </AlertDialog>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  forgottenButtonTitle: {
    color: 'black',
  },
});

export default Login;
