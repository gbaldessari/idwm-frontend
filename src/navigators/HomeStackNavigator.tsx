import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './navigationTypes';
import WeekResume from '../screens/inside/weekResume';
import Home from '../screens/inside/home';

const Stack = createNativeStackNavigator<RootStackParamList>();

type ScreenHome = {
  name: keyof RootStackParamList;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const homeScreens: ScreenHome[] = [
  { name: 'Home', component: Home, headerShown: false },
  { name: 'WeekResume', component: WeekResume, headerShown: true, title: 'Resumen de la Semana' }
];

const HomeStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    {homeScreens.map(({ name, component, headerShown, title }) => (
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

export default HomeStackNavigator;
