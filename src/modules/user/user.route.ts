import {Router} from "express";

// Controller
import {UserController} from "./user.controller";

// Middleware
import { createValidationMiddleware } from "../../middleware/validation.middleware";
import { emailRateLimiter } from "../../middleware/email-limiter.middleware";
import { verifyRefreshToken, authenticateToken } from "../../middleware/auth.middleware";

/// Validators
import { SendVerificationCodeJoiValidator } from "./validators/send-verification-code.validator";
import { SignupUserJoiValidator } from "./validators/signup-user.validator";
import { SignupCompletionJoiValidator } from "./validators/signup-completion.validator";
import { LoginUserJoiValidator } from "./validators/login-user.validator";
import { UpdateUserJoiValidator } from "./validators/update-user.validator";
import { ResetPasswordJoiValidator } from "./validators/reset-password.validator";
import { UploadProfileImageJoiValidator } from "./validators/upload-profile-image.validator";
import { ExtractNationalIDJoiValidator } from "./validators/extract-national-id.validator";

// Services
import { JWTService } from "../../services/jwt/jwt.interface";


// Router as a class
export class UserRouter {
  public router: Router;


  constructor(
    private userController: UserController,
    private jwtService: JWTService
  ) {
    this.router = Router();
    this.routes();
  }

  private routes() {
    // Email verification flow
    this.router.post("/send-verification-code", 
      createValidationMiddleware(SendVerificationCodeJoiValidator.validate),
      (req, res) => this.userController.sendVerificationCode(req, res)
    );

    this.router.post("/verify", (req, res) =>
      this.userController.verify(req, res)
    );

    this.router.post("/signup", 
      createValidationMiddleware(SignupUserJoiValidator.validate),
      (req, res) => this.userController.signup(req, res)
    );

    this.router.post("/signup-completion", 
      createValidationMiddleware(SignupCompletionJoiValidator.validate),
      (req, res) => this.userController.signupCompletion(req, res)
    );

    // Authentication flow
    this.router.post("/login", 
      createValidationMiddleware(LoginUserJoiValidator.validate),
      emailRateLimiter,
      (req, res) => this.userController.login(req, res)
    );

    this.router.post("/refresh-token", 
      verifyRefreshToken(this.jwtService),
      (req, res) => this.userController.refreshToken(req, res)
    );

    this.router.post("/request-reset-password", 
      createValidationMiddleware(SendVerificationCodeJoiValidator.validate),
      emailRateLimiter,
      (req, res) => this.userController.requestResetPassword(req, res)
    );

    this.router.post("/reset-password", 
      createValidationMiddleware(ResetPasswordJoiValidator.validate),
      emailRateLimiter,
      (req, res) => this.userController.resetPassword(req, res)
    );

    this.router.get("/profile/:id", 
      (req, res) => this.userController.getUserProfile(req, res)
    );

    this.router.delete("/profile", 
      authenticateToken(this.jwtService),
      (req, res) => this.userController.deleteUserProfile(req, res)
    );

    this.router.put("/profile", 
      createValidationMiddleware(UpdateUserJoiValidator.validate),
      authenticateToken(this.jwtService),
      (req, res) => this.userController.UpdateUserProfile(req, res)
    );

    this.router.put("/profile/upload-image", 
      createValidationMiddleware(UploadProfileImageJoiValidator.validate),
      authenticateToken(this.jwtService),
      (req, res) => this.userController.UploadProfileImage(req, res)
    );

    this.router.post("/ocr/national-id", 
      createValidationMiddleware(ExtractNationalIDJoiValidator.validate),
      (req, res) => this.userController.extractNationalID(req, res)
    );
  }
}
