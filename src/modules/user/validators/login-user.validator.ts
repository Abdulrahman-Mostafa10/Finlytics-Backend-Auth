import Joi from 'joi';

export interface LoginInput {
  email: string;
  password: string;
}

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
});

export class LoginUserJoiValidator {
  static validate(input: LoginInput): void {
    const { error } = loginSchema.validate(input, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(", ");
      throw new Error(errorMessages);
    }
  }
}
