import { UserRepository } from "../../repositories/user.repository";

export interface UploadProfileImageUseCaseInput {
  userId: string;
  profileImage: string; // base64 image string
}

export interface UploadProfileImageUseCaseOutput {
  success: boolean;
  message: string;
}

export class UploadProfileImageUseCase {
  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: UploadProfileImageUseCaseInput): Promise<UploadProfileImageUseCaseOutput> {
    try {
      const { userId, profileImage } = input;

      // Update user with profile image
      const updatedUser = await this.userRepository.updateOne(
        { id: userId },
        { profileImage: profileImage}
      );

      if (!updatedUser) {
        return {
          success: false,
          message: "User not found"
        };
      }

      return {
        success: true,
        message: "Profile image updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update profile image"
      };
    }
  }
}
