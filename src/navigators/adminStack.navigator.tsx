import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../types/navigationRoutes.type';
import AdminMenuScreen from '../screens/inside/adminMenu.screen';
import WorkersRegistersScreen from '../screens/inside/workersRegisters.screen';
import EditRegisterScreen from '../screens/inside/editRegister.screen';

const Stack = createNativeStackNavigator<NavigationRoutes>();

type ScreenConfig = {
  name: keyof NavigationRoutes;
  component: React.ComponentType<any>;
  headerShown?: boolean;
  title?: string;
};

const adminScreens: ScreenConfig[] = [
  { name: 'AdminMenu', component: AdminMenuScreen, headerShown: false },
  { name: 'WorkersRegisters', component: WorkersRegistersScreen, headerShown: true, title: 'Ver Registros' },
  { name: 'EditRegister', component: EditRegisterScreen, headerShown: true, title: 'Editar Registro' }
];

const AdminStackNavigator = () => (
  <Stack.Navigator initialRouteName="AdminMenu">
    {adminScreens.map(({ name, component, headerShown, title }) => (
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

export default AdminStackNavigator;
