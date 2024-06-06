import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ConfigStackNavigator from './ConfigStackNavigator';
import { RootStackParamList } from './navigationTypes';
import HomeStackNavigator from './HomeStackNavigator';

const Tab = createBottomTabNavigator<RootStackParamList>();

const CustomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';

        if (route.name === 'Inicio') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Configuraciones') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Inicio" component={HomeStackNavigator} options={{headerShown: false}}/>
    <Tab.Screen name="Configuraciones" component={ConfigStackNavigator} options={{headerShown: false}}/>
  </Tab.Navigator>
);

export default CustomTabNavigator;
