export interface IPasswordReset {
  id: string;
  email: string;
  verificationCode: string;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PasswordReset implements IPasswordReset {
    constructor(probs: IPasswordReset) {
        Object.assign(this, probs);
      }
    
    id: string;
    email: string;
    verificationCode: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
