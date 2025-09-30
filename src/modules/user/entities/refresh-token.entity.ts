export interface IRefreshToken {
  id: string;
  email: string;
  role: 'user' | 'admin';
  refreshToken: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}

export class RefreshToken implements IRefreshToken {

  constructor(probs: IRefreshToken) {
    Object.assign(this, probs);
  }

  id: string;
  email: string;
  role: 'user' | 'admin';
  refreshToken: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
} 