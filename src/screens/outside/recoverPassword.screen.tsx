import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';
import ChangeForgottenPasswordService from '../../services/changeForgottenPassword.service';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';

const passwordSchema = Joi.string().min(8).max(12).required().messages({
  'string.min': 'La contraseña debe tener al menos 8 caracteres',
  'string.max': 'La contraseña no debe tener más de 12 caracteres',
  'any.required': 'La contraseña es obligatoria',
});

const RecoverPasswordScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  useEffect(() => {
    const { error } = passwordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
    } else {
      setErrorMessage('');
    }
  }, [newPassword]);

  const onApplyChanges = async () => {
    const { error } = passwordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }
    setLoading(true);
    setIsDisabled(true);
    const response = await ChangeForgottenPasswordService({ token, newPassword });
    setLoading(false);
    setIsDisabled(false);
    if (response?.success) {
      navigation.navigate('Main');
    }
  };

  return (
    <StyledBox>
      <Text style={styles.title}>¡Revisa tu Correo!</Text>
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
          disabled={isDisabled}
          style={styles.applyButton}
        />
        <ActionButton
          title="Volver"
          onPress={() => navigation.navigate('Forgotten')}
          disabled={isDisabled}
          style={styles.backButton}
        />
      </VStack>
    </StyledBox>
  );
};

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Box>{children}</Box>
  </View>
);

const FormInput = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  errorMessage,
}: {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string;
}) => (
  <>
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </>
);

const ActionButton = ({
  title,
  onPress,
  loading,
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style: object;
}) => (
  <Button title={title} onPress={onPress} loading={loading} buttonStyle={style} disabled={disabled} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    lineHeight: 35,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  applyButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  backButton: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RecoverPasswordScreen;
