import axios from 'axios';

interface Register {
  id: number;
  date: string;
  timeEntry: string;
  timeExit: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export type GetRegistersOfWorkersServiceResponseT = {
  success: boolean;
  data?: Register[];
  error?: string;
};

const getRegistersOfWorkersService = async (payload: {id: string; startDate: string; endDate: string }): Promise<GetRegistersOfWorkersServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/admin-get-registers-by-rangeData`;

    const response = await axios.post(endpoint, payload);
    return { success: true, data: response.data };
  } catch (e: unknown) {
    console.error('Error fetching registers:', e); 
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export default getRegistersOfWorkersService;
