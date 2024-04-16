import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Box, Text } from 'native-base';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const Main = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Login');
    }, 1000);
  };

  const onRegister = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Register');
    }, 1000);
  };

  const LoginButton = ({ title, loading }: { title: string, loading: boolean }) => (
    <Button title={title} onPress={onLogin} loading={loading} buttonStyle={{ marginVertical: 10, backgroundColor: 'red' }} />
  );

  const RegisterButton = ({ title, loading }: { title: string, loading: boolean }) => (
    <Button title={title} onPress={onRegister} loading={loading} buttonStyle={{ marginVertical: 10, backgroundColor: 'red' }} />
  );
  return (
    <View style={styles.container}>
      <StyledBox>
        <Text style={styles.title}>MarcApp</Text>
      </StyledBox>
      <LoginButton title="Ingresar" loading={loading} />
      <RegisterButton title="Registrarse" loading={loading} />
    </View>
  );
};

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
