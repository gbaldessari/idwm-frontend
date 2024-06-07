import { create } from 'zustand';

type TokenState = {
  storedToken: string;
  setToken: (value: string) => void;
};

const tokenUseStore = create<TokenState>()((set) => ({
    storedToken: '',
    setToken: (value: string) => set({ storedToken: value }),
}));

export default tokenUseStore;
