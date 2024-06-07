import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/outside/register.screen';
import LoginScreen from '../screens/outside/login.screen';
import ForgottenScreen from '../screens/outside/forgottenPassword.screen';
import RecoverScreen from '../screens/outside/recoverPassword.screen';
import MainScreen from '../screens/outside/main.screen'
import { NavigationRoutes } from './types/navigationRoutes.type';

const Stack = createNativeStackNavigator<NavigationRoutes>();

type ScreenConfig = {
  name: keyof NavigationRoutes;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const stackScreens: ScreenConfig[] = [
  { name: 'Main', component: MainScreen, headerShown: false },
  { name: 'Login', component: LoginScreen, headerShown: true, title: 'Ingreso' },
  { name: 'Register', component: RegisterScreen, headerShown: true, title: 'Registro' },
  { name: 'Forgotten', component: ForgottenScreen, headerShown: true, title: 'Contraseña Olvidada' },
  { name: 'Recover', component: RecoverScreen, headerShown: false, title: 'Recuperar Contraseña' },
];

const OutsideStackNavigator = () => (
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

export default OutsideStackNavigator;
