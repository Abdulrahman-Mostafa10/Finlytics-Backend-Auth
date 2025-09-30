import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwt/jwt.interface';

export const authenticateToken = (jwtService: JWTService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      });
    }

    const payload = jwtService.verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }

    // Add user info to request
    (req as any).user = payload;
    return next();
  };
};


export const requireRole = (roles: ('user' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions' 
      });
    }

    return next();
  };
};

export const verifyRefreshToken = (jwtService: JWTService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Refresh token required' 
      });
    }

    // Verify the refresh token
    const payload = jwtService.verifyRefreshToken(token);
    if (!payload) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired refresh token' 
      });
    }


    (req as any).user = payload;
    
    return next();
  };
};
