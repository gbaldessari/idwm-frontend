import React from 'react';
import { Box } from 'native-base';
import useStore from '../stores/useStore';

const Home = () => {
  const { user } = useStore();
  return (
    <StyledBox>
      Hello world! {user}
    </StyledBox>
  );
};

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

export default Home;
