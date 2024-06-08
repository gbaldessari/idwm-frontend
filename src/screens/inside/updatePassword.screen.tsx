import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ChangePasswordService from '../../services/changePassword.service';
import tokenUseStore from '../../useStores/token.useStore';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';
import { updatePasswordSchema } from '../../schemas/updatePassword.schema';
import { updatePasswordStyles } from '../../styles/updatePassword.styles';
import Toast from 'react-native-toast-message';

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

interface Errors {
  [key: string]: string | undefined;
}

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

  const handleChange = (name: string, value: string) => {
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validate = () => {
    const result = updatePasswordSchema.validate(passwordData, { abortEarly: false });
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
      Toast.show({
        type: 'success',
        text1: 'Contraseña cambiada con exito'
      });
      navigation.navigate('Settings');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error al cambiar la contraseña'
      });
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
        <Button
          title="Aplicar Cambios"
          onPress={onApplyChanges}
          loading={loading}
          buttonStyle={updatePasswordStyles.button}
        />
      </VStack>
    </StyledBox>
  );
};

const CustomInput = ({ placeholder, value, onChangeText, errorMessage, secureTextEntry }: { placeholder: string; value: string; onChangeText: (value: string) => void; errorMessage?: string; secureTextEntry?: boolean }) => (
  <View style={{ width: '80%', alignItems: 'center' }}>
    <TextInput
      style={updatePasswordStyles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
    {errorMessage ? <Text style={updatePasswordStyles.error}>{errorMessage}</Text> : null}
  </View>
);

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={updatePasswordStyles.container}>
    <Box>
      {children}
    </Box>
  </View>
);

export default UpdatePasswordScreen;
