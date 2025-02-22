import { create } from 'zustand';
import { AppSettingsType } from '@/types/appSettingsTypes';


export const useAppSettingStore = create<AppSettingsType>((set) => ({
  isStorageSupported: false,

  setStorageSettingState: (updatedState) => set((state) => {
    return {
      ...state,
      isStorageSupported: updatedState,
    };
  }),
}));
