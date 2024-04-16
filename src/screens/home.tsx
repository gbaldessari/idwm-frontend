import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Text } from 'native-base';
import useStore from '../stores/useStore';

const Home = () => {
  const { user } = useStore();
  return (
    <StyledBox>
      <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 35 }}>Bienvenido</Text>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>{user}</Text>
    </StyledBox>
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
    padding: 10,
  }
});

export default Home;
