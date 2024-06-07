import axios from 'axios';

export type GetWorkersServiceResponseT = {
  success: boolean;
  data?: any;
  error?: string;
};

const getWorkersService = async (token: string): Promise<GetWorkersServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/get-workers`;
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { success: true, data: response.data };
  } catch (e: unknown) {
    console.error('Error fetching workers:', e);
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export default getWorkersService;
