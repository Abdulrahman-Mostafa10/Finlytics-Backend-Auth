import { User } from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";

type SignupCompletionUseCaseInput = {
  email: string;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  maritalStatus: string;
  profession: string;
  gender: string;
  address: string;
};

type SignupCompletionUseCaseOutput = {
  success: boolean;
  message: string;
  user?: Partial<User>;
};

export class SignupCompletionUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    data: SignupCompletionUseCaseInput
  ): Promise<SignupCompletionUseCaseOutput> {
    try {
      let { email, ...profileData } = data;
      email = email.toLowerCase();
      // Find user by email
      const existingUser = await this.userRepository.getOne({ email, isDeleted:false });

      if (!existingUser) {
        return {
          success: false,
          message: "User not found",
        };
      }
      
      // Update user with additional information
      const updatedUser = await this.userRepository.updateOne(
        { email },
        profileData
      );

      if (!updatedUser) {
        return {
          success: false,
          message: "Failed to update user profile",
        };
      }

      return {
        success: true,
        message: "User profile completed successfully",
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          dateOfBirth: updatedUser.dateOfBirth,
          maritalStatus: updatedUser.maritalStatus,
          profession: updatedUser.profession,
          gender: updatedUser.gender,
          address: updatedUser.address,
        },
      };
    } catch (error) {
      console.error("SignupCompletionUseCase error:", error);
      return {
        success: false,
        message: "Internal server error during profile completion",
      };
    }
  }
}
