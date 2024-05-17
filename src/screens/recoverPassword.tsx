import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { Box, Center, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

const RecoverPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onMain = () => {
    setLoading(true);
    setLoading(false);
    navigation.navigate('Main');
  };

  return (
    <StyledBox>
      <Text style={styles.title}>¡Revisa tu Correo!</Text>
      <MainButton onPress={onMain} loading={loading} />
    </StyledBox>
  );
};

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.container}>
    <Box>
      {children}
    </Box>
  </View>
);

const MainButton = ({ onPress, loading }: { onPress: () => void; loading: boolean }) => (
  <Center>
    <Button
      title="Volver al Inicio"
      onPress={onPress}
      loading={loading}
      buttonStyle={styles.button}
    />
  </Center>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  title: {
    fontSize: 35,
    textAlign: 'center',
    lineHeight: 35,
  },
  button: {
    marginVertical: 10,
    backgroundColor: 'red',
  },
});

export default RecoverPassword;
