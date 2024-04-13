import { create } from 'zustand';

type UserState = {
  user: string;
  setUser: (value: string) => void;
};

const useStore = create<UserState>()((set) => ({
  user: '',
  setUser: (value: string) => set({ user: value }),
}));

export default useStore;
