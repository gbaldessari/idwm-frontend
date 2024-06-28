import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ConfigStackNavigator from './configStack.navigator';
import { NavigationRoutes } from '../types/navigationRoutes.type';
import HomeStackNavigator from './homeStack.navigator';
import AdminStackNavigator from './adminStack.navigator';
import isAdminUseStore from '../useStores/isAdmin.useStore';

const Tab = createBottomTabNavigator<NavigationRoutes>();


const InsideTabNavigator = () => {
  const { storedIsAdmin } = isAdminUseStore();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Configuraciones') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Administrador') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Inicio" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Configuraciones" component={ConfigStackNavigator} options={{ headerShown: false }} />
      {storedIsAdmin !== 3 && (
        <Tab.Screen name="Administrador" component={AdminStackNavigator} options={{ headerShown: false }} />
      )}
    </Tab.Navigator>);
}

export default InsideTabNavigator;
