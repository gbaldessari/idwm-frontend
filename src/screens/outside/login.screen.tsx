import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Center, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import mailUseStore from '../../useStores/mail.useStore';
import tokenUseStore from '../../useStores/token.useStore';
import isAdminUseStore from '../../useStores/isAdmin.useStore'
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { loginStyles } from '../../styles/login.styles';
import { loginSchema } from '../../schemas/login.schema';
import Toast from 'react-native-toast-message';
import { loginService } from '../../services/auth/auth.service';

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const LoginScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();
  const { setMail: setMailStore } = mailUseStore();
  const { setToken: setTokenStore } = tokenUseStore();
  const { setIsAdmin: setIsAdminStore } = isAdminUseStore();
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

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

  const handleForgottenPassword = () => {
    setMailStore(formData.email);
    navigation.navigate('ForgottenPassword')
  }

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
    setIsDisabledText(true);
    setLoading(true);
    const response = await loginService(formData);
    setIsDisabledText(false);
    setLoading(false);

    if (response?.success) {
      const token = response.data?.token;
      const isAdmin = response.data?.isAdmin;
      setIsAdminStore(isAdmin || 3);
      setTokenStore(token || "");
      setFormData({ email: '', password: '' });
      Toast.show({
        type: 'success',
        text1: 'Ingreso exitoso',
      });
      navigation.navigate('Inside');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al ingresar',
      });
    }
  };

  return (
    <View style={loginStyles.container}>
      <CustomInput
        placeholder="Correo Electrónico"
        value={formData.email}
        onChangeText={(value: string) => handleChange('email', value)}
        errorMessage={errors.email}
        disabled={isDisabledText}
      />
      <CustomInput
        placeholder="Contraseña"
        value={formData.password}
        onChangeText={(value: string) => handleChange('password', value)}
        errorMessage={errors.password}
        secureTextEntry
        disabled={isDisabledText}
      />
      <Center>
        <Button
          title="Ingresar"
          onPress={handleSubmit}
          loading={loading}
          buttonStyle={loginStyles.button}
        />
        <Button
          title="¿Olvidó su contraseña?"
          onPress={handleForgottenPassword}
          type="clear"
          titleStyle={loginStyles.forgottenButtonTitle}
          loading={loading}
        />
      </Center>
    </View>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry, disabled }: { placeholder: string; value: string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?: boolean; disabled?: boolean }) => (
  <>
    <Input
      style={loginStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      disabled={disabled}
    />
    {errorMessage ? <Text style={loginStyles.error}>{errorMessage}</Text> : null}
  </>
);

export default LoginScreen;
