// Libs
import bcrypt from "bcryptjs";

// Repositories
import {UserRepository} from "../../repositories/user.repository";
import {UserVerificationRepository} from "../../repositories/user-verification.repository";

// Entities
import {User} from "../../entities/user.entity";


// Errors
import {ErrorResponse} from "../../../../common/responses/error-response";

// Enums
import {AuthErrorCodes} from "../../../../common/enums/errors/auth-error-codes.enum";

// Utils
import {VerificationTokenValidatorUtil} from "../../utils/verification-token-validator.util";

type SignUserUseCaseInput = {
  email: string;
  password: string;
  verificationToken: string;
};

type SignUserUseCaseOutput = {
  user: Partial<User>;
  message: string;
};

export class SignupUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userVerificationRepository: UserVerificationRepository
  ) {}

  async execute(data: SignUserUseCaseInput): Promise<SignUserUseCaseOutput> {
    let {email, password, verificationToken} = data;
    email = email.toLowerCase();
    
    const tokenValidation = VerificationTokenValidatorUtil.validateToken(
      verificationToken,
      email
    );

    if (!tokenValidation.valid) {

      throw new ErrorResponse(
        `Email verification required: ${tokenValidation.error}`,
        AuthErrorCodes.USER_VERIFICATION_INVALID_TOKEN_ERROR
      );
    }

    const verificationRecord = await this.userVerificationRepository.getOne({
      id: tokenValidation.verificationId,
      email,
      isVerified: true,
      isDeleted: false,
    });

    if (!verificationRecord) {
      throw new ErrorResponse(
        "Verification record not found or invalid",
        AuthErrorCodes.USER_VERIFICATION_FETCH_ONE_ERROR
      );
    }

    if (!verificationRecord.challengeId) {
      throw new ErrorResponse(
        "Invalid verification method. Please complete email verification again",
        AuthErrorCodes.USER_VERIFICATION_CHALLENGE_BREACH_TRY_ERROR
      );
    }

    const existingUser = await this.userRepository.getOne({
      email,
      isDeleted: false,
    });

    if (existingUser) {
      throw new ErrorResponse(
        "User with this email already exists",
        AuthErrorCodes.USER_ALREADY_EXISTS_ERROR
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await this.userRepository.createOne({
      email,
      password: hashedPassword,
    });

    await this.userVerificationRepository.updateOne(
      {id: verificationRecord.id},
      {
        $set: {
          isDeleted: true,
        },
      }
    );

    const {password: _, ...userWithoutPassword} = createdUser;

    return {
      user: userWithoutPassword,
      message: "Account created successfully with verified email",
    };
  }
}
