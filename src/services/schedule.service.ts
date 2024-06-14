import axios from 'axios';

export type ScheduleServiceResponseT = {
  success: boolean;
  data?: { userId: number };
  error?: string;
};

export const createRegisterService = async (payload: { token: string; isEntry: boolean; latitude: number; longitude: number }
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

export const adminCreateRegisterService = async (payload: { id: number; isEntry: boolean; date: string; time: string }
): Promise<ScheduleServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/admin-create-register`;
    
    // Log para verificar los datos que se envían al servidor
    console.log('Payload enviado:', payload);

    const response = await axios.post(endpoint, payload);
    return {
      success: true,
      data: response.data,
    };
  } catch (e: unknown) {
    console.log(e);
    const error = 'Ha ocurrido un error';
    return { success: false, error };
  }
};

export const updateStartRegisterService = async (payload: { id: number, startDate: string }): Promise<ScheduleServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/update-start-register`;
    const response = await axios.post(endpoint, payload);
    return {
      success: response.data.success,
      data: response.data,
    };
  } catch (e: unknown) {
    console.error(e);
    return { success: false, error: 'Ha ocurrido un error al actualizar la hora de entrada' };
  }
};

export const updateEndRegisterService = async (payload: { id: number, endDate: string }): Promise<ScheduleServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_REGISTER_URL}/registers/update-end-register`;
    const response = await axios.post(endpoint, payload);
    return {
      success: response.data.success,
      data: response.data,
    };
  } catch (e: unknown) {
    console.error(e);
    return { success: false, error: 'Ha ocurrido un error al actualizar la hora de salida' };
  }
};
