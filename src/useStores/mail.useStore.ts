import { create } from 'zustand';

type MailState = {
  storedMail: string;
  setMail: (value: string) => void;
};

const mailUseStore = create<MailState>()((set) => ({
  storedMail: '',
  setMail: (value: string) => set({ storedMail: value }),
}));

export default mailUseStore;
