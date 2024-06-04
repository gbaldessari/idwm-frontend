import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';
import ChangePasswordService from '../../services/changePassword.service';
import tokenUseStore from '../../stores/tokenUseStore';
import { RootStackParamList } from '../../navigators/navigationTypes';

const passwordSchema = Joi.string().min(8).max(12).required().messages({
  'string.min': 'La contraseña debe tener al menos 8 caracteres',
  'string.max': 'La contraseña no debe tener más de 12 caracteres',
  'any.required': 'La contraseña es obligatoria',
});

const UpdatePassword = () => {
  const { storedToken } = tokenUseStore();
  const token = storedToken || '';
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');
  const [oldPasswordError, setOldPasswordError] = useState<string>('');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const { error } = passwordSchema.validate(newPassword);
    if (error) {
      setNewPasswordError(error.details[0].message);
    } else {
      setNewPasswordError('');
    }
  }, [newPassword]);

  const validateOldPassword = (password: string) => {
    if (!password) {
      setOldPasswordError('La contraseña actual es obligatoria');
      return false;
    }
    setOldPasswordError('');
    return true;
  };

  const onApplyChanges = async () => {
    const isOldPasswordValid = validateOldPassword(oldPassword);
    const { error } = passwordSchema.validate(newPassword);

    if (error) {
      setNewPasswordError(error.details[0].message);
    } else {
      setNewPasswordError('');
    }

    if (!isOldPasswordValid || error) {
      return;
    }

    setLoading(true);
    const response = await ChangePasswordService({ token, oldPassword, newPassword });
    setLoading(false);

    if (response?.success) {
      navigation.navigate('Settings');
    } else {
      setErrorMessage(response?.error || 'Error al cambiar la contraseña');
    }
  };

  return (
    <StyledBox>
      <VStack space={4} alignItems='center'>
        <PasswordInput
          placeholder="Contraseña Actual"
          value={oldPassword}
          onChangeText={setOldPassword}
          errorMessage={oldPasswordError}
        />
        
        <PasswordInput
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChangeText={setNewPassword}
          errorMessage={newPasswordError}
        />
        
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        
        <Button
          title="Aplicar Cambios"
          onPress={onApplyChanges}
          loading={loading}
          buttonStyle={styles.button}
        />
      </VStack>
    </StyledBox>
  );
};

const PasswordInput = ({ placeholder, value, onChangeText, errorMessage }: any) => (
  <>
    <TextInput
      placeholder={placeholder}
      secureTextEntry
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
    />
    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </>
);

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Box>
      {children}
    </Box>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UpdatePassword;
