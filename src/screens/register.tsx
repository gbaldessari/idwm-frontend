import React, { useRef, useState } from 'react';
import { Box, Button, Center, Input, Text, VStack, AlertDialog } from 'native-base';
import registerService from '../services/register.services';
import { useNavigation } from '@react-navigation/core';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type FormDataT = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  birthdate: string;
};

const InitData = {
  name: '',
  lastName: '',
  email: '',
  password: '',
  birthdate: '',
};

const FormInput = ({ label, placeholder, value, setValue, type }: { label: string, placeholder: string, value: string, setValue: (value: string) => void, type?: "text" | "password" }) => (
  <Center>
    <Input
      size="l"
      variant="outline"
      placeholder={placeholder}
      value={value}
      type={type}
      onChange={(e) => setValue(e?.nativeEvent?.text as string)}
    />
  </Center>
);


const Register = () => {
  const [data, setData] = useState<FormDataT>(InitData);
  const [alert, setAlert] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cancelRef = useRef(null);

  const setValue = (key: string, value: string) => {
    setData((prevState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const onClickButton = async () => {
    setLoading(true);
    const response = await registerService(data);

    setLoading(false);
    setMessage((response?.data || response?.error) as string);
    setAlert(true);

    if (response?.success) {
      setData(InitData);
      navigation.navigate('Home');
    }
  };

  return (
    <Box
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: '7%',
        marginVertical: '10%',
      }}
    >
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={alert}
        onClose={() => setAlert(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Body>{message}</AlertDialog.Body>
        </AlertDialog.Content>
      </AlertDialog>
      <VStack space={4} alignItems="center">
        <Center>
          <Text>Registro</Text>
        </Center>
        <FormInput placeholder="Nombre" value={data?.name} setValue={(value) => setValue('name', value)} label={''} />
        <FormInput placeholder="Apellido" value={data?.lastName} setValue={(value) => setValue('lastName', value)} label={''} />
        <FormInput placeholder="Email" value={data?.email} setValue={(value) => setValue('email', value)} label={''} />
        <FormInput placeholder="Contraseña" value={data?.password} setValue={(value) => setValue('password', value)} type="password" label={''} />
        <FormInput placeholder="Fecha de nacimiento" value={data?.birthdate} setValue={(value) => setValue('birthdate', value)} label={''} />
        <Center>
          <Button isLoading={loading} onPress={onClickButton}>
            Crear cuenta
          </Button>
        </Center>
      </VStack>
    </Box>
  );
};

export default Register;
