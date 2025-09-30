import Joi from "joi";

export interface SignupUserInput {
  email: string;
  password: string;
  verificationToken: string;
}

const signupUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .custom((value, helpers) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*/(),.?":{}|<>]/.test(value);
      
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
  verificationToken: Joi.string().required().messages({
    'string.empty': 'Verification token is required',
    'any.required': 'Verification token is required'
  })
});

export class SignupUserJoiValidator {
  static validate(input: SignupUserInput): void {
    
    const { error } = signupUserSchema.validate(input, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(errorMessages);
    }
  }
}
