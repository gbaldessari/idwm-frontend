import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from '../screens/outside/main';
import Register from '../screens/outside/register';
import Login from '../screens/outside/login';
import Forgotten from '../screens/outside/forgottenPassword';
import Recover from '../screens/outside/recoverPassword';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenConfig = {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const stackScreens: ScreenConfig[] = [
  { name: 'Main', component: Main, headerShown: false },
  { name: 'Login', component: Login, headerShown: true, title: 'Ingreso' },
  { name: 'Register', component: Register, headerShown: true, title: 'Registro' },
  { name: 'Forgotten', component: Forgotten, headerShown: true, title: 'Contraseña Olvidada' },
  { name: 'Recover', component: Recover, headerShown: false, title: 'Recuperar Contraseña' },
];

const CustomStackNavigator = () => (
  <Stack.Navigator initialRouteName="Main">
    {stackScreens.map(({ name, component, headerShown, title }) => (
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

export default CustomStackNavigator;
