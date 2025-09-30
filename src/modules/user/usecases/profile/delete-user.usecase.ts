import { UserRepository } from '../../repositories/user.repository';

export interface DeleteUserUseCaseInput {
  userId: string; // ID of the authenticated user (from JWT)
}

export interface DeleteUserUseCaseOutput {
  success: boolean;
  message: string;
}

export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: DeleteUserUseCaseInput): Promise<DeleteUserUseCaseOutput> {
    try {
      const { userId } = input;

      // First, verify the user exists and is not already deleted
      const existingUser = await this.userRepository.getOne({ 
        id: userId, 
        isDeleted: false 
      });

      if (!existingUser) {
        return {
          success: false,
          message: 'User not found or already deleted',
        };
      }

      // Soft delete the user by setting isDeleted to true
      const deletedUser = await this.userRepository.updateOne(
        { id: userId },
        { isDeleted: true }
      );

      if (!deletedUser) {
        return {
          success: false,
          message: 'Failed to delete user',
        };
      }

      return {
        success: true,
        message: 'User account deleted successfully',
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete user account',
      };
    }
  }
}
