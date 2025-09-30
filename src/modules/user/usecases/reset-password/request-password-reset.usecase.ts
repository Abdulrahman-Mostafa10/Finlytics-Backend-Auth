// Lib
import bcrypt from "bcryptjs";
import sgMail from "@sendgrid/mail";

//Config
import { config } from "../../../../config/config";

// Common
import { ErrorResponse } from "../../../../common/responses/error-response";
import { AuthErrorCodes } from "../../../../common/enums/errors/auth-error-codes.enum";

// Repositories
import { PasswordResetRepository } from "../../repositories/password-reset.repository";

// Services
import { AdminWhitelistService } from "../../../../services/admin-whitelist/admin-whitelist.service";

type RequestPasswordResetUseCaseInput = {
  email: string;
};

type RequestPasswordResetUseCaseOutput = {
  success: boolean;
  message: string;
};

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function log(message: string, data?: any) {
  console.log(`[RequestPasswordResetUseCase] ${message}`, data || "");
}

export class RequestPasswordResetUseCase {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository
  ) {
    // Set SendGrid API key
    sgMail.setApiKey(config.sendgrid.apiKey);
  }

  async execute(
    data: RequestPasswordResetUseCaseInput
  ): Promise<RequestPasswordResetUseCaseOutput> {
    try {
      data.email = data.email.toLowerCase();
      log("Starting password reset request", { email: data.email });
    
      // Check if it's an admin email
      const isAdmin = await AdminWhitelistService.validateAdminCredentials(
        data.email,
        "dummy"
      );

      if (isAdmin) {
        return {
          success : false,
          message : "password reset is not available"
        };
      }

      // Generate 6-character verification code
      const verificationCode = generateVerificationCode();
      log("Generated verification code", { code: verificationCode });

      // Hash the verification code
      const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);
      log("Hashed verification code");

      // Check if email already has a non-deleted document
      const existingReset = await this.passwordResetRepository.getOne({
        email: data.email,
        isDeleted: false,
      });

      if (existingReset){
        log("Delete last sended verification code");
        await this.passwordResetRepository.updateOne(
          { email: data.email},
          { isDeleted: true}
        );
      }

        // Create new document
      log("Creating new password reset record");
      await this.passwordResetRepository.createOne({
        email: data.email,
        verificationCode: hashedVerificationCode,
        isDeleted: false,
      });
      

      // Send email via SendGrid
      await this.sendPasswordResetEmail(data.email, verificationCode);
      log("Password reset email sent successfully");

      return {
        success: true,
        message: "Password reset code has been sent to your email",
      };
    } catch (error) {
      log("Error in password reset request", error);
      throw error;
    }
  }

  private async sendPasswordResetEmail(email: string, verificationCode: string): Promise<void> {
    try {
      const msg = {
        to: email,
        from: config.sendgrid.senderEmail,
        subject: "Password Reset Request",
        text: `Your password reset code is: ${verificationCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You have requested to reset your password.</p>
            <p>Your verification code is: <strong style="font-size: 18px; color: #007bff;">${verificationCode}</strong></p>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        `,
      };

      await sgMail.send(msg);
    } catch (error) {
      log("Error sending email", error);
      throw new ErrorResponse(
        "Failed to send password reset email",
        AuthErrorCodes.USER_VERIFICATION_EMAIL_VERIFY_ERROR
      );
    }
  }
}
