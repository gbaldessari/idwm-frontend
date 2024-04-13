import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box } from 'native-base';

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
      <Box style={styles.titleBox}>MarcApp</Box>
      <NavigationButton title="Login" navigateTo={() => navigate('Login')} loading={loading} />
      <NavigationButton title="Register" navigateTo={() => navigate('Register')} loading={loading} />
    </View>
  );
};

const NavigationButton = ({ title, navigateTo, loading }: { title: string, navigateTo: () => void, loading: boolean }) => (
  <Button title={title} onPress={navigateTo} loading={loading} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 30,
  },
  titleBox: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    fontSize: 100,
    fontWeight: 'bold',
  },
});

export default Main;
