import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { adminMenuStyles } from '../../../styles/adminMenu.styles';

const AdminMenuScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();

  const handleSeeRegisters = () => {
    navigation.navigate('WorkersRegisters');
  };

  const handleSeeGraphics = () => {
    navigation.navigate('GraphicsMenu');
  };

  return (
    <StyledContainer>
      <NavigationButton title="Ver Registros" onPress={handleSeeRegisters} />
      <NavigationButton title="Ver Graficos" onPress={handleSeeGraphics} />
    </StyledContainer>
  );
};

const NavigationButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <Button title={title} onPress={onPress} buttonStyle={adminMenuStyles.button} />
);

const StyledContainer = ({ children }: { children: React.ReactNode }) => (
  <View style={adminMenuStyles.container}>{children}</View>
);

export default AdminMenuScreen;
