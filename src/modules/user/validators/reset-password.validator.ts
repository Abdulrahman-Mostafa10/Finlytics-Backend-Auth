import Joi from "joi";

export interface ResetPasswordInput {
  email: string;
  verificationCode: string;
  newPassword: string;
}

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
    }),
    verificationCode: Joi.string().length(6).required().messages({
        "string.length": "Verification code must be exactly 6 characters",
        "string.empty": "Verification code is required",
    }),
    newPassword: Joi.string()
    .required()
    .min(8)
    .custom((value, helpers) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasSpecialChar = /[!@#$%^&*]/.test(value);
        
        if (!hasUpperCase) {
        return helpers.error('string.password.uppercase');
        }
        if (!hasLowerCase) {
        return helpers.error('string.password.lowercase');
        }
        if (!hasSpecialChar) {
        return helpers.error('string.password.special');
        }
        
        return value;
    })
    .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.password.uppercase": "Password must include at least one uppercase letter",
        "string.password.lowercase": "Password must include at least one lowercase letter",
        "string.password.special": "Password must include at least one special character (!@#$%^&*)",
    }),
});

export class ResetPasswordJoiValidator {
  static validate(input: ResetPasswordInput): void {
    //console.log("Reset password validator called");
    const { error } = resetPasswordSchema.validate(input, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(errorMessages);
    }
  }
}
