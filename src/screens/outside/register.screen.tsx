import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import registerService from '../../services/register.services';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';
import { registerSchema } from '../../schemas/register.schema';
import { registerStyles } from '../../styles/register.styles';
import Toast from 'react-native-toast-message';

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
      Toast.show({
        type: 'success',
        text1: 'Usuario registrado con exito',
      });
      navigation.navigate('Main');
    }
    else{
      Toast.show({
        type: 'error',
        text1: 'Error al registrar al usuario',
      });
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
    <View style={registerStyles.container}>
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
          buttonStyle={registerStyles.button}
        />
      </Center>
    </View>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry }:{ placeholder: string; value:string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?:boolean}) => (
  <>
    <TextInput
      style={registerStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      maxLength={placeholder === "Fecha de Nacimiento (DD/MM/AAAA)" ? 10 : undefined}
      keyboardType={placeholder === "Fecha de Nacimiento (DD/MM/AAAA)" ? 'numeric' : 'default'}
    />
    {errorMessage ? <Text style={registerStyles.error}>{errorMessage}</Text> : null}
  </>
);

export default RegisterScreen;
