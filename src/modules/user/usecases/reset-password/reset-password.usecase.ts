// Lib
import bcrypt from "bcryptjs";

// Common
import { ErrorResponse } from "../../../../common/responses/error-response";
import { AuthErrorCodes } from "../../../../common/enums/errors/auth-error-codes.enum";

// Repositories
import { PasswordResetRepository } from "../../repositories/password-reset.repository";
import { UserRepository } from "../../repositories/user.repository";

type ResetPasswordUseCaseInput = {
  email: string;
  verificationCode: string;
  newPassword: string;
};

type ResetPasswordUseCaseOutput = {
  success: boolean;
  message: string;
};

function log(message: string, data?: any) {
  console.log(`[ResetPasswordUseCase] ${message}`, data || "");
}

export class ResetPasswordUseCase {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    data: ResetPasswordUseCaseInput
  ): Promise<ResetPasswordUseCaseOutput> {
    try {
      data.email = data.email.toLowerCase();
      log("Starting password reset", { email: data.email });

      // Find the password reset record
      const passwordReset = await this.passwordResetRepository.getOne({
        email: data.email,
        isDeleted: false,
      });

      if (!passwordReset) {
        throw new ErrorResponse(
          "Invalid or expired verification code",
          AuthErrorCodes.USER_VERIFICATION_INVALID_OTP_ERROR
        );
      }

      // Verify the verification code
      const isCodeValid = await bcrypt.compare(
        data.verificationCode,
        passwordReset.verificationCode
      );

      if (!isCodeValid) {
        throw new ErrorResponse(
          "Invalid verification code",
          AuthErrorCodes.USER_VERIFICATION_INVALID_VERIFICATION_CODE_ERROR
        );
      }

      // Check if the code has expired (15 minutes)
      const codeAge = Date.now() - passwordReset.updatedAt!.getTime();
      const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

      if (codeAge > fifteenMinutes) {
        throw new ErrorResponse(
          "Verification code has expired",
          AuthErrorCodes.USER_VERIFICATION_EXPIRED_OTP_ERROR
        );
      }

      // Find the user
      const user = await this.userRepository.getOne({
        email: data.email,
        isDeleted: false,
      });

      if (!user) {
        throw new ErrorResponse(
          "User not found",
          AuthErrorCodes.USER_FETCH_ONE_ERROR
        );
      }

      //New Password must be not the same as last Password 
      const isMatched = await bcrypt.compare(data.newPassword,user.password);
      if(isMatched == true){
        return {
          success: false,
          message: "Invalid Password",
        };
      }
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);
      
      log("hashed new Password: ",hashedNewPassword);
      log("previous Password: ",user.password);
      


      // Update user's password
      await this.userRepository.updateOne(
        { email: data.email },
        { password: hashedNewPassword }
      );
      log("Updated user password");

      // Mark the password reset record as deleted
      await this.passwordResetRepository.updateOne(
        { email: data.email },
        { isDeleted: true }
      );
      log("Marked password reset record as deleted");

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    } catch (error) {
      log("Error in password reset", error);
      throw error;
    }
  }
}
