import { View } from 'react-native';
import healthcheckService from '../services/healthcheck.service';
import { useEffect, useState } from 'react';
import { Spinner, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import React from 'react';

const Loading = () => {
  const navitagion = useNavigation();
  const [errorMessage, setErrorMessage] = useState<string>();

  const getHealthcheck = async () => {
    const res = await healthcheckService();
    console.log({ res });
    if (res.status === 200) {
      navitagion.navigate('Main');
    } else {
      setErrorMessage('No tienes conexion a internet');
    }
  };

  useEffect(() => {
    getHealthcheck();
  }, []);

  return (
    <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
      {errorMessage ? (
        <Text style={{ alignContent: 'center' }}>{errorMessage}</Text>
      ) : (
        <Spinner size="xl" />
      )}
    </View>
  );
};

export default Loading;
