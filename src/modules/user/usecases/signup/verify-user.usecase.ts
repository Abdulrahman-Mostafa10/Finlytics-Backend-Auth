import crypto from "crypto";
import jwt from "jsonwebtoken";

// Enums
import {AuthErrorCodes} from "../../../../common/enums/errors/auth-error-codes.enum";
import {VerificationChallengePurposes} from "../../../../common/enums/verification-challenge-purposes.enum";

// Repositories
import {UserVerificationRepository} from "../../repositories/user-verification.repository";

// Usecase
import {ValidateVerificationChallengeUseCase} from "../signup/validate-verification-challenge.usecase";

// Errors
import {ErrorResponse} from "../../../../common/responses/error-response";

// Config
import {config} from "../../../../config/config";

type VerifyUserUseCaseInput = {
  email: string;
  verificationCode: string;
  challengeToken: string;
};

type VerifyUserUseCaseOutput = {
  verified: boolean;
  message: string;
  verificationId?: string;
  verificationToken: string;
};

export class VerifyUserUseCase {
  constructor(
    private readonly userVerificationRepository: UserVerificationRepository,
    private readonly validateVerificationChallengeUseCase: ValidateVerificationChallengeUseCase
  ) {}

  async execute(
    data: VerifyUserUseCaseInput
  ): Promise<VerifyUserUseCaseOutput> {
    let {email, verificationCode, challengeToken} = data;
    email = email.toLowerCase();

    const challengeValidation =
      await this.validateVerificationChallengeUseCase.execute({
        challengeToken,
        email,
        verificationCode,
      });

    const userVerification = await this.userVerificationRepository.getOne({
      email,
      isDeleted: false,
    });

    if (!userVerification) {
      throw new ErrorResponse(
        "User verification is not found",
        AuthErrorCodes.USER_VERIFICATION_FETCH_ONE_ERROR
      );
    }

    // Verify challenge ID matches stored record
    if (userVerification.challengeId !== challengeValidation.challengeId) {
      throw new ErrorResponse(
        "Challenge ID mismatch. Please request a new verification code",
        AuthErrorCodes.USER_VERIFICATION_EMAIL_MISMATCH_ERROR
      );
    }

    if (userVerification.isVerified) {
      // Generate verification token for already verified users
      const verificationToken = this.generateVerificationToken(
        verificationCode,
        email,
        userVerification.id
      );

      return {
        verified: true,
        message: "Email is already verified",
        verificationId: userVerification.id,
        verificationToken,
      };
    }

    // Double-check verification code (additional security layer)
    if (userVerification.verificationCode !== verificationCode) {
      throw new ErrorResponse(
        "Invalid verification code",
        AuthErrorCodes.USER_VERIFICATION_INVALID_OTP_ERROR
      );
    }

    // Check database expiration as backup
    const now = new Date();

    if (!userVerification.expiresAt || now > userVerification.expiresAt) {
      await this.userVerificationRepository.updateOne(
        {id: userVerification.id},
        {$set: {isDeleted: true}}
      );

      throw new ErrorResponse(
        "Verification code (OTP) has expired",
        AuthErrorCodes.USER_VERIFICATION_EXPIRED_OTP_ERROR
      );
    }

    // Mark as verified
    const updatedVerification = await this.userVerificationRepository.updateOne(
      {id: userVerification.id, isDeleted: false},
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      }
    );

    if (!updatedVerification?.isVerified) {
      throw new ErrorResponse(
        "Failed to verify email",
        AuthErrorCodes.USER_VERIFICATION_EMAIL_VERIFY_ERROR
      );
    }

    // Generate verification token for successful verification
    const verificationToken = this.generateVerificationToken(
      verificationCode,
      email,
      userVerification.id
    );

    return {
      verified: true,
      message: "Email successfully verified through secure challenge",
      verificationId: userVerification.id,
      verificationToken,
    };
  }

  /**
   * Generate a verification token hashed with OTP, email, and secret
   * This token proves the user successfully completed email verification
   */
  private generateVerificationToken(
    otp: string,
    email: string,
    verificationId: string
  ): string {

    const secret = config.auth.verificationTokenSecret!;

    if (!secret) {
      throw new Error("VERIFICATION_TOKEN_SECRET is not configured");
    }

    // Create HMAC hash with OTP, email, and verification ID
    const dataToHash = `${otp}:${email}:${verificationId}`;
    const hashedToken = crypto
      .createHmac("sha256", secret)
      .update(dataToHash)
      .digest("hex");

    // Create JWT token that contains the hash and metadata
    const tokenPayload = {
      hash: hashedToken,
      email,
      verificationId,
      purpose: VerificationChallengePurposes.SIGNUP_AUTHORIZATION,
      verifiedAt: Date.now(),
    };

    return jwt.sign(tokenPayload, secret, {expiresIn: "30m"});
  }
}
