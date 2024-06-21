import axios, { AxiosInstance } from 'axios';
import { ServiceResponse } from '../../types/services.types';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_MS_USER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerService = async (data: Record<string, string>): Promise<ServiceResponse<string>> => {
  try {
    const response = await axiosInstance.post('/auth/register', data);
    return { success: true, data: response.data?.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const loginService = async (payload: { email: string; password: string }): Promise<ServiceResponse<{ token: string; isAdmin: number }>> => {
  try {
    const response = await axiosInstance.post('/auth/login', payload);
    const token = response.data?.token;
    const verifyResponse = await axiosInstance.post(
      '/auth/verify-token',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const isAdmin = verifyResponse.data?.isAdmin;
    return { success: true, data: { token, isAdmin } };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const changeForgottenPasswordService = async (payload: { token: string; newPassword: string }): Promise<ServiceResponse<string>> => {
  try {
    const response = await axiosInstance.post('/auth/password-reset', payload);
    return { success: true, data: response.data?.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const changePasswordService = async (payload: { token: string; oldPassword: string; newPassword: string }): Promise<ServiceResponse<string>> => {
  try {
    const response = await axiosInstance.put(
      '/auth/update-password',
      payload,
      { headers: { Authorization: `Bearer ${payload.token}` } }
    );
    return { success: true, data: response.data?.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const getUserDataService = async (payload: { token: string }): Promise<ServiceResponse<{name: string; lastName: string; birthdate: string;}>> => {
  try {
    const response = await axiosInstance.get('/auth/get-user', {
      headers: { Authorization: `Bearer ${payload.token}` },
    });
    return { success: true, data: response.data?.data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const getWorkersService = async (token: string): Promise<ServiceResponse<any>> => {
  try {
    const response = await axiosInstance.get('/auth/get-workers', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const recoverPasswordService = async (payload: { email: string }): Promise<ServiceResponse<string>> => {
  try {
    const response = await axiosInstance.post('/auth/create-password-reset-token', payload);
    return { success: true, data: response.data?.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};

export const updateUserDataService = async (payload: { token: string; name: string; lastName: string; birthdate: string }): Promise<ServiceResponse<string>> => {
  try {
    const response = await axiosInstance.put(
      '/auth/update-user',
      payload,
      { headers: { Authorization: `Bearer ${payload.token}` } }
    );
    return { success: true, data: response.data?.message };
  } catch (error) {
    return { success: false, error: String(error) };
  }
};
