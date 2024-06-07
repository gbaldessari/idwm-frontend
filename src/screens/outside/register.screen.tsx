import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Center, Text, AlertDialog } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';
import registerService from '../../services/register.services';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';

interface FormData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const RegisterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    lastName: '',
    email: '',
    password: '',
    birthdate: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const cancelRef = React.useRef(null);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleBirthdateChange = (value: string) => {
    if (value.length === 2 || value.length === 5) {
      value += '/';
    }
    setFormData({ ...formData, birthdate: value });
  };

  const validate = () => {
    const result = registerSchema.validate(formData, { abortEarly: false });
    if (!result.error) return null;

    const errorMessages: Errors = result.error.details.reduce((acc: Errors, item) => {
      acc[item.path[0] as string] = item.message;
      return acc;
    }, {});
    return errorMessages;
  };

  const handleSubmit = async () => {
    const errors = validate();
    setErrors(errors || {});
    if (errors) return;
    setLoading(true);

    const response = await registerService(convertFormDataToRecord(formData));
    setLoading(false);

    if (response?.success) {
      navigation.navigate('Main');
    }
  };

  const convertFormDataToRecord = (formData: FormData): Record<string, string> => {
    return {
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      birthdate: formData.birthdate,
    };
  };

  return (
    <View style={styles.container}>
      <CustomInput
        placeholder="Nombre"
        value={formData.name}
        onChangeText={(value: string) => handleChange('name', value)}
        errorMessage={errors.name}
      />
      <CustomInput
        placeholder="Apellido"
        value={formData.lastName}
        onChangeText={(value: string) => handleChange('lastName', value)}
        errorMessage={errors.lastName}
      />
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
      <CustomInput
        placeholder="Fecha de Nacimiento (DD/MM/AAAA)"
        value={formData.birthdate}
        onChangeText={handleBirthdateChange}
        errorMessage={errors.birthdate}
      />
      <Center>
        <Button
          title="Registrar"
          onPress={handleSubmit}
          loading={loading}
          buttonStyle={styles.button}
        />
      </Center>
    </View>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry }:{ placeholder: string; value:string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?:boolean}) => (
  <>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      maxLength={placeholder === "Fecha de Nacimiento (DD/MM/AAAA)" ? 10 : undefined}
      keyboardType={placeholder === "Fecha de Nacimiento (DD/MM/AAAA)" ? 'numeric' : 'default'}
    />
    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </>
);

const CustomAlertDialog = ({ alert, message, onClose, cancelRef }:{ alert: boolean; message: string; onClose:()=> void; cancelRef: React.RefObject<any> }) => (
  <AlertDialog leastDestructiveRef={cancelRef} isOpen={alert} onClose={onClose}>
    <AlertDialog.Content>
      <AlertDialog.CloseButton />
      <AlertDialog.Body>{message}</AlertDialog.Body>
    </AlertDialog.Content>
  </AlertDialog>
);

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(20).required().messages({
    'string.empty': 'El nombre es requerido.',
    'string.min': 'El nombre debe tener al menos 1 caracter.',
    'string.max': 'El nombre no puede exceder los 20 caracteres.'
  }),
  lastName: Joi.string().min(1).max(20).required().messages({
    'string.empty': 'El apellido es requerido.',
    'string.min': 'El apellido debe tener al menos 1 caracter.',
    'string.max': 'El apellido no puede exceder los 20 caracteres.'
  }),
  email: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/).required().messages({
    'string.empty': 'El correo electrónico es requerido.',
    'string.pattern.base': 'El correo electrónico debe ser válido.'
  }),
  password: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La contraseña es requerida.',
    'string.min': 'La contraseña debe tener al menos 8 caracteres.',
    'string.max': 'La contraseña no puede exceder los 12 caracteres.'
  }),
  birthdate: Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/).required().custom((value, helpers) => {
    const [day, month, year] = value.split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const now = new Date();
    if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
      return helpers.error('any.invalid', { custom: 'La fecha de nacimiento no es válida.' });
    }
    if (date > now) {
      return helpers.error('date.future', { custom: 'La fecha de nacimiento no puede ser en el futuro.' });
    }
    if (date.getFullYear() < 1900) {
      return helpers.error('date.past', { custom: 'La fecha de nacimiento no puede ser anterior a 1900.' });
    }
    return value;
  }, 'Fecha de nacimiento').messages({
    'string.pattern.base': 'La fecha de nacimiento debe tener el formato DD/MM/AAAA.',
    'any.required': 'La fecha de nacimiento es requerida.',
    'any.invalid': 'La fecha de nacimiento no es válida.',
    'date.future': 'La fecha de nacimiento no puede ser en el futuro.',
    'date.past': 'La fecha de nacimiento no puede ser anterior a 1900.'
  })
});

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
});

export default RegisterScreen;
