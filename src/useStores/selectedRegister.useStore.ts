import { create } from 'zustand';
import { Register } from '../types/services.types';

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
