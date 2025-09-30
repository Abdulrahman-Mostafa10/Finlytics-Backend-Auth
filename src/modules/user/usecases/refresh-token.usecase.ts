
import { JWTService, JWTPayload } from '../../../services/jwt/jwt.interface';

export interface RefreshTokenInput {
  userPayload: JWTPayload;
}

export interface RefreshTokenResult {
  success: boolean;
  accessToken?: string;
  message: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly jwtService: JWTService
  ) {}

  async execute(refreshTokenInput: RefreshTokenInput): Promise<RefreshTokenResult> {
    try {
      const { userPayload } = refreshTokenInput;
      // Generate new access token only (keep same refresh token)
      const newJwtPayload: JWTPayload = {
        userId: userPayload.userId,
        email: userPayload.email,
        role: userPayload.role
      };

      const newAccessToken = this.jwtService.generateAccessToken(newJwtPayload);

      return {
        success: true,
        accessToken: newAccessToken,
        message: 'Access token refreshed successfully'
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to refresh access token'
      };
    }
  }
} 