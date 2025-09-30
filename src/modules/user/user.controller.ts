import { Request, Response } from "express";

// Common
import { ErrorResponse } from "../../common/responses/error-response";

// Use Cases
import { SignupUserUseCase } from "./usecases/signup/signup-user.usecase";
import { VerifyUserUseCase } from "./usecases/signup/verify-user.usecase";
import { SendVerificationCodeUseCase } from "./usecases/signup/send-verification-code.usecase";
import { LoginUseCase } from "./usecases/login.usecase";
import { RefreshTokenUseCase } from "./usecases/refresh-token.usecase";
import { SignupCompletionUseCase } from "./usecases/signup-completion.usecase";
import { UpdateUserUseCase } from "./usecases/profile/update-user.usecase";
import { RequestPasswordResetUseCase } from "./usecases/reset-password/request-password-reset.usecase";
import { ResetPasswordUseCase } from "./usecases/reset-password/reset-password.usecase";
import { GetUserProfileUseCase } from "./usecases/profile/get-user.usecase";
import { DeleteUserUseCase } from "./usecases/profile/delete-user.usecase";
import { UploadProfileImageUseCase } from "./usecases/profile/upload-profile-image.usecase";
import { ExtractNationalIDUseCase } from "./usecases/extract-national-id";


export class UserController {
  constructor(
    private signupUserUseCase: SignupUserUseCase,
    private verifyUserUseCase: VerifyUserUseCase,
    private sendVerificationCodeUseCase: SendVerificationCodeUseCase,
    private signupCompletionUseCase: SignupCompletionUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase,
    private loginUseCase: LoginUseCase,
    private requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private getUserProfileUseCase: GetUserProfileUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private uploadProfileImageUseCase: UploadProfileImageUseCase,
    private extractNationalIdUseCase: ExtractNationalIDUseCase
  ) {}

  // POST /v1/users/signup
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {email, password, verificationToken} =
        req.body;

      const result = await this.signupUserUseCase.execute({
        email,
        password,
        verificationToken,
      });

      res.status(201).json({
        message: result.message,
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({message: error.message});
    }
  }


  // POST /v1/users/verify
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const {email, code, challengeToken} = req.body;

      if (!email || !code) {
        res.status(400).json({message: "Email and code are required."});
        return;
      }

      const user = await this.verifyUserUseCase.execute({
        email,
        challengeToken,
        verificationCode: code,
      });

      res.status(200).json({message: "User verified successfully", user});
    } catch (error: any) {
      res.status(400).json({message: error.message});
    }
  }


  // POST /v1/users/send-verification-code
  async sendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const {email} = req.body;

      const result = await this.sendVerificationCodeUseCase.execute({email});

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({message: error.message});
    }
  }

  // POST /v1/users/signup-completion
  async signupCompletion(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        dateOfBirth,
        firstName,
        lastName,
        maritalStatus,
        profession,
        gender,
        address
      } = req.body;

      const result = await this.signupCompletionUseCase.execute({
        email,
        dateOfBirth,
        firstName,
        lastName,
        maritalStatus,
        profession,
        gender,
        address,
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          user: result.user,
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }


  // POST /v1/users/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.loginUseCase.execute({ email, password });

      if (result.success) {

        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            user: result.data?.user,
            accessToken: result.data?.tokens.accessToken,
            refreshToken: result.data?.tokens.refreshToken
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.error || 'Login failed'
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }


  // POST /v1/users/refresh-token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Refresh token is already validated by middleware
      const userPayload = (req as any).user;

      const result = await this.refreshTokenUseCase.execute({ userPayload });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          accessToken: result.accessToken
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }

  // POST /v1/users/request-reset-password
  async requestResetPassword(req: Request, res: Response): Promise<void> {
    try {

      console.log("Request reset password controller called");
      const { email } = req.body;
      const result = await this.requestPasswordResetUseCase.execute({ email });

      if(result.success){
        res.status(200).json({
          success: true,
          message: result.message,
        });
      }
      else{
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      if (error instanceof ErrorResponse) {
        res.status(400).json({ 
          success: false,
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false,
          message: error.message || 'Internal server error' 
        });
      }
    }
  }

  // POST /v1/users/reset-password
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log("Reset password controller called");
      const { email, verificationCode, newPassword } = req.body;

      const result = await this.resetPasswordUseCase.execute({
        email,
        verificationCode,
        newPassword,
      });

      if(result.success){
        res.status(200).json({
          success: true,
          message: result.message,
        });
      }
      else{
        res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error: any) {
      if (error instanceof ErrorResponse) {
        res.status(400).json({ 
          success: false,
          message: error.message 
        });
      } else {
        res.status(500).json({ 
          success: false,
          message: error.message || 'Internal server error' 
        });
      }
    }
  }

  // GET /v1/users/profile/:id
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      // Extract target user ID from route parameters
      const targetUserId = req.params.id;
      
      if (!targetUserId) {
        res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
        return;
      }

      const result = await this.getUserProfileUseCase.execute({ 
        targetUserId 
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        res.status(404).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }

  // DELETE /v1/users/profile
  async deleteUserProfile(req: Request, res: Response): Promise<void> {
    try {
      // Extract userId from JWT token (set by auth middleware)
      const userPayload = (req as any).user;
      
      const result = await this.deleteUserUseCase.execute({ 
        userId: userPayload.userId 
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }

  // PUT /v1/users/profile
  async UpdateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      // Extract userId from JWT token (set by auth middleware)
      const userPayload = (req as any).user;
      
      const result = await this.updateUserUseCase.execute({ 
        userId: userPayload.userId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        maritalStatus: req.body.maritalStatus,
        profession: req.body.profession,
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }

  // PUT /v1/users/profile/upload-image
  async UploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      // Extract userId from JWT token (set by auth middleware)
      const userPayload = (req as any).user;
      
      const result = await this.uploadProfileImageUseCase.execute({ 
        userId: userPayload.userId,
        profileImage: req.body.profileImage,
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        message: error.message || 'Internal server error' 
      });
    }
  }

    // POST /v1/users/ocr/national-id
    async extractNationalID(req: Request, res: Response): Promise<void> {
      try {
        const { front_base64, back_base64 } = req.body;

        const result = await this.extractNationalIdUseCase.execute({
          front_base64,
          back_base64,
        });

        if (result.success) {
          res.status(200).json({
            success: true,
            message: result.message,
            data: result.data
          });
        } else {
          res.status(400).json({
            success: false,
            message: result.message
          });
        }
      } catch (error: any) {
        res.status(500).json({ 
          success: false,
          message: error.message || 'Internal server error' 
        });
      }
    }
}
