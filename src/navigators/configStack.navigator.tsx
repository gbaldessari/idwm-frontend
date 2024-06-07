import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '../screens/inside/settings.screen';
import UpdateProfileScreen from '../screens/inside/updateProfile.screen';
import UpdatePasswordScreen from '../screens/inside/updatePassword.screen';
import { NavigationRoutes } from './types/navigationRoutes.type';

const Stack = createNativeStackNavigator<NavigationRoutes>();

type ScreenConfig = {
  name: keyof NavigationRoutes;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const configScreens: ScreenConfig[] = [
  { name: 'Settings', component: SettingsScreen, headerShown: false },
  { name: 'UpdateProfile', component: UpdateProfileScreen, headerShown: true, title: 'Editar perfil' },
  { name: 'UpdatePassword', component: UpdatePasswordScreen, headerShown: true, title: 'Cambiar contraseña' }
];

const ConfigStackNavigator = () => (
  <Stack.Navigator initialRouteName="Settings">
    {configScreens.map(({ name, component, headerShown, title }) => (
      <Stack.Screen
        key={name}
        name={name}
        component={component}
        options={{
          headerShown,
          title,
        }}
      />
    ))}
  </Stack.Navigator>
);

export default ConfigStackNavigator;
