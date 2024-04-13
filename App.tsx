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

const Screen = (name: keyof RootStackParamList, component: React.ComponentType) => (
  <Stack.Screen options={{ headerShown: false }} name={name} component={component} />
);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              {Screen("Main", Main)}
              {Screen("Home", Home)}
              {Screen("Loading", Loading)}
              {Screen("Login", Login)}
              {Screen("Register", Register)}
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
