// Libs
import jwt from "jsonwebtoken";

// Config
import {config} from "../../../config/config";

// Enums
export interface VerificationTokenPayload {
  hash: string;
  email: string;
  verificationId: string;
  purpose: string;
  iat: number;
  exp: number;
}

export class VerificationTokenValidatorUtil {
  static validateToken(
    token: string,
    expectedEmail: string
  ): {
    valid: boolean;
    error?: string;
    payload?: VerificationTokenPayload;
    verificationId?: string;
  } {
    try {
      const secret = config.auth.verificationTokenSecret!;

      const decoded = jwt.verify(token, secret) as VerificationTokenPayload;

      if (decoded.email !== expectedEmail) {
        return {valid: false, error: "Email mismatch in verification token"};
      }

      return {
        valid: true,
        payload: decoded,
        verificationId: decoded.verificationId,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {valid: false, error: "Verification token has expired"};
      } else if (error instanceof jwt.JsonWebTokenError) {
        return {valid: false, error: "Invalid verification token"};
      }

      return {valid: false, error: "Token validation failed"};
    }
  }
}
