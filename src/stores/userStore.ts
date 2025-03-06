import { create } from 'zustand';
import { userStoreTypes } from '@/@types/userStoreTypes';


export const useUserStore = create<userStoreTypes>((set) => ({
  userData: {
    uid: '',
    firstName: '',
    lastName: '',
    email: '',
    createdAt: '',
  },

  setUserData: (user) => set((state) => {
    return {
      ...state,
      userData: user,
    };
  }),
}));
