import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

import { JWTService, JWTPayload } from '../../../services/jwt/jwt.interface';
import { LoginInput } from '../validators/login-user.validator';
import { AdminWhitelistService } from '../../../services/admin-whitelist/admin-whitelist.service';



export interface LoginResult {
  success: boolean;
  message: string;
  data?: {
    user: {
      id?: string;  // Optional for admin (no database ID)
      email: string;
      firstName?: string;  // Optional for admin
      lastName?: string;   // Optional for admin
      role: 'user' | 'admin';
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  error?: string;
}

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JWTService
  ) {}

  
  async execute(loginData: LoginInput): Promise<LoginResult> {
    try {
      let { email, password } = loginData;
      email = email.toLowerCase();

      // First, check if it's an admin login
      
      const isAdmin = await AdminWhitelistService.validateAdminCredentials(email, password);
     
      if (isAdmin) {
              // Admin login - generate tokens with admin role
      const jwtPayload: JWTPayload = {
        userId: 'admin', // Special identifier for admin
        email: email,
        role: 'admin'
      };

        const tokens = this.jwtService.generateTokenPair(jwtPayload);
        // Return admin success response
        return {
          success: true,
          message: 'Admin login successful',
          data: {
            user: {
              email: email,
              role: 'admin'
              // No ID, firstName, lastName for admin (not stored in database)
            },
            tokens: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken
            }
          }
        };
      }

      // Not admin - check if it's a regular user
      const user = await this.userRepository.getOne({ email, isDeleted: false });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'Invalid credentials'
        };
      }

      // Verify user password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password',
          error: 'Invalid credentials'
        };
      }

    
      // User login - generate tokens with user role
      const jwtPayload: JWTPayload = {
        userId: user.id!,
        email: user.email,
        role: 'user'
      };

      const tokens = this.jwtService.generateTokenPair(jwtPayload);

      // Return user success response
      return {
        success: true,
        message: 'User login successful',
        data: {
          user: {
            id: user.id!,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: 'user'
          },
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
