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

  const MainButton = () => (
    <Center>
      <Button
      title = {'Volver al Inicio'}
      onPress = {onMain}
      loading = {loading}
      buttonStyle={{ 
        marginVertical: 10,
        backgroundColor: 'red'
        }}
      />
    </Center>
  );

  const onMain = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Main');
    }, 1000);
  };
  
  return (
    <StyledBox>
      <Text style={styles.title}>¡Revisa tu Correo!</Text>
      <MainButton/>
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
    lineHeight: 35
  },
  userText: {
    fontSize: 20,
    textAlign: 'center'
  }
});
export default RecoverPassword
