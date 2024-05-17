import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import 'text-encoding-polyfill';
import Joi from 'joi';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/mailUseStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Center } from 'native-base';
import RecoverPasswordService from '../services/recoverPassword.service';

type FormDataT = {
  email: string;
};

const InitData: FormDataT = {
  email: ''
};

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required()
});

const ForgottenPassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { storedMail } = useStore();
  const [data, setData] = useState<FormDataT>(InitData);
  const [loadingRecover, setLoadingRecover] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [validMail, setValidMail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(storedMail || '');
  const [errorMessageMail, setErrorMessageMail] = useState<string>('');

  useEffect(() => {
    const { error } = loginSchema.validate({ email });
    if (error) {
      setErrorMessageMail(error.details[0].message);
      setValidMail(false);
    } else {
      setErrorMessageMail('');
      setValidMail(true);
    }
  }, [email]);

  const onRecover = async () => {
    if (!validMail) return;

    setIsDisabledText(true);
    setLoadingRecover(true);

    const response = await RecoverPasswordService({ email });
    if (response?.success) {
      setData(InitData);
      navigation.navigate('Recover');
    }

    setIsDisabledText(false);
    setLoadingRecover(false);
  };

  const RecoverButton = () => (
    <Center>
      <Button
        title='Recuperar Contraseña'
        onPress={onRecover}
        loading={loadingRecover}
        buttonStyle={styles.recoverButton}
      />
    </Center>
  );

  return (
    <View style={styles.container}>
      <FormInput
        label='Email'
        placeholder='user@example.com'
        errorMessage={errorMessageMail}
        onChangeText={setEmail}
        disabled={isDisabledText}
        defaultValue={email}
      />
      <RecoverButton />
    </View>
  );
};

const FormInput = ({ label, placeholder, errorMessage, onChangeText, secureTextEntry, disabled, defaultValue }: { label: string, placeholder: string, errorMessage: string, onChangeText: (value: string) => void, secureTextEntry?: boolean, disabled: boolean, defaultValue: string }) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    disabled={disabled}
    defaultValue={defaultValue}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20
  },
  recoverButton: {
    marginVertical: 10,
    backgroundColor: 'red'
  }
});

export default ForgottenPassword;
