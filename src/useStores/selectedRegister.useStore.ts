import { create } from 'zustand';

type SelectedRegisterState = {
  selectedRegister: any;
  setSelectedRegister: (register: any) => void;
  clearSelectedRegister: () => void;
};

const selectedRegisterUseStore = create<SelectedRegisterState>((set) => ({
  selectedRegister: null,
  setSelectedRegister: (register) => set({ selectedRegister: register }),
  clearSelectedRegister: () => set({ selectedRegister: null }),
}));

export default selectedRegisterUseStore;
