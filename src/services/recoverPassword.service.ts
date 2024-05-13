import axios from 'axios';

export type RecoverPasswordServiceResponseT = {
    success: boolean;
    data?: string;
    error?: string;
};

const RecoverPasswordService = async (payload: { email: string}): Promise<RecoverPasswordServiceResponseT> =>  {
    try {
        console.log(payload);
        const endpoint : string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/create-password-reset-token`;
        return {
            success: true,
            data: (await axios.post(endpoint, payload))?.data?.message,
        };
    } catch (e: unknown) {
        let error = 'Ha ocurrido un error';
        console.log(e);
        return { success: false, error};
    }
};

export default RecoverPasswordService;