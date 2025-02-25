import { create } from 'zustand';
import { userStoreTypes } from '@/@types/userStoreTypes';


export const useUserStore = create<userStoreTypes>((set) => ({
  userData: {},

  setUserData: (user) => set((state) => {
    return {
      ...state,
      userData: user,
    };
  }),
}));
