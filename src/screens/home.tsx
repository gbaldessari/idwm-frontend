import React from 'react';
import { Box } from 'native-base';
import useStore from '../stores/useStore';

const StyledBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    style={{
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center',
      marginHorizontal: '7%',
      marginVertical: '10%',
    }}
  >
    {children}
  </Box>
);

const Home = () => {
  const { user } = useStore();
  return (
    <StyledBox>
      Hello world! {user}
    </StyledBox>
  );
};

export default Home;
