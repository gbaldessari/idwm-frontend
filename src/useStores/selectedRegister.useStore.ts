import { create } from 'zustand';

interface Register {
  id: number;
  date: string;
  timeEntry: string;
  timeExit: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

type SelectedRegisterState = {
  selectedRegister: Register | null;
  setSelectedRegister: (register: Register) => void;
  clearSelectedRegister: () => void;
};

const selectedRegisterUseStore = create<SelectedRegisterState>((set) => ({
  selectedRegister: null,
  setSelectedRegister: (register) => set({ selectedRegister: register }),
  clearSelectedRegister: () => set({ selectedRegister: null }),
}));

export default selectedRegisterUseStore;
