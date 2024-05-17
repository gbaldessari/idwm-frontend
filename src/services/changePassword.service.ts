import axios from 'axios';

export type ChangePasswordServiceResponseT = {
    success: boolean;
    data?: string;
    error?: string;
};

const ChangePasswordService = async (payload: { token: string, newPassword: string}): Promise<ChangePasswordServiceResponseT> =>  {
    try {
        console.log(payload);
        const endpoint : string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/password-reset`;
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

export default ChangePasswordService;