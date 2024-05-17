import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Text } from 'native-base';
import { Button } from 'react-native-elements';
import mailUseStore from '../stores/mailUseStore';
import tokenUseStore from '../stores/tokenUseStore';
import scheduleService from '../services/schedule.service';

const Home = () => {
  const { storedMail } = mailUseStore();
  const { storedToken } = tokenUseStore();
  const [loading, setLoading] = useState<boolean>(false);

  const handlePress = async () => {
    setLoading(true);

    const token: string = storedToken || "";
    const response = await scheduleService({ token });
    setLoading(false);
  };

  return (
    <StyledBox>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.userText}>{storedMail}</Text>
      <Button
        title="Marcar horario"
        onPress={handlePress}
        loading={loading}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
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
    lineHeight: 35,
    marginBottom: 20,
  },
  userText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '80%',
  },
  button: {
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    height: 60,
  }
});

export default Home;
