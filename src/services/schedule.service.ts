import axios from 'axios';

export type ScheduleServiceResponseT = {
  success: boolean;
  data?: { userId: number };
  error?: string;
};

const scheduleService = async (payload: { token: string; isEntry: boolean; latitude: number; longitude: number }
): Promise<ScheduleServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/create-register`;
    return {
      success: true,
      data: (await axios.post(endpoint, payload))?.data,
    };
  } catch (e: unknown) {
    console.log(e);
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export default scheduleService;
