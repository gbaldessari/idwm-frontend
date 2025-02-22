import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../types/navigationRoutes.type';
import WeekResumeScreen from '../screens/inside/home/weekResume.screen';
import HomeScreen from '../screens/inside/home/home.screen';

const Stack = createNativeStackNavigator<NavigationRoutes>();

type ScreenHome = {
  name: keyof NavigationRoutes;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const homeScreens: ScreenHome[] = [
  { name: 'Home', component: HomeScreen, headerShown: false },
  { name: 'WeekResume', component: WeekResumeScreen, headerShown: true, title: 'Resumen de la Semana' }
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
