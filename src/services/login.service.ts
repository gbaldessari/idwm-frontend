import axios from 'axios';

export type LoginServiceResponseT = {
  success: boolean;
  data?: { token: string, isAdmin: number};
  error?: string;
};

const loginService = async (payload : {email: string, password: string}): Promise<LoginServiceResponseT> => {
  try {

    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/login`;

    const response = await axios.post(endpoint, payload);

    const token = response?.data?.token;

    const endpoint2: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/verify-token`;
    
    const response2 = await axios.post(endpoint2, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const isAdmin = response2?.data?.isAdmin;
    
    return {
      success: true,
      data: {token,isAdmin}
    };
  } catch (e: unknown) {
    let error = 'Ha ocurrido un error';
    console.log(e);
    return { success: false, error};
  }
};

export default loginService;
