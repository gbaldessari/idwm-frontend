import React, { useState, useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Text, Center } from 'native-base';
import Toast from 'react-native-toast-message';
import selectedRegisterUseStore from '../../../useStores/selectedRegister.useStore';
import { editRegisterStyles } from '../../../styles/editRegister.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { updateEndRegisterService, updateStartRegisterService } from '../../../services/registers/registers.service';
import tokenUseStore from '../../../useStores/token.useStore';

interface Errors {
  [key: string]: string | undefined;
}

const EditRegisterScreen = () => {
  const { selectedRegister, clearSelectedRegister } = selectedRegisterUseStore();
  const [timeEntry, setTimeEntry] = useState(selectedRegister?.timeEntry || '');
  const [timeExit, setTimeExit] = useState(selectedRegister?.timeExit || '');
  const [errors, setErrors] = useState<Errors>({});
  const { storedToken } = tokenUseStore();
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  useEffect(() => {
    setTimeEntry(selectedRegister?.timeEntry || '');
    setTimeExit(selectedRegister?.timeExit || '');
  }, [selectedRegister]);

  const handleChange = (name: string, value: string) => {
    if (name === 'timeEntry') setTimeEntry(value);
    if (name === 'timeExit') setTimeExit(value);
  };

  const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const validate = () => {
    const errorMessages: Errors = {};
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;

    if (!timeRegex.test(timeEntry)) {
      errorMessages.timeEntry = 'La hora de entrada debe tener el formato HH:MM:SS.';
    }
    if (!timeRegex.test(timeExit)) {
      errorMessages.timeExit = 'La hora de salida debe tener el formato HH:MM:SS.';
    }
    if (!errorMessages.timeEntry && !errorMessages.timeExit) {
      if (timeToSeconds(timeEntry) >= timeToSeconds(timeExit)) {
        errorMessages.timeExit = 'La hora de salida debe ser mayor que la hora de entrada.';
      }
    }
    return Object.keys(errorMessages).length ? errorMessages : null;
  };

  const handleSave = async () => {
    const errors = validate();
    setErrors(errors || {});
    if (errors) return;

    let response;
    try {
      if (selectedRegister) {
        if (timeEntry !== selectedRegister.timeEntry) {
          response = await updateStartRegisterService({ token: storedToken, id: selectedRegister.id, date: timeEntry });
          console.log('updateStartRegisterService response:', response);
          if (!response.success) throw new Error('Error updating start register');
        }
        if (timeExit !== selectedRegister.timeExit) {
          response = await updateEndRegisterService({ token: storedToken, id: selectedRegister.id, date: timeExit });
          console.log('updateEndRegisterService response:', response);
          if (!response.success) throw new Error('Error updating end register');
        }
        Toast.show({
          type: 'success',
          text1: 'Registro actualizado'
        });
        clearSelectedRegister();
        navigation.navigate("WorkersRegisters");
      }
    } catch (error) {
      console.log('Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar el registro'
      });
    }
  };

  return (
    <View style={editRegisterStyles.container}>
      <Text style={editRegisterStyles.label}>Hora de Entrada</Text>
      <CustomInput
        placeholder="HH:MM:SS"
        value={timeEntry}
        onChangeText={(value: string) => handleChange('timeEntry', value)}
        errorMessage={errors.timeEntry}
      />
      <Text style={editRegisterStyles.label}>Hora de Salida</Text>
      <CustomInput
        placeholder="HH:MM:SS"
        value={timeExit}
        onChangeText={(value: string) => handleChange('timeExit', value)}
        errorMessage={errors.timeExit}
      />
      <Center>
        <Button
          title="Guardar"
          onPress={handleSave}
          buttonStyle={editRegisterStyles.button}
        />
      </Center>
    </View>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage }: { placeholder: string; value: string; onChangeText: (value: string) => void; errorMessage?: string }) => (
  <>
    <TextInput
      style={editRegisterStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      maxLength={8}
    />
    {errorMessage ? <Text style={editRegisterStyles.error}>{errorMessage}</Text> : null}
  </>
);

export default EditRegisterScreen;
