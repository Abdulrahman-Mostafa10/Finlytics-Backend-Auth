export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  exp?: Date;  // Optional since JWT library adds it automatically
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JWTService {
  generateAccessToken(payload: JWTPayload): string;
  generateRefreshToken(payload: JWTPayload): string;
  generateTokenPair(payload: JWTPayload): TokenPair;
  verifyAccessToken(token: string): JWTPayload | null;
  verifyRefreshToken(token: string): JWTPayload | null;
}
