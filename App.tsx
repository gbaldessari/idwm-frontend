import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { ThemeProvider } from 'react-native-elements';
import OutsideStackNavigator from './src/navigators/outsideStack.navigator';
import InsideTabNavigator from './src/navigators/insideTab.navigator';
import { NavigationRoutes } from './src/navigators/types/navigationRoutes.type';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator<NavigationRoutes>();

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Outside" component={OutsideStackNavigator} />
              <Stack.Screen name="Inside" component={InsideTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast/>
        </NativeBaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
