import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import 'text-encoding-polyfill';
import Joi from 'joi';
import ChangeForgottenPasswordService from '../services/changeForgottenPassword.service';

const passwordSchema = Joi.string().min(8).max(12).required().messages({
  'string.min': 'La contraseña debe tener al menos 8 caracteres',
  'string.max': 'La contraseña no debe tener más de 12 caracteres',
  'any.required': 'La contraseña es obligatoria',
});

const RecoverPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const { error } = passwordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
    } else {
      setErrorMessage('');
    }
  }, [newPassword]);

  const onApplyChanges = async () => {
    // Validate the password
    const { error } = passwordSchema.validate(newPassword);
    if (error) {
      setErrorMessage(error.details[0].message);
      return;
    }
    setLoading(true);
    setIsDisabled(true);
    // Handle the logic for applying the changes
    console.log({token,newPassword});
    const response = await ChangeForgottenPasswordService({token,newPassword});
    setLoading(false);
    if (response?.success) {
      // Optionally navigate to another screen or show a success message
      navigation.navigate('Main');
    }
  };

  return (
    <StyledBox>
      <Text style={styles.title}>¡Revisa tu Correo!</Text>
      <VStack space={4} alignItems='center'>
        <TextInput
          placeholder="Nueva Contraseña"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
        <TextInput
          placeholder="Código de Autenticación"
          style={styles.input}
          value={token}
          onChangeText={setToken}
        />
        <Button
          title="Aplicar Cambios"
          onPress={onApplyChanges}
          loading={loading}
          buttonStyle={styles.button}
        />
        <Button
          title="Volver"
          onPress={() => navigation.navigate('Forgotten')}
          buttonStyle={styles.button}
          disabled={isDisabled}
        />
      </VStack>
    </StyledBox>
  );
};

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
  button: {
    marginVertical: 10,
    backgroundColor: 'red',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default RecoverPassword;
