import { UserRepository } from '../../repositories/user.repository';

export interface GetUserProfileUseCaseInput {
  targetUserId: string; // ID of the user whose profile we want to retrieve
}

export interface GetUserProfileUseCaseOutput {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth?: Date;
      maritalStatus?: string;
      profession?: string;
      gender?: string;
      address?: string;
      profileImage?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  };
}

export class GetUserProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: GetUserProfileUseCaseInput): Promise<GetUserProfileUseCaseOutput> {
    try {
      const { targetUserId } = input;

      // Fetch user from database
      const user = await this.userRepository.getOne({ 
        id: targetUserId, 
        isDeleted: false 
      });

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Return user profile (excluding sensitive data like password)
      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            maritalStatus: user.maritalStatus,
            profession: user.profession,
            gender: user.gender,
            address: user.address,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve user profile',
      };
    }
  }
}
