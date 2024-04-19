import axios from 'axios';

export type RecoverPasswordServiceResponseT = {
    success: boolean;
    data?: string;
    error?: string;
};

const RecoverPasswordService = async (payload: { mail: string; password: string }): Promise<RecoverPasswordServiceResponseT> =>  {
    try {
        const endpoint : string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/create-password-reset-token`;
        return {
            success: true,
            data: (await axios.post(endpoint, payload))?.data?.message,
        };
    } catch (e: unknown) {
        let error = 'Ha ocurrido un error';
        console.log(error);
        return { success: false, error};
    }
};

export default RecoverPasswordService;