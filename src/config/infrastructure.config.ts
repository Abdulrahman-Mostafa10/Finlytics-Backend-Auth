// Router
import {UserRouter} from "../modules/user/user.route";

// Controller
import {UserController} from "../modules/user/user.controller";

// Repositories
import {UserRepositoryImpl} from "../modules/user/mongodb/repositories-impl/user.repository.impl";
import {UserVerificationRepositoryImpl} from "../modules/user/mongodb/repositories-impl/user-verification.repository.impl";
import {VerificationChallengeRepositoryImpl} from "../modules/user/mongodb/repositories-impl/verification-challenge.repository.impl";
import {PasswordResetRepositoryImpl} from "../modules/user/mongodb/repositories-impl/password-reset.repository.impl";

// Services
import {JWTServiceImpl} from "../services/jwt/jwt.service";

// Models
import UserModel from "../modules/user/mongodb/schemas/user.schema";
import UserVerificationModel from "../modules/user/mongodb/schemas/user-verification.schema";
import VerificationChallengeModel from "../modules/user/mongodb/schemas/verification-challenge.schema";
import {PasswordResetModel} from "../modules/user/mongodb/schemas/password-reset.schema";

// Use Cases
import {SignupUserUseCase} from "../modules/user/usecases/signup/signup-user.usecase";
import {VerifyUserUseCase} from "../modules/user/usecases/signup/verify-user.usecase";
import {SendVerificationCodeUseCase} from "../modules/user/usecases/signup/send-verification-code.usecase";
import {SignupCompletionUseCase} from "../modules/user/usecases/signup-completion.usecase";
import {CreateVerificationChallengeUseCase} from "../modules/user/usecases/signup/create-verification-challenge.usecase";
import {CleanupExpiredChallengesUseCase} from "../modules/user/usecases/signup/cleanup-expired-challenges.usecase";
import {ValidateVerificationChallengeUseCase} from "../modules/user/usecases/signup/validate-verification-challenge.usecase";
import { RefreshTokenUseCase } from "../modules/user/usecases/refresh-token.usecase";
import { LoginUseCase } from "../modules/user/usecases/login.usecase";
import { RequestPasswordResetUseCase } from "../modules/user/usecases/reset-password/request-password-reset.usecase";
import { ResetPasswordUseCase } from "../modules/user/usecases/reset-password/reset-password.usecase";
import { GetUserProfileUseCase } from "../modules/user/usecases/profile/get-user.usecase";
import { DeleteUserUseCase } from "../modules/user/usecases/profile/delete-user.usecase";
import { UpdateUserUseCase } from "../modules/user/usecases/profile/update-user.usecase";
import { UploadProfileImageUseCase } from "../modules/user/usecases/profile/upload-profile-image.usecase";
import { ExtractNationalIDUseCase } from "../modules/user/usecases/extract-national-id";

export interface InfrastructureConfig {
  userRouter: UserRouter;
}

export class InfrastructureConfigBuilder {
  private static instance: InfrastructureConfigBuilder;
  private userRouter: UserRouter | null = null;

  private constructor() {}

  static getInstance(): InfrastructureConfigBuilder {
    if (!InfrastructureConfigBuilder.instance) {
      InfrastructureConfigBuilder.instance = new InfrastructureConfigBuilder();
    }
    return InfrastructureConfigBuilder.instance;
  }

  build(): InfrastructureConfig {
    // Initialize repositories
    const userRepository = new UserRepositoryImpl(UserModel);
    const userVerificationRepository = new UserVerificationRepositoryImpl(
      UserVerificationModel
    );
    const verificationChallengeRepository = new VerificationChallengeRepositoryImpl(
      VerificationChallengeModel
    );
    const passwordResetRepository = new PasswordResetRepositoryImpl(PasswordResetModel);


    // Initialize services
    const jwtService = new JWTServiceImpl();

    // Initialize use cases
    const cleanupExpiredChallengeUseCase = new CleanupExpiredChallengesUseCase(
      verificationChallengeRepository
    );
    
    const createVerificationChallengeUseCase =
      new CreateVerificationChallengeUseCase(
        verificationChallengeRepository,
        cleanupExpiredChallengeUseCase
      );

    const validateVerificationChallenge = new ValidateVerificationChallengeUseCase(verificationChallengeRepository);

    const signupUserUseCase = new SignupUserUseCase(
      userRepository,
      userVerificationRepository
    );

    const signupCompletionUseCase = new SignupCompletionUseCase(userRepository);

    const verifyUserUseCase = new VerifyUserUseCase(
      userVerificationRepository,
      validateVerificationChallenge
    );
    
    const sendVerificationCodeUseCase = new SendVerificationCodeUseCase(
      userVerificationRepository,
      createVerificationChallengeUseCase
    );

    const refreshTokenUseCase = new RefreshTokenUseCase(jwtService);
    const loginUseCase = new LoginUseCase(userRepository, jwtService);
    const requestPasswordResetUseCase = new RequestPasswordResetUseCase(passwordResetRepository);
    const resetPasswordUseCase = new ResetPasswordUseCase(passwordResetRepository, userRepository);
    const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository);
    const uploadProfileImageUseCase = new UploadProfileImageUseCase(userRepository);
    const extractNationalIDUseCase = new ExtractNationalIDUseCase();

    // Initialize controller
    const userController = new UserController(
      signupUserUseCase,
      verifyUserUseCase,
      sendVerificationCodeUseCase,
      signupCompletionUseCase,
      refreshTokenUseCase,
      loginUseCase,
      requestPasswordResetUseCase,
      resetPasswordUseCase,
      getUserProfileUseCase,
      deleteUserUseCase,
      updateUserUseCase,
      uploadProfileImageUseCase,
      extractNationalIDUseCase
    );

    // Initialize router
    this.userRouter = new UserRouter(userController, jwtService);


    return {
      userRouter: this.userRouter,
    };
  }
}

// Export a function to get the infrastructure configuration
export const getInfrastructureConfig = (): InfrastructureConfig => {
  return InfrastructureConfigBuilder.getInstance().build();
};
