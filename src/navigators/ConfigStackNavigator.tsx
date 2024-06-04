import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Settings from '../screens/inside/settings';
import UpdateProfile from '../screens/inside/updateProfile';
import UpdatePassword from '../screens/inside/updatePassword';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenConfig = {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const configScreens: ScreenConfig[] = [
  { name: 'Settings', component: Settings, headerShown: false },
  { name: 'UpdateProfile', component: UpdateProfile, headerShown: true, title: 'Editar perfil' },
  { name: 'UpdatePassword', component: UpdatePassword, headerShown: true, title: 'Cambiar contraseña' }
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
