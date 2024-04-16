import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { ThemeProvider } from 'react-native-elements';
import Home from './src/screens/home';
import Main from './src/screens/main';
import Register from './src/screens/register';
import Login from './src/screens/login';
import Loading from './src/screens/loading';

export type RootStackParamList = {
  Main: undefined;
  Loading: undefined;
  Home: undefined;
  Register: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Screen = (name: keyof RootStackParamList, component: React.ComponentType, header: boolean, title?: string) => (
  <Stack.Screen name={name} component={component} options={{ headerShown: header, headerTitle: title}} />
);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              {Screen("Main", Main, false)}
              {Screen("Home", Home, false)}
              {Screen("Loading", Loading, false)}
              {Screen("Login", Login, true, 'Ingreso')}
              {Screen("Register", Register, true, 'Registro')}
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
