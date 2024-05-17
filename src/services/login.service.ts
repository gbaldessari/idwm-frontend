import axios from 'axios';

export type LoginServiceResponseT = {
  success: boolean;
  data?: { token: string };
  error?: string;
};

const loginService = async (
  data: Record<string, string>
): Promise<LoginServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/login`;

    return {
      success: true,
      data: (await axios.post(endpoint, data))?.data
      
    };
  } catch (e: unknown) {
    console.error(e);
    let error = 'Ha ocurrido un error';
    console.log({
      e: (e as Record<string, Record<string, Record<string, unknown>>>)
        ?.response?.data,
    });
    switch (
      (e as Record<string, Record<string, Record<string, unknown>>>)?.response
        ?.data?.message
    ) {
      case 'Usuario no encontrado':
        error = 'El email no está registrado';
        break;
      case 'Contraseña incorrecta':
        error = 'La contraseña es incorrecta';
        break;
    }

    return { success: false, error };
  }
};

export default loginService;