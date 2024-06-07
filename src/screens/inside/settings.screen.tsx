import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../navigators/types/navigationRoutes.type';

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
  <Button title={title} onPress={onPress} buttonStyle={styles.button} />
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#6200ee',
    marginVertical: 10,
  },
});

export default SettingsScreen;
