import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { Text } from 'native-base';
import Toast from 'react-native-toast-message';
import selectedRegisterUseStore from '../../useStores/selectedRegister.useStore';
import { editRegisterStyles } from '../../styles/editRegister.styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { updateStartRegisterService, updateEndRegisterService } from '../../services/schedule.service';

const EditRegisterScreen = () => {
  const { selectedRegister, clearSelectedRegister } = selectedRegisterUseStore();
  const [timeEntry, setTimeEntry] = useState(selectedRegister?.timeEntry || '');
  const [timeExit, setTimeExit] = useState(selectedRegister?.timeExit || '');
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handleSave = async () => {
    let response;
    try {
      if (selectedRegister) {
        if (timeEntry !== selectedRegister.timeEntry) {
          response = await updateStartRegisterService({ id: selectedRegister.id, startDate: timeEntry });
          if (!response.success) throw new Error('Error updating start register');
        }
        if (timeExit !== selectedRegister.timeExit) {
          response = await updateEndRegisterService({ id: selectedRegister.id, endDate: timeExit });
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
      console.log(error);
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
      <Button title='Guardar' onPress={handleSave} />
    </View>
  );
};

export default EditRegisterScreen;
