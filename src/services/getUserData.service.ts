import axios from 'axios';

export type GetUserDataServiceResponseT = {
  success: boolean;
  data?: {
    name: string;
    lastName: string;
    birthdate: string;
  };
  error?: string;
};

const getUserDataService = async (payload: { token: string}): Promise<GetUserDataServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/get-user`;
    
    const headers = {
      Authorization: `Bearer ${payload.token}`
    };

    const response = await axios.get(endpoint, { headers });

    return {
      success: true,
      data: response.data.data
    };
  } catch (e: unknown) {
    console.log(e);
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};


export default getUserDataService;
