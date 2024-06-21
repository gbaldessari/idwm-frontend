import React, { useEffect, useState } from 'react';
import { Box, Center, VStack, Spinner } from 'native-base';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import tokenUseStore from "../../../useStores/token.useStore";
import { useNavigation } from '@react-navigation/core';
import 'text-encoding-polyfill';
import Joi from 'joi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationRoutes } from '../../../types/navigationRoutes.type';
import { updateProfileSchema } from '../../../schemas/updateProfile.schema';
import { updateProfileStyles } from '../../../styles/updateProfile.styles';
import Toast from 'react-native-toast-message';
import { getUserDataService, updateUserDataService } from '../../../services/auth/auth.service';

type FormDataT = {
    name: string;
    lastName: string;
    birthdate: string;
};

const InitData: FormDataT = {
    name: '',
    lastName: '',
    birthdate: ''
};

const UpdateProfileScreen = () => {
    const { storedToken } = tokenUseStore();
    const token = storedToken || '';
    const navigation = useNavigation<NativeStackNavigationProp<NavigationRoutes>>();
    const [formData, setFormData] = useState<FormDataT>(InitData);
    const [loading, setLoading] = useState<boolean>(false);
    const [isDisabledText, setIsDisabledText] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<keyof FormDataT, string>>({
        name: '',
        lastName: '',
        birthdate: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                setFetching(true);
                try {
                    const response = await getUserDataService({ token });
                    if (response.success && response.data) {
                        setFormData({
                            name: response.data.name,
                            lastName: response.data.lastName,
                            birthdate: response.data.birthdate,
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Error al obtener los datos del Usuario'
                        });
                    }
                } catch (error) {
                    Toast.show({
                        type: 'error',
                        text1: 'Error al obtener los datos del Usuario'
                    });
                } finally {
                    setFetching(false);
                }
            }
        };

        fetchData();
    }, [token]);

    const handleInputChange = (field: keyof FormDataT) => (value: string) => {
        let formattedValue = value;
        if (field === 'birthdate') {
            formattedValue = formatDateString(value);
        }
        setFormData(prev => ({ ...prev, [field]: formattedValue }));
        validateField(field, formattedValue);
    };

    const formatDateString = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,2})(\d{0,2})(\d{0,4})$/);
        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join('/');
        }
        return value;
    };

    const validateField = (field: keyof FormDataT, value: string) => {
        const schema = Joi.object({ [field]: updateProfileSchema.extract(field) });
        const { error } = schema.validate({ [field]: value });
        setErrors(prev => ({
            ...prev,
            [field]: error ? error.details[0].message : '',
        }));
    };

    const isValidForm = () => {
        const { error } = updateProfileSchema.validate(formData, { abortEarly: false });
        if (!error) return true;

        const fieldErrors = error.details.reduce((acc, { context, message }) => {
            if (context?.key) acc[context.key as keyof FormDataT] = message;
            return acc;
        }, {} as Record<keyof FormDataT, string>);

        setErrors(fieldErrors);
        return false;
    };

    const handleSubmit = async () => {
        if (!isValidForm()) return;
        const { name, lastName, birthdate } = formData;

        setLoading(true);
        setIsDisabledText(true);
        const response = await updateUserDataService({ token, name, lastName, birthdate });
        setIsDisabledText(false);
        setLoading(false);

        if (response?.success) {
            Toast.show({
                type: 'success',
                text1: 'Perfil actualizado con exito'
            });
            navigation.navigate('Settings');
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error al actualizar el perfil'
            });
        }
    };

    if (fetching) {
        return (
            <Center flex={1}>
                <Spinner size="lg" />
            </Center>
        );
    }

    return (
        <View style={updateProfileStyles.container}>
            <Box style={updateProfileStyles.containerBox}>
                <VStack space={4} alignItems='center'>
                    <FormInput
                        label="Name"
                        placeholder=""
                        value={formData.name}
                        errorMessage={errors.name}
                        onChangeText={handleInputChange('name')}
                        disabled={isDisabledText}
                    />
                    <FormInput
                        label="Last Name"
                        placeholder=""
                        value={formData.lastName}
                        errorMessage={errors.lastName}
                        onChangeText={handleInputChange('lastName')}
                        disabled={isDisabledText}
                    />
                    <FormInput
                        label="Birthdate"
                        placeholder="DD/MM/AAAA"
                        value={formData.birthdate}
                        errorMessage={errors.birthdate}
                        onChangeText={handleInputChange('birthdate')}
                        disabled={isDisabledText}
                    />
                    <NavigationButton title='Confirm Changes' onPress={handleSubmit} loading={loading} />
                </VStack>
            </Box>
        </View>
    );
};

const FormInput = ({ label, placeholder, value, errorMessage, onChangeText, disabled }: { label: string; placeholder: string; value: string; errorMessage: string; onChangeText: (value: string) => void; disabled: boolean; }) => (
    <Input
        label={label}
        placeholder={placeholder}
        value={value}
        errorMessage={errorMessage}
        onChangeText={onChangeText}
        disabled={disabled}
    />
);

const NavigationButton = ({ title, onPress, loading }: { title: string; onPress: () => void; loading: boolean }) => (
    <Center>
        <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={{ marginVertical: 10, backgroundColor: '#6200ee' }}
        />
    </Center>
);

export default UpdateProfileScreen;
