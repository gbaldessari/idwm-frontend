import axios from 'axios';

export type ChangePasswordServiceResponseT = {
    success: boolean;
    data?: string;
    error?: string;
};

const ChangePasswordService = async (payload: { token: string, oldPassword: string, newPassword: string}): Promise<ChangePasswordServiceResponseT> =>  {
    try {
        console.log(payload);
        const endpoint : string = `${process.env.EXPO_PUBLIC_MS_USER_URL}/auth/update-password`;
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

export default ChangePasswordService;