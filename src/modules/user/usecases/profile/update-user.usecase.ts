import { UserRepository } from '../../repositories/user.repository';

export interface UpdateUserUseCaseInput {
  userId: string; 
  firstName: string;
  lastName: string;
  maritalStatus: string;
  profession: string;
}

export interface UpdateUserUseCaseOutput {
  success: boolean;
  message: string;
}

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: UpdateUserUseCaseInput): Promise<UpdateUserUseCaseOutput> {
    try {
      const { userId, firstName, lastName, maritalStatus, profession } = input;

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


      const UpdatedUser = await this.userRepository.updateOne(
        { id: userId },
        { firstName: firstName, lastName: lastName, maritalStatus: maritalStatus, profession: profession }
      );

      if (!UpdatedUser) {
        return {
          success: false,
          message: 'Failed to Update user',
        };
      }

      return {
        success: true,
        message: 'User account Updated successfully',
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to Update user account',
      };
    }
  }
}
