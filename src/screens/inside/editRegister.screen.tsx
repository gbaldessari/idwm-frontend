import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { Text } from 'native-base';
import Toast from 'react-native-toast-message';
import selectedRegisterUseStore from '../../useStores/selectedRegister.useStore';
import { editRegisterStyles } from '../../styles/editRegister.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../types/navigationRoutes.type';

const EditRegisterScreen = () => {
  const { selectedRegister, clearSelectedRegister } = selectedRegisterUseStore();
  const [timeEntry, setTimeEntry] = useState(selectedRegister?.timeEntry || '');
  const [timeExit, setTimeExit] = useState(selectedRegister?.timeExit || '');
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handleSave = async () => {
    const payload = {
      timeEntry,
      timeExit,
      // Add other necessary fields here
    };

    // Call your service to save the updated register
    let response;
    if (selectedRegister) {
      // Update existing register
      response = true;
    } else {
      // Create new register
      response = false;
    }

    if (response) {
      Toast.show({
        type: 'success',
        text1: 'Registro actualizado'
      });
      clearSelectedRegister();
      navigation.navigate("WorkersRegisters");
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar el registro'
      });
    }
  };

  return (
    <View style={editRegisterStyles.container}>
      <Text style={editRegisterStyles.label}>Hora de Entrada</Text>
      <TextInput
        style={editRegisterStyles.input}
        value={timeEntry}
        onChangeText={setTimeEntry}
      />
      <Text style={editRegisterStyles.label}>Hora de Salida</Text>
      <TextInput
        style={editRegisterStyles.input}
        value={timeExit}
        onChangeText={setTimeExit}
      />
      <Button title={selectedRegister ? 'Guardar' : 'Crear'} onPress={handleSave} />
    </View>
  );
};

export default EditRegisterScreen;
