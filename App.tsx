import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeBaseProvider } from 'native-base';
import { ThemeProvider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './src/screens/home';
import Settings from './src/screens/settings';
import Main from './src/screens/main';
import Register from './src/screens/register';
import Login from './src/screens/login';
import Forgotten from './src/screens/forgottenPassword';
import Recover from './src/screens/recoverPassword';
import EditProfile from './src/screens/editProfile'

export type RootStackParamList = {
  PreEntry: undefined;
  Inside: undefined;
  Main: undefined;
  Home: undefined;
  Register: undefined;
  Login: undefined;
  Forgotten: undefined;
  Recover: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

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
  { name: 'EditProfile', component: EditProfile, headerShown: false }
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

const CustomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = '';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={Home} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="PreEntry" component={CustomStackNavigator} />
              <Stack.Screen name="Inside" component={CustomTabNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
