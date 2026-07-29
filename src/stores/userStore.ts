import { create } from 'zustand';
import { UserDataType, userStoreTypes } from '@/@types/userStoreTypes';

const emptyUser: UserDataType = {
  uid: '',
  firstName: '',
  lastName: '',
  email: '',
  createdAt: '',
};

export const useUserStore = create<userStoreTypes>((set) => ({
  userData: emptyUser,

  setUserData: (user) => set({ userData: user }),

  resetUserData: () => set({ userData: emptyUser }),
}));
