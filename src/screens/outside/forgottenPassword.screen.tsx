import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useStore from '../../useStores/mail.useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Center } from 'native-base';
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { forgottenPasswordStyles } from '../../styles/forgottenPassword.styles';
import { forgotenPasswordSchema } from '../../schemas/forgottenPassword.schema';
import Toast from 'react-native-toast-message';
import { recoverPasswordService } from '../../services/auth/auth.service';

const ForgottenPasswordScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();
  const { storedMail } = useStore();
  const [loadingRecover, setLoadingRecover] = useState<boolean>(false);
  const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
  const [validMail, setValidMail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(storedMail || '');
  const [errorMessageMail, setErrorMessageMail] = useState<string>('');

  useEffect(() => {
    const { error } = forgotenPasswordSchema.validate({ email });
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
    const response = await recoverPasswordService({ email });
    setIsDisabledText(false);
    setLoadingRecover(false);

    if (response?.success) {
      navigation.navigate('RecoverPassword');
    } else{
      Toast.show({
        type: 'error',
        text1: 'Error'
      });
    }
  };

  return (
    <StyledContainer>
      <FormInput
        label='Email'
        placeholder='user@example.com'
        errorMessage={errorMessageMail}
        onChangeText={setEmail}
        disabled={isDisabledText}
        defaultValue={email}
      />
      <RecoverButton title='Recuperar Contraseña' onPress={onRecover} loading={loadingRecover} />
    </StyledContainer>
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

const RecoverButton = ({ title, onPress, loading }: { title: string, onPress: () => void, loading: boolean }) => (
  <Center>
    <Button
      title={title}
      onPress={onPress}
      loading={loading}
      buttonStyle={forgottenPasswordStyles.recoverButton}
    />
  </Center>
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={forgottenPasswordStyles.container}>{children}</View>
);

export default ForgottenPasswordScreen;
