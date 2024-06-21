import axios, { AxiosInstance } from 'axios';
import { Register, ServiceResponse } from '../../types/services.types';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_MS_REGISTER_URL,
});

export const getRegistersByRangeService = async (payload: { token: string, startDate: string, endDate: string }): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/registers/get-registers-by-rangeData',
            { token:payload.token, startDate: payload.startDate, endDate: payload.endDate }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

export const getRegistersOfWorkersService = async (payload: { token: string, id: string, startDate: string, endDate: string }): Promise<ServiceResponse<Register[]>> => {
    try {
        const response = await axiosInstance.post('/registers/admin-get-registers-by-rangeData',
            { id: payload.id, startDate: payload.startDate, endDate: payload.endDate },
            { headers: { Authorization: `Bearer ${payload.token}` } }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

export const createRegisterService = async (payload: { token: string; isEntry: boolean; latitude: number; longitude: number }): Promise<ServiceResponse<{ userId: number }>> => {
    try {
        const response = await axiosInstance.post('/registers/create-register',
            { isEntry: payload.isEntry, latitude: payload.latitude, longitude: payload.longitude },
            { headers: { Authorization: `Bearer ${payload.token}` } }
        );
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

export const adminCreateRegisterService = async (payload: { token: string; id: number; date: string; }): Promise<ServiceResponse<number>> => {
    try {
        console.log(payload);
        const response = await axiosInstance.post('/registers/admin-create-register',
            { id: payload.id, date: payload.date },
            { headers: { Authorization: `Bearer ${payload.token}` } }
        );
        return { success: true, data: response.data };
    } catch (error) {
        console.log(error);
        return { success: false, error: String(error) };
    }
};

export const updateStartRegisterService = async (payload: { token: string; id: number; date: string }): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/registers/update-start-register',
            { id: payload.id, date: payload.date },
            { headers: { Authorization: `Bearer ${payload.token}` } }
        );
        return { success: response.data.success, data: response.data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

export const updateEndRegisterService = async (payload: { token: string; id: number; date: string }): Promise<ServiceResponse<any>> => {
    try {
        const response = await axiosInstance.post('/registers/update-end-register',
            { id: payload.id, date: payload.date },
            { headers: { Authorization: `Bearer ${payload.token}` } }
        );
        return { success: response.data.success, data: response.data };
    } catch (error) {
        return { success: false, error: String(error) };
    }
};

