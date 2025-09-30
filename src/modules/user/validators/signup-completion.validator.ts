import Joi from "joi";

export interface SignupCompletionInput {
  email: string;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  maritalStatus: string;
  profession: string;
  gender: string;
  address: string;
}

export class SignupCompletionJoiValidator {
  static validate(input: SignupCompletionInput): void {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
      }),
      dateOfBirth: Joi.date().required().messages({
        "date.base": "Date of birth must be a valid date",
        "any.required": "Date of birth is required",
      }),
      firstName: Joi.string().required().min(2).max(50).messages({
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name cannot exceed 50 characters",
      }),
      lastName: Joi.string().required().min(2).max(50).messages({
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters long",
        "string.max": "Last name cannot exceed 50 characters",
      }),
      maritalStatus: Joi.string()
      .valid("single", "married", "divorced", "widowed")
      .insensitive()
      .required()
      .messages({
        "string.empty": "Marital status is required",
        "any.only": "Marital status must be one of: single, married, divorced, widowed",
        "string.base": "Marital status must be a string",
      }),
      profession: Joi.string().required().min(2).max(100).messages({
        "string.empty": "Profession is required",
        "string.min": "Profession must be at least 2 characters long",
        "string.max": "Profession cannot exceed 100 characters",
      }),
      gender: Joi.string().required().valid('male', 'female', 'other').messages({
        "string.empty": "Gender is required",
        "any.only": "Gender must be one of: male, female, other",
      }),
      address: Joi.string().required().min(5).max(200).messages({
        "string.empty": "Address is required",
        "string.min": "Address must be at least 5 characters long",
        "string.max": "Address cannot exceed 200 characters",
      }),
    });

    const { error } = schema.validate(input);
    if (error) {
      throw new Error(error.details[0].message);
    }
  }
}
