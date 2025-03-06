export type UserID = string;

export interface UserDataType {
  uid: UserID;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
  categoriesIsUpload?: boolean;
  exercisesIsUpload?: boolean;
}

export interface userStoreTypes {
  userData: UserDataType;
  setUserData: (user: UserDataType) => void;
}
