import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input } from 'react-native-elements';
import 'text-encoding-polyfill';
import Joi from 'joi';
import { useNavigation } from '@react-navigation/native';
import useStore from '../stores/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Center } from 'native-base';

const ForgottenPassword = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {storedMail} = useStore();
  const [loadingRecover, setLoadingRecover] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [validMail, setValidMail] = useState<boolean>(false);
  const [mail, setMail] = useState<string>('');
  const [errorMessageMail, setErrorMessageMail] = useState<string>('');

  useEffect(() => {
    const errors = loginSchema.validate({ mail });
    if (errors?.error?.details[0]?.context?.key === 'mail') {
      setErrorMessageMail(errors.error.details[0].message);
      setValidMail(false);
    } else{
      setErrorMessageMail('');
      setValidMail(true);
    }
    return;
  }, [mail]);

  const onRecover = async () => {
    if(!validMail){
      return;
    }
    setIsDisabledText(true);
    setLoadingRecover(true);
    setTimeout(() => {
      setIsDisabledText(false);
      setLoadingRecover(false);
      navigation.navigate('Recover');
    }, 1000);
  };

  const RecoverButton = () => (
    <Center>
      <Button
        title={'Recuperar Contraseña'}
        onPress={onRecover}
        loading={loadingRecover}
        buttonStyle={{
          marginVertical: 10,
          backgroundColor: 'red'
        }}
      />
    </Center>
  );

  return (
    <View style={styles.container}>
      <FormInput
        label="Mail"
        placeholder="user@example.com"
        errorMessage={errorMessageMail}
        onChangeText={(value: string) => setMail(value)}
        disabled = {isDisabledText}
        defaultValue={storedMail}
      />
      <RecoverButton/>
    </View>
  );
};

const loginSchema = Joi.object({
  mail: Joi.string().min(1).max(256).pattern(/^\S+@\S+\.\S+$/)
});

const FormInput = ({ label, placeholder, errorMessage, onChangeText, secureTextEntry, disabled, defaultValue }: { label: string, placeholder: string, errorMessage: string, onChangeText: (value: string) => void, secureTextEntry?: boolean, disabled: boolean, defaultValue: string}) => (
  <Input
    label={label}
    placeholder={placeholder}
    errorMessage={errorMessage}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    disabled = {disabled}
    defaultValue={defaultValue}
  />
);

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20
  }
});

export default ForgottenPassword
