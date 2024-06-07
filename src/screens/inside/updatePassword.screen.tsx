import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import 'text-encoding-polyfill';
import Joi from 'joi';
import ChangePasswordService from '../../services/changePassword.service';
import tokenUseStore from '../../useStores/token.useStore';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const passwordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La contraseña actual es obligatoria',
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'string.max': 'La contraseña no debe tener más de 12 caracteres',
  }),
  newPassword: Joi.string().min(8).max(12).required().messages({
    'string.empty': 'La nueva contraseña es obligatoria',
    'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
    'string.max': 'La nueva contraseña no debe tener más de 12 caracteres',
  }),
});

const UpdatePasswordScreen = () => {
  const { storedToken } = tokenUseStore();
  const token = storedToken || '';
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: '',
    newPassword: '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (name: string, value: string) => {
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validate = () => {
    const result = passwordSchema.validate(passwordData, { abortEarly: false });
    if (!result.error) return null;

    const errorMessages: Errors = result.error.details.reduce((acc: Errors, item) => {
      acc[item.path[0] as string] = item.message;
      return acc;
    }, {});
    return errorMessages;
  };

  const onApplyChanges = async () => {
    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    setLoading(true);
    const response = await ChangePasswordService({ token, ...passwordData });
    setLoading(false);

    if (response?.success) {
      navigation.navigate('Settings');
    } else {
      setErrorMessage(response?.error || 'Error al cambiar la contraseña');
    }
  };

  return (
    <StyledBox>
      <VStack space={4} alignItems="center">
        <CustomInput
          placeholder="Contraseña Actual"
          value={passwordData.oldPassword}
          onChangeText={(value: string) => handleChange('oldPassword', value)}
          errorMessage={errors.oldPassword}
          secureTextEntry
        />
        <CustomInput
          placeholder="Nueva Contraseña"
          value={passwordData.newPassword}
          onChangeText={(value: string) => handleChange('newPassword', value)}
          errorMessage={errors.newPassword}
          secureTextEntry
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

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry }: { placeholder: string; value: string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?: boolean }) => (
  <View style={{ width: '80%', alignItems: 'center' }}>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
  </View>
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
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginVertical: 10,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#6200ee',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default UpdatePasswordScreen;
