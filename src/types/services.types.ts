export type Register = {
    id: number;
    date: string;
    timeEntry: string;
    timeExit: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
}

export type ServiceResponse<T> = {
    success: boolean;
    data?: T;
    error?: string;
}

export type GetRegistersByRangeServiceResponseT = {
    success: boolean;
    data?: any;
    error?: string;
};

export type Worker = {
    id: number;
    name: string;
    lastName: string;
  }