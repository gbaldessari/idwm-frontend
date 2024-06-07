import axios from 'axios';

export type GetRegistersByRangeServiceResponseT = {
  success: boolean;
  data?: any;
  error?: string;
};

const getRegistersByRangeService = async (payload: { token: string, startDate: string, endDate: string }): Promise<GetRegistersByRangeServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/get-registers-by-rangeData`;
    console.log('Requesting registers with payload:', payload); // Registro de la carga útil
    const response = await axios.post(endpoint, payload);
    return { success: true, data: response.data };
  } catch (e: unknown) {
    console.error('Error fetching registers:', e); // Registro del error
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export default getRegistersByRangeService;
