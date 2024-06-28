import { create } from 'zustand';

type IsAdminState = {
  storedIsAdmin: number;
  setIsAdmin: (value: number) => void;
};

const isAdminUseStore = create<IsAdminState>()((set) => ({
  storedIsAdmin: 2,
  setIsAdmin: (value: number) => set({ storedIsAdmin: value }),
}));

export default isAdminUseStore;