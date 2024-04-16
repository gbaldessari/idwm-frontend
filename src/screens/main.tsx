import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Text } from 'native-base';


const Main = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const navigate = (route: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate(route);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <StyledBox>
        <Text style={styles.title}>MarcApp</Text>
      </StyledBox>
      <NavigationButton title="Ingresar" navigateTo={() => navigate('Login')} loading={loading} />
      <NavigationButton title="Registrarse" navigateTo={() => navigate('Register')} loading={loading} />
    </View>
  );
};

const NavigationButton = ({ title, navigateTo, loading }: { title: string, navigateTo: () => void, loading: boolean }) => (
  <Button title={title} onPress={navigateTo} loading={loading} buttonStyle={{ marginVertical: 10, backgroundColor: 'red' }} />
);


const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style = {styles.container}>
    <Box>
      {children}
    </Box>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 30
  },
  title: {
    fontSize: 60,
    textAlign: 'center',
    lineHeight: 60,
    fontFamily: 'serif'
  }
});

export default Main;
