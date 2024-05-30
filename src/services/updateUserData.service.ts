import axios from 'axios';

export type UpdateUserDataServiceResponseT = {
  success: boolean;
  data?: string;
  error?: string;
};

const updateUserDataService = async (payload: { token: string; name: string; lastName: string; birthdate: string }): Promise<UpdateUserDataServiceResponseT> => {
  try {
    const endpoint: string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/update-user`;

    const response = await axios.put(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${payload.token}` // Incluir el token en el encabezado de autorización
      }
    });

    console.log(response.data); // Puedes mostrar la respuesta del servidor en la consola

    return {
      success: true,
      data: response.data.data
    };
  } catch (e) {
    console.error('Error:', e); // Mostrar el error en la consola
    let errorMessage = 'Ha ocurrido un error';
    return { success: false, error: errorMessage };
  }
};

export default updateUserDataService;
