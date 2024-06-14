import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../types/navigationRoutes.type';
import { settingsStyles } from '../../styles/settings.styles';

const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleUpdatePassword = () => {
    navigation.navigate('UpdatePassword');
  };

  return (
    <StyledContainer>
      <NavigationButton title="Editar Perfil" onPress={handleUpdateProfile} />
      <NavigationButton title="Cambiar Contraseña" onPress={handleUpdatePassword} />
    </StyledContainer>
  );
};

const NavigationButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <Button title={title} onPress={onPress} buttonStyle={settingsStyles.button} />
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={settingsStyles.container}>{children}</View>
);

export default SettingsScreen;
