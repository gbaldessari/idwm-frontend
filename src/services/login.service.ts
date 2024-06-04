import axios from 'axios';

export type LoginServiceResponseT = {
  success: boolean;
  data?: { token: string };
  error?: string;
};

const loginService = async (payload : {email: string, password: string}): Promise<LoginServiceResponseT> => {
  try {

    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/login`;

    const response = await axios.post(endpoint, payload);

    return {
      success: true,
      data: response.data
    };
  } catch (e: unknown) {
    let error = 'Ha ocurrido un error';
    console.log(e);
    return { success: false, error};
  }
};

export default loginService;
