const jwt = require('jsonwebtoken');
import { JWTService, JWTPayload, TokenPair } from './jwt.interface';

// Config
import {config} from "../../config/config";

export class JWTServiceImpl implements JWTService {
  

  generateAccessToken(payload: JWTPayload): string {
    payload.email = payload.email.toLowerCase();
    return jwt.sign(payload, config.auth.accessTokenSecret, {
      expiresIn: parseInt(config.auth.accessTokenExpiry)
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    payload.email = payload.email.toLowerCase();
    return jwt.sign(payload, config.auth.refreshTokenSecret, {
      expiresIn: parseInt(config.auth.refreshTokenExpiry)
    });
  }

  generateTokenPair(payload: JWTPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  verifyAccessToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, config.auth.accessTokenSecret) as JWTPayload;

      return decoded;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, config.auth.refreshTokenSecret) as JWTPayload;

      return decoded;
    } catch (error) {
      return null;
    }
  }
}
