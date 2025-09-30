import { Request, Response, NextFunction } from "express";

/**
 * Higher-order function that creates a validation middleware
 * Takes a validator function and returns an Express middleware
 * All validators should throw errors when validation fails
 * 
 * @param validator - Function that validates data and throws error if invalid
 * @returns Express middleware function
 */
export const createValidationMiddleware = (validator: (data: any) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Run the validator with request body
      validator(req.body);
      
      // If validation passes, continue to next middleware/route handler
      next();
    } catch (error: any) {
      // If validation fails, return error response
      res.status(400).json({ 
        success: false,
        message: error.message 
      });
    }
  };
};
