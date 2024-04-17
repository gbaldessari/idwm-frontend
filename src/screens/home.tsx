import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Text } from 'native-base';
import useStore from '../stores/useStore';

const Home = () => {
  const {storedMail} = useStore();
  return (
    <StyledBox>
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.userText}>{storedMail}</Text>
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

export default Home;
