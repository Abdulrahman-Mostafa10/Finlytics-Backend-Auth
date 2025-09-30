export interface IUser {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional profile information
  dateOfBirth?: Date;
  maritalStatus?: string;
  profession?: string;
  gender?: string;
  address?: string;
  profileImage?: string;
}

export class User implements IUser {
  constructor(probs: IUser) {
    Object.assign(this, probs);
  }

  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional profile information
  dateOfBirth?: Date;
  maritalStatus?: string;
  profession?: string;
  gender?: string;
  address?: string;
  profileImage?: string;
}
