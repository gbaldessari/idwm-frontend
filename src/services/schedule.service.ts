import axios from 'axios';

export type ScheduleServiceResponseT = {
  success: boolean;
  data?: string;
  error?: string;
};

const scheduleService = async ( data: { token: string}
): Promise<ScheduleServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/create-register`;
    return {
      success: true,
      data: (await axios.post(endpoint, data))?.data?.message,
    };
  } catch (e: unknown) {
    console.log(e);
    let error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export default scheduleService;