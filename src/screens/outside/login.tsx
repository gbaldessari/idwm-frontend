import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import 'text-encoding-polyfill';
import Joi from 'joi';
import loginService from '../../services/login.service';
import { useNavigation } from '@react-navigation/native';
import mailUseStore from '../../stores/mailUseStore';
import tokenUseStore from '../../stores/tokenUseStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Center } from 'native-base';
import { RootStackParamList } from '../../navigators/navigationTypes';

type FormDataT = {
  email: string;
  password: string;
};

const InitData: FormDataT = {
  email: '',
  password: '',
};

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).max(12).required(),
});

const Login = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setMail: setMailStore } = mailUseStore();
  const { setToken: setTokenStore } = tokenUseStore();

  const [data, setData] = useState<FormDataT>(InitData);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [loadingForgotten, setLoadingForgotten] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [isForgottenPressed, setIsForgottenPressed] = useState<boolean>(false);
  const [isLoginPressed, setIsLoginPressed] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({ email: '', password: '' });
  const { email, password } = data;

  useEffect(() => {
    const validate = () => {
      const { error } = loginSchema.validate(data, { abortEarly: false });
      if (error) {
        const errorDetails = error.details.reduce(
          (acc, { context, message }) => {
            acc[context?.key as keyof FormDataT] = message;
            return acc;
          },
          { email: '', password: '' }
        );
        setErrors(errorDetails);
      } else {
        setErrors({ email: '', password: '' });
      }
    };

    validate();
  }, [data]);

  const handleChange = (field: keyof FormDataT, value: string) => {
    setData((prevData) => ({ ...prevData, [field]: value }));
  };

  const onLogin = async () => {
    if (errors.email || errors.password || isForgottenPressed) return;

    setIsLoginPressed(true);
    setIsDisabledText(true);
    setLoadingLogin(true);

    const response = await loginService({ email, password });
    const access_token = response?.data?.token;

    setIsLoginPressed(false);
    setIsDisabledText(false);
    setLoadingLogin(false);

    if (response?.success) {
      setMailStore(email);
      setTokenStore(access_token || "");
      setData(InitData);
      navigation.navigate('Inside');
    }
  };

  const onForgotten = async () => {
    if (isLoginPressed) return;

    setIsForgottenPressed(true);
    setIsDisabledText(true);
    setLoadingForgotten(true);

    setTimeout(() => {
      setMailStore(email);
      setIsForgottenPressed(false);
      setIsDisabledText(false);
      setLoadingForgotten(false);
      navigation.navigate('Forgotten');
    }, 1000);
  };

  return (
    <StyledContainer>
      <FormInput
        label="Email"
        placeholder="user@example.com"
        errorMessage={errors.email}
        onChangeText={(value: string) => handleChange('email', value)}
        disabled={isDisabledText}
      />
      <FormInput
        label="Contraseña"
        placeholder="********"
        errorMessage={errors.password}
        onChangeText={(value: string) => handleChange('password', value)}
        secureTextEntry
        disabled={isDisabledText}
      />
      <LoginButton onPress={onLogin} loading={loadingLogin} disabled={isForgottenPressed} />
      <ForgottenButton onPress={onForgotten} loading={loadingForgotten} disabled={isLoginPressed} />
    </StyledContainer>
  );
};

const FormInput = ({
  label,
  placeholder,
  errorMessage,
  onChangeText,
  secureTextEntry,
  disabled,
}: {
  label: string;
  placeholder: string;
  errorMessage: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  disabled: boolean;
}) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    disabled={disabled}
  />
);

const LoginButton = ({ onPress, loading, disabled }: { onPress: () => void; loading: boolean; disabled: boolean }) => (
  <Center>
    <Button
      title="Ingresar"
      onPress={onPress}
      loading={loading}
      buttonStyle={styles.loginButton}
      disabled={disabled}
    />
  </Center>
);

const ForgottenButton = ({ onPress, loading, disabled }: { onPress: () => void; loading: boolean; disabled: boolean }) => (
  <Center>
    <Button
      title="¿Olvido su contraseña?"
      onPress={onPress}
      loading={loading}
      type="clear"
      titleStyle={styles.forgottenButtonTitle}
      disabled={disabled}
    />
  </Center>
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  loginButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  forgottenButtonTitle: {
    color: 'black',
  },
});

export default Login;
