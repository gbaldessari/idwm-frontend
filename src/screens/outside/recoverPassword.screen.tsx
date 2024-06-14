import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ChangeForgottenPasswordService from '../../services/changeForgottenPassword.service';
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { recoverPasswordSchema } from '../../schemas/recoverPassword.schema';
import { recoverPasswordStyles } from '../../styles/recoverPassword.styles';
import Toast from 'react-native-toast-message';

const RecoverPasswordScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  useEffect(() => {
    const { error } = recoverPasswordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
    } else {
      setErrorMessage('');
    }
  }, [newPassword]);

  const onApplyChanges = async () => {
    const { error } = recoverPasswordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }

    setLoading(true);
    const response = await ChangeForgottenPasswordService({ token, newPassword });
    setLoading(false);

    if (response?.success) {
      Toast.show({
        type: 'success',
        text1: 'Contraseña actualizada con exito',
      });
      navigation.navigate('Main');
    } else{
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar contraseña',
      });
    }
    
  };

  return (
    <StyledBox>
      <Text style={recoverPasswordStyles.title}>¡Revisa tu Correo!</Text>
      <VStack space={4} alignItems="center">
        <FormInput
          placeholder="Nueva Contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          errorMessage={errorMessage}
        />
        <FormInput
          placeholder="Código de Autenticación"
          value={token}
          onChangeText={setToken}
        />
        <ActionButton
          title="Aplicar Cambios"
          onPress={onApplyChanges}
          loading={loading}
          style={recoverPasswordStyles.applyButton}
        />
        <ActionButton
          title="Volver"
          onPress={() => navigation.navigate('Forgotten')}
          style={recoverPasswordStyles.backButton}
        />
      </VStack>
    </StyledBox>
  );
};

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={recoverPasswordStyles.container}>
    <Box>{children}</Box>
  </View>
);

const FormInput = ({placeholder, secureTextEntry, value, onChangeText, errorMessage,}: {placeholder: string; secureTextEntry?: boolean; value: string; onChangeText: (text: string) => void; errorMessage?: string;}) => (
  <>
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={recoverPasswordStyles.input}
      value={value}
      onChangeText={onChangeText}
    />
    {errorMessage ? <Text style={recoverPasswordStyles.error}>{errorMessage}</Text> : null}
  </>
);

const ActionButton = ({title, onPress, loading, style}: { title: string; onPress: () => void; loading?: boolean; style: object;}) => (
  <Button
    title={title}
    onPress={onPress}
    loading={loading}
    buttonStyle={style}
  />
);

export default RecoverPasswordScreen;
